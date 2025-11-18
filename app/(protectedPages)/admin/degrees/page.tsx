import { getAllDegrees } from '@/backend_requests/degrees/getAllDegrees';
import { CreateDegreeButton, DeleteDegreeButton, EditDegreeButton } from '@/components/AdminDegreePage';

const Page = async () => {
	const degreesResponse = await getAllDegrees();
	if (!('success' in degreesResponse) || !degreesResponse.success) {
		throw new Error('Impossible de récupérer les diplômes');
	}

	const degrees = degreesResponse.data;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Gestion des diplômes</h1>
				<CreateDegreeButton />
			</div>

			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">Liste des diplômes ({degrees.length})</h2>
				</div>
				<div className="p-6">
					{degrees.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">Aucun diplôme disponible</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom du diplôme</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date de création</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Dernière modification</th>
										<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
									</tr>
								</thead>
								<tbody>
									{degrees.map((degree) => (
										<tr key={degree.idDegree} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-4 px-4 text-sm font-medium text-gray-900">{degree.name}</td>
											<td className="py-4 px-4 text-sm text-gray-600">{formatDate(degree.createdAt)}</td>
											<td className="py-4 px-4 text-sm text-gray-600">{degree.updatedAt ? formatDate(degree.updatedAt) : 'Jamais'}</td>
											<td className="py-4 px-4 text-right">
												<div className="flex gap-2 items-center justify-end">
													<EditDegreeButton degree={degree} />
													<DeleteDegreeButton idDegree={degree.idDegree} degreeName={degree.name} />
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
