'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/entitties';
import { getAllStudents } from '@/backend_requests/students/getAllStudents';
import { createStudent } from '@/backend_requests/students/createStudent';
import { updateStudent } from '@/backend_requests/students/updateStudent';
import { deleteStudent } from '@/backend_requests/students/deleteStudent';
import { AddEntityForm } from '@/components/AdminPage/AddEntityForm';
import { EditEntityModal } from '@/components/AdminPage/EditEntityModal';
import { DeleteEntityModal } from '@/components/AdminPage/DeleteEntityModal';
import { Input } from '@heroui/input';

const Page = () => {
	const router = useRouter();
	const [students, setStudents] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState<User | null>(null);
	const [deletingStudent, setDeletingStudent] = useState<User | null>(null);
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

	// Charger la liste des étudiants
	const loadStudents = async () => {
		setLoading(true);
		const response = await getAllStudents();
		if ('data' in response) {
			setStudents(response.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadStudents();
	}, []);

	// Gérer la création d'un étudiant
	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccessMessage('');

		const response = await createStudent({
			lastName: createFormData.lastName,
			name: createFormData.name,
			email: createFormData.email,
			password: createFormData.password,
			avatarPath: createFormData.avatarPath || undefined,
		});

		if ('data' in response) {
			setSuccessMessage('Étudiant créé avec succès');
			setCreateFormData({
				lastName: '',
				name: '',
				email: '',
				password: '',
				avatarPath: '',
			});
			loadStudents();
		} else {
			setError('message' in response ? response.message : 'Erreur lors de la création');
		}
	};

	// Ouvrir le modal pour modifier un étudiant
	const openEditModal = (student: User) => {
		setEditingStudent(student);
		setError('');
		setIsEditModalOpen(true);
	};

	// Ouvrir le modal de confirmation de suppression
	const openDeleteModal = (student: User) => {
		setDeletingStudent(student);
		setIsDeleteModalOpen(true);
	};

	// Gérer la suppression
	const handleDelete = async () => {
		if (!deletingStudent) return;

		const response = await deleteStudent(deletingStudent.idUser);
		if ('message' in response) {
			setSuccessMessage('Étudiant supprimé avec succès');
			setIsDeleteModalOpen(false);
			setDeletingStudent(null);
			loadStudents();
		} else {
			setError('Erreur lors de la suppression');
		}
	};

	// Filtrer les étudiants selon la recherche
	const filteredStudents = students.filter((student) => `${student.name} ${student.lastName} ${student.email}`.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="flex flex-col gap-6 p-8 w-full bg-gray-50 min-h-screen">
			{/* Formulaire d'ajout */}
			<AddEntityForm
				title="Ajouter un Élève"
				icon="👤"
				iconBgColor="bg-blue-500"
				submitButtonText="+ Ajouter l'élève"
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

			{/* Liste des élèves */}
			<div className="bg-white rounded-lg shadow">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-800">Liste des Élèves</h2>
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
						<p className="mt-4 text-gray-600">Chargement des étudiants...</p>
					</div>
				) : filteredStudents.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-600 text-lg">{searchTerm ? 'Aucun étudiant trouvé pour cette recherche' : 'Aucun étudiant trouvé'}</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÉLÈVE</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredStudents.map((student) => (
									<tr key={student.idUser} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/students/${student.idUser}`)}>
											<div className="flex items-center gap-3">
												{student.avatarPath ? (
													<img src={student.avatarPath} alt={`${student.name} ${student.lastName}`} className="w-10 h-10 rounded-full object-cover" />
												) : (
													<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
														{student.name[0]}
														{student.lastName[0]}
													</div>
												)}
												<div>
													<div className="font-medium text-gray-900">
														{student.name} {student.lastName}
													</div>
													<div className="text-sm text-gray-500">ID: ST{student.idUser.toString().padStart(3, '0')}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => router.push(`/admin/students/${student.idUser}`)}>
											{student.email}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={(e) => {
														e.stopPropagation();
														openEditModal(student);
													}}
													className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
												>
													Modifier
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														openDeleteModal(student);
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

				{!loading && filteredStudents.length > 0 && (
					<div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
						Affichage de 1 à {filteredStudents.length} sur {filteredStudents.length} résultats
					</div>
				)}
			</div>

			{/* Modal de modification */}
			<EditEntityModal<Pick<User, 'lastName' | 'name' | 'email'>>
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setEditingStudent(null);
					setError('');
				}}
				entity={editingStudent ? { lastName: editingStudent.lastName, name: editingStudent.name, email: editingStudent.email } : null}
				title="Modifier un étudiant"
				initialData={{ lastName: '', name: '', email: '' }}
				onSave={async (studentData) => {
					const result = await updateStudent(editingStudent!.idUser, studentData);
					if ('error' in result) {
						const errorMessage = 'message' in result ? result.message : 'Erreur de validation';
						setError(errorMessage);
						throw new Error(errorMessage);
					}
					setIsEditModalOpen(false);
					setEditingStudent(null);
					setError('');
					await loadStudents();
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
					setDeletingStudent(null);
					setError('');
				}}
				onConfirm={handleDelete}
				title="Confirmer la suppression"
				message={
					deletingStudent && (
						<>
							Êtes-vous sûr de vouloir supprimer l'étudiant{' '}
							<span className="font-semibold text-gray-900">
								{deletingStudent.name} {deletingStudent.lastName}
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
