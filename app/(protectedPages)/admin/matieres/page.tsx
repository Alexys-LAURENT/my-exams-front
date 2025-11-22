import { getAllMatieres } from '@/backend_requests/matieres/getAllMatieres';
import { CreateMatiereButton, DeleteMatiereButton, EditMatiereButton } from '@/components/AdminMatierePage';
import { SearchFilter } from '@/components/AdminPage/SearchFilter';

interface PageProps {
	searchParams: Promise<{ search?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
	const { search } = await searchParams;

	const matieresResponse = await getAllMatieres();
	if (!('success' in matieresResponse) || !matieresResponse.success) {
		throw new Error('Impossible de récupérer les matières');
	}

	let matieres = matieresResponse.data;

	// Filtrer les matières si un terme de recherche est présent
	if (search) {
		const searchLower = search.toLowerCase();
		matieres = matieres.filter((matiere) => matiere.nom.toLowerCase().includes(searchLower));
	}

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Gestion des matières</h1>
				<CreateMatiereButton />
			</div>

			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
					<h2 className="text-xl font-bold text-gray-900">Liste des matières ({matieres.length})</h2>
					<SearchFilter placeholder="Rechercher une matière..." />
				</div>
				<div className="p-6">
					{matieres.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">{search ? 'Aucune matière trouvée pour cette recherche' : 'Aucune matière disponible'}</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom de la matière</th>
										<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
									</tr>
								</thead>
								<tbody>
									{matieres.map((matiere) => (
										<tr key={matiere.idMatiere} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-4 px-4 text-sm text-gray-600">#{matiere.idMatiere}</td>
											<td className="py-4 px-4 text-sm font-medium text-gray-900">{matiere.nom}</td>
											<td className="py-4 px-4 text-right">
												<div className="flex gap-2 items-center justify-end">
													<EditMatiereButton matiere={matiere} />
													<DeleteMatiereButton idMatiere={matiere.idMatiere} matiereName={matiere.nom} />
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Page;
