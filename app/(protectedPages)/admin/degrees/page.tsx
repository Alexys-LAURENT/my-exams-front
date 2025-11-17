'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Degree } from '@/types/entitties';
import { getAllDegrees } from '@/backend_requests/degrees/getAllDegrees';
import { createDegree } from '@/backend_requests/degrees/createDegree';
import { updateDegree } from '@/backend_requests/degrees/updateDegree';
import { deleteDegree } from '@/backend_requests/degrees/deleteDegree';
import { AddEntityForm } from '@/components/AdminPage/AddEntityForm';
import { EditEntityModal } from '@/components/AdminPage/EditEntityModal';
import { DeleteEntityModal } from '@/components/AdminPage/DeleteEntityModal';
import { Input } from '@heroui/input';

const Page = () => {
	const router = useRouter();
	const [degrees, setDegrees] = useState<Degree[]>([]);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingDegree, setEditingDegree] = useState<Degree | null>(null);
	const [deletingDegree, setDeletingDegree] = useState<Degree | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [createFormData, setCreateFormData] = useState({
		name: '',
	});
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Charger la liste des diplômes
	const loadDegrees = async () => {
		setLoading(true);
		const response = await getAllDegrees();
		if ('data' in response) {
			setDegrees(response.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadDegrees();
	}, []);

	// Gérer la création d'un diplôme
	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccessMessage('');

		const response = await createDegree({
			name: createFormData.name,
		});

		if ('data' in response) {
			setSuccessMessage('Diplôme créé avec succès');
			setCreateFormData({
				name: '',
			});
			loadDegrees();
		} else {
			setError('message' in response ? response.message : 'Erreur lors de la création');
		}
	};

	// Ouvrir le modal pour modifier un diplôme
	const openEditModal = (degree: Degree) => {
		setEditingDegree(degree);
		setError('');
		setIsEditModalOpen(true);
	};

	// Ouvrir le modal de confirmation de suppression
	const openDeleteModal = (degree: Degree) => {
		setDeletingDegree(degree);
		setIsDeleteModalOpen(true);
	};

	// Gérer la suppression
	const handleDelete = async () => {
		if (!deletingDegree) return;

		const response = await deleteDegree(deletingDegree.idDegree);
		if ('message' in response) {
			setSuccessMessage('Diplôme supprimé avec succès');
			setIsDeleteModalOpen(false);
			setDeletingDegree(null);
			loadDegrees();
		} else {
			setError('Erreur lors de la suppression');
		}
	};

	// Filtrer les diplômes selon la recherche
	const filteredDegrees = degrees.filter((degree) => degree.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="flex flex-col gap-6 p-8 w-full bg-gray-50 min-h-screen">
			{/* Formulaire d'ajout */}
			<AddEntityForm
				title="Ajouter un Diplôme"
				icon="🎓"
				iconBgColor="bg-purple-500"
				submitButtonText="+ Ajouter le diplôme"
				onSubmit={handleCreate}
				error={error}
				successMessage={successMessage}
				onClearError={() => setError('')}
				onClearSuccess={() => setSuccessMessage('')}
			>
				<Input
					type="text"
					label="Nom du diplôme"
					placeholder="Ex: Licence Informatique, Master MIAGE..."
					value={createFormData.name}
					onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
					isRequired
					variant="bordered"
					classNames={{
						label: 'text-gray-700 font-medium',
						input: 'text-gray-900',
					}}
				/>
			</AddEntityForm>

			{/* Liste des diplômes */}
			<div className="bg-white rounded-lg shadow">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-800">Liste des Diplômes</h2>
						<div className="flex items-center gap-4">
							<div className="relative">
								<input
									type="text"
									placeholder="Rechercher..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
								<span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
							</div>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="p-12 text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
						<p className="mt-4 text-gray-600">Chargement des diplômes...</p>
					</div>
				) : filteredDegrees.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-600 text-lg">{searchTerm ? 'Aucun diplôme trouvé pour cette recherche' : 'Aucun diplôme trouvé'}</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOM DU DIPLÔME</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE DE CRÉATION</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredDegrees.map((degree) => (
									<tr key={degree.idDegree} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/degrees/${degree.idDegree}`)}>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">🎓</div>
												<div className="text-sm font-medium text-gray-900">DG{degree.idDegree.toString().padStart(3, '0')}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/degrees/${degree.idDegree}`)}>
											<div className="font-medium text-gray-900">{degree.name}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => router.push(`/admin/degrees/${degree.idDegree}`)}>
											{new Date(degree.createdAt).toLocaleDateString('fr-FR', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											})}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={(e) => {
														e.stopPropagation();
														openEditModal(degree);
													}}
													className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
												>
													Modifier
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														openDeleteModal(degree);
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

				{!loading && filteredDegrees.length > 0 && (
					<div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
						Affichage de 1 à {filteredDegrees.length} sur {filteredDegrees.length} résultats
					</div>
				)}
			</div>

			{/* Modal de modification */}
			<EditEntityModal<Pick<Degree, 'name'>>
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setEditingDegree(null);
					setError('');
				}}
				entity={editingDegree ? { name: editingDegree.name } : null}
				title="Modifier un diplôme"
				initialData={{ name: '' }}
				onSave={async (degreeData: Pick<Degree, 'name'>) => {
					const result = await updateDegree(editingDegree!.idDegree, degreeData);
					if ('error' in result) {
						const errorMessage = 'message' in result ? result.message : 'Erreur de validation';
						setError(errorMessage);
						throw new Error(errorMessage);
					}
					setIsEditModalOpen(false);
					setEditingDegree(null);
					setError('');
					await loadDegrees();
				}}
				error={error}
			>
				{(data: Pick<Degree, 'name'>, onChange: (field: keyof Pick<Degree, 'name'>, value: string) => void) => (
					<div className="space-y-4">
						<Input
							type="text"
							label="Nom du diplôme"
							placeholder="Ex: Licence Informatique, Master MIAGE..."
							value={data.name}
							onChange={(e) => onChange('name', e.target.value)}
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
					setDeletingDegree(null);
					setError('');
				}}
				onConfirm={handleDelete}
				title="Confirmer la suppression"
				message={
					deletingDegree && (
						<>
							Êtes-vous sûr de vouloir supprimer le diplôme <span className="font-semibold text-gray-900">{deletingDegree.name}</span> ?
						</>
					)
				}
				error={error}
			/>
		</div>
	);
};

export default Page;
