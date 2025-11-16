'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/entitties';
import { getAllTeachers } from '@/backend_requests/teachers/getAllTeachers';
import { createTeacher } from '@/backend_requests/teachers/createTeacher';
import { updateTeacher } from '@/backend_requests/teachers/updateTeacher';
import { deleteTeacher } from '@/backend_requests/teachers/deleteTeacher';
import { AddEntityForm } from '@/components/AdminPage/AddEntityForm';
import { EditEntityModal } from '@/components/AdminPage/EditEntityModal';
import { DeleteEntityModal } from '@/components/AdminPage/DeleteEntityModal';
import { Input } from '@heroui/input';

const Page = () => {
	const router = useRouter();
	const [teachers, setTeachers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
	const [deletingTeacher, setDeletingTeacher] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [createFormData, setCreateFormData] = useState({
		lastName: '',
		name: '',
		email: '',
		password: '',
		avatarPath: '',
	});
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Charger la liste des enseignants
	const loadTeachers = async () => {
		setLoading(true);
		const response = await getAllTeachers();
		if ('data' in response) {
			setTeachers(response.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadTeachers();
	}, []);

	// Gérer la création d'un enseignant
	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccessMessage('');

		const response = await createTeacher({
			lastName: createFormData.lastName,
			name: createFormData.name,
			email: createFormData.email,
			password: createFormData.password,
			avatarPath: createFormData.avatarPath || undefined,
		});

		if ('data' in response) {
			setSuccessMessage('Enseignant créé avec succès');
			setCreateFormData({
				lastName: '',
				name: '',
				email: '',
				password: '',
				avatarPath: '',
			});
			loadTeachers();
		} else {
			setError('message' in response ? response.message : 'Erreur lors de la création');
		}
	};

	// Ouvrir le modal pour modifier un enseignant
	const openEditModal = (teacher: User) => {
		setEditingTeacher(teacher);
		setError('');
		setIsEditModalOpen(true);
	};

	// Ouvrir le modal de confirmation de suppression
	const openDeleteModal = (teacher: User) => {
		setDeletingTeacher(teacher);
		setIsDeleteModalOpen(true);
	};

	// Gérer la suppression
	const handleDelete = async () => {
		if (!deletingTeacher) return;

		const response = await deleteTeacher(deletingTeacher.idUser);
		if ('message' in response) {
			setSuccessMessage('Enseignant supprimé avec succès');
			setIsDeleteModalOpen(false);
			setDeletingTeacher(null);
			loadTeachers();
		} else {
			setError('Erreur lors de la suppression');
		}
	};

	// Filtrer les enseignants selon la recherche
	const filteredTeachers = teachers.filter((teacher) => `${teacher.name} ${teacher.lastName} ${teacher.email}`.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="flex flex-col gap-6 p-8 w-full bg-gray-50 min-h-screen">
			{/* Formulaire d'ajout */}
			<AddEntityForm
				title="Ajouter un Enseignant"
				icon="👨‍🏫"
				iconBgColor="bg-blue-500"
				submitButtonText="+ Ajouter l'enseignant"
				onSubmit={handleCreate}
				error={error}
				successMessage={successMessage}
				onClearError={() => setError('')}
				onClearSuccess={() => setSuccessMessage('')}
			>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<Input
						type="text"
						label="Prénom"
						placeholder="Entrez le prénom"
						value={createFormData.name}
						onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
						isRequired
						variant="bordered"
						classNames={{
							label: 'text-gray-700 font-medium',
							input: 'text-gray-900',
						}}
					/>

					<Input
						type="text"
						label="Nom"
						placeholder="Entrez le nom"
						value={createFormData.lastName}
						onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
						isRequired
						variant="bordered"
						classNames={{
							label: 'text-gray-700 font-medium',
							input: 'text-gray-900',
						}}
					/>

					<Input
						type="email"
						label="Email"
						placeholder="exemple@email.com"
						value={createFormData.email}
						onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
						isRequired
						variant="bordered"
						classNames={{
							label: 'text-gray-700 font-medium',
							input: 'text-gray-900',
						}}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						type="password"
						label="Mot de passe"
						placeholder="••••••••"
						value={createFormData.password}
						onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
						isRequired
						variant="bordered"
						classNames={{
							label: 'text-gray-700 font-medium',
							input: 'text-gray-900',
						}}
					/>

					<Input
						type="url"
						label="Avatar (URL)"
						placeholder="https://exemple.com/avatar.jpg"
						value={createFormData.avatarPath}
						onChange={(e) => setCreateFormData({ ...createFormData, avatarPath: e.target.value })}
						variant="bordered"
						classNames={{
							label: 'text-gray-700 font-medium',
							input: 'text-gray-900',
						}}
					/>
				</div>
			</AddEntityForm>

			{/* Liste des enseignants */}
			<div className="bg-white rounded-lg shadow">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-800">Liste des Enseignants</h2>
						<div className="flex items-center gap-4">
							<div className="relative">
								<input
									type="text"
									placeholder="Rechercher..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
							</div>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="p-12 text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-gray-600">Chargement des enseignants...</p>
					</div>
				) : filteredTeachers.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-600 text-lg">{searchTerm ? 'Aucun enseignant trouvé pour cette recherche' : 'Aucun enseignant trouvé'}</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENSEIGNANT</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredTeachers.map((teacher) => (
									<tr key={teacher.idUser} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/teachers/${teacher.idUser}`)}>
											<div className="flex items-center gap-3">
												{teacher.avatarPath ? (
													<img src={teacher.avatarPath} alt={`${teacher.name} ${teacher.lastName}`} className="w-10 h-10 rounded-full object-cover" />
												) : (
													<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
														{teacher.name[0]}
														{teacher.lastName[0]}
													</div>
												)}
												<div>
													<div className="font-medium text-gray-900">
														{teacher.name} {teacher.lastName}
													</div>
													<div className="text-sm text-gray-500">ID: TC{teacher.idUser.toString().padStart(3, '0')}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => router.push(`/admin/teachers/${teacher.idUser}`)}>
											{teacher.email}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={(e) => {
														e.stopPropagation();
														openEditModal(teacher);
													}}
													className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
												>
													Modifier
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														openDeleteModal(teacher);
													}}
													className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
												>
													Supprimer
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!loading && filteredTeachers.length > 0 && (
					<div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
						Affichage de 1 à {filteredTeachers.length} sur {filteredTeachers.length} résultats
					</div>
				)}
			</div>

			{/* Modal de modification */}
			<EditEntityModal<Pick<User, 'lastName' | 'name' | 'email'>>
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setEditingTeacher(null);
					setError('');
				}}
				entity={editingTeacher ? { lastName: editingTeacher.lastName, name: editingTeacher.name, email: editingTeacher.email } : null}
				title="Modifier un enseignant"
				initialData={{ lastName: '', name: '', email: '' }}
				onSave={async (teacherData: Pick<User, 'lastName' | 'name' | 'email'>) => {
					const result = await updateTeacher(editingTeacher!.idUser, teacherData);
					if ('error' in result) {
						const errorMessage = 'message' in result ? result.message : 'Erreur de validation';
						setError(errorMessage);
						throw new Error(errorMessage);
					}
					setIsEditModalOpen(false);
					setEditingTeacher(null);
					setError('');
					await loadTeachers();
				}}
				error={error}
			>
				{(data, onChange) => (
					<div className="space-y-4">
						<Input
							type="text"
							label="Prénom"
							placeholder="Entrez le prénom"
							value={data.name}
							onChange={(e) => onChange('name', e.target.value)}
							isRequired
							variant="bordered"
							classNames={{
								label: 'text-gray-700 font-medium',
								input: 'text-gray-900',
							}}
						/>

						<Input
							type="text"
							label="Nom"
							placeholder="Entrez le nom"
							value={data.lastName}
							onChange={(e) => onChange('lastName', e.target.value)}
							isRequired
							variant="bordered"
							classNames={{
								label: 'text-gray-700 font-medium',
								input: 'text-gray-900',
							}}
						/>

						<Input
							type="email"
							label="Email"
							placeholder="exemple@email.com"
							value={data.email}
							onChange={(e) => onChange('email', e.target.value)}
							isRequired
							variant="bordered"
							classNames={{
								label: 'text-gray-700 font-medium',
								input: 'text-gray-900',
							}}
						/>
					</div>
				)}
			</EditEntityModal>

			{/* Modal de confirmation de suppression */}
			<DeleteEntityModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setDeletingTeacher(null);
					setError('');
				}}
				onConfirm={handleDelete}
				title="Confirmer la suppression"
				message={
					deletingTeacher && (
						<>
							Êtes-vous sûr de vouloir supprimer l'enseignant{' '}
							<span className="font-semibold text-gray-900">
								{deletingTeacher.name} {deletingTeacher.lastName}
							</span>{' '}
							?
						</>
					)
				}
				error={error}
			/>
		</div>
	);
};

export default Page;
