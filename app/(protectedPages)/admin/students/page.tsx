import { getAllStudents } from '@/backend_requests/students/getAllStudents';
import { getAllStudentsCount } from '@/backend_requests/students/getAllStudentsCount';
import { Pagination } from '@/components/AdminPage/Pagination';
import { SearchFilter } from '@/components/AdminPage/SearchFilter';
import { CreateStudentButton, DeleteStudentButton } from '@/components/AdminStudentPage';
import { Avatar } from '@heroui/avatar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface PageProps {
	searchParams: Promise<{ search?: string; page?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
	const { search, page } = await searchParams;
	if (!page) {
		redirect('/admin/students?page=1');
	}

	const [studentsResponse, studentsCountResponse] = await Promise.all([getAllStudents(Number.parseInt(page), search), getAllStudentsCount()]);
	if (!('success' in studentsResponse) || !('success' in studentsCountResponse)) {
		throw new Error('Impossible de récupérer les étudiants');
	}

	const allStudentsCount = studentsCountResponse.data;
	const students = studentsResponse.data.data;
	const meta = studentsResponse.data.meta;

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Gestion des étudiants</h1>
				<CreateStudentButton />
			</div>

			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
					<div className="flex items-center gap-4">
						<h2 className="text-xl font-bold text-gray-900">Liste des étudiants (total {allStudentsCount})</h2>
						<Pagination meta={meta} />
					</div>
					<SearchFilter placeholder="Rechercher un étudiant..." />
				</div>
				<div className="p-6">
					{students.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">{search ? 'Aucun étudiant trouvé pour cette recherche' : 'Aucun étudiant disponible'}</p>
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
									{students.map((student) => (
										<tr key={student.idUser} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-4 px-4">
												<Avatar src={student.avatarPath || undefined} name={student.name} size="sm" className="shrink-0" />
											</td>
											<td className="py-4 px-4 text-sm text-gray-900">{student.lastName}</td>
											<td className="py-4 px-4 text-sm text-gray-900">{student.name}</td>
											<td className="py-4 px-4 text-sm text-gray-600">{student.email}</td>
											<td className="py-4 px-4 text-right">
												<div className="flex gap-2 items-center justify-end">
													<Link href={`/admin/students/${student.idUser}`} className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
														Voir les détails
													</Link>
													<DeleteStudentButton idStudent={student.idUser} studentName={`${student.name} ${student.lastName}`} />
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
				<div className="flex mb-6 w-full items-center justify-center">
					<Pagination meta={meta} />
				</div>
			</div>
		</div>
	);
};

export default Page;
