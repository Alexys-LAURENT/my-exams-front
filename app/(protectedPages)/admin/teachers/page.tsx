import { getAllTeachers } from '@/backend_requests/teachers/getAllTeachers';
import { CreateTeacherButton, DeleteTeacherButton } from '@/components/AdminTeacherPage';
import { Avatar } from '@heroui/avatar';
import Link from 'next/link';

const Page = async () => {
	const teachersResponse = await getAllTeachers();
	if (!('success' in teachersResponse) || !teachersResponse.success) {
		throw new Error('Impossible de récupérer les enseignants');
	}

	const teachers = teachersResponse.data;

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Gestion des enseignants</h1>
				<CreateTeacherButton />
			</div>

			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">Liste des enseignants ({teachers.length})</h2>
				</div>
				<div className="p-6">
					{teachers.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">Aucun enseignant disponible</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Avatar</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prénom</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
										<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
									</tr>
								</thead>
								<tbody>
									{teachers.map((teacher) => (
										<tr key={teacher.idUser} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-4 px-4">
												<Avatar src={teacher.avatarPath || undefined} name={teacher.name} size="sm" className="shrink-0" />
											</td>
											<td className="py-4 px-4 text-sm text-gray-900">{teacher.lastName}</td>
											<td className="py-4 px-4 text-sm text-gray-900">{teacher.name}</td>
											<td className="py-4 px-4 text-sm text-gray-600">{teacher.email}</td>
											<td className="py-4 px-4 text-right">
												<div className="flex gap-2 items-center justify-end">
													<Link href={`/admin/teachers/${teacher.idUser}`} className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
														Voir les détails
													</Link>
													<DeleteTeacherButton idTeacher={teacher.idUser} teacherName={`${teacher.name} ${teacher.lastName}`} />
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
