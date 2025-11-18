import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getClassGeneralAverage } from '@/backend_requests/stats/getClassGeneralAverage';
import { getUserGeneralAverageInClass } from '@/backend_requests/stats/getUserGeneralAverageInClass';
import { getStudentsOfClass } from '@/backend_requests/students/getStudentsOfClass';
import { ClassActions } from '@/components/AdminClassPage/ClassActions';
import { RemoveStudentButton } from '@/components/AdminClassPage/RemoveStudentButton';
import { Avatar } from '@heroui/avatar';
import Link from 'next/link';

interface PageProps {
	params: Promise<{
		idClass: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const { idClass } = await params;
	const idClassNumber = parseInt(idClass);

	// Récupérer toutes les données côté serveur
	const classResponse = await getOneClass(idClassNumber);
	if (!('success' in classResponse) || !classResponse.success) {
		throw new Error('Impossible de récupérer les informations de la classe');
	}

	const studentsResponse = await getStudentsOfClass(idClassNumber);
	if (!('success' in studentsResponse) || !studentsResponse.success) {
		throw new Error('Impossible de récupérer les étudiants de la classe');
	}

	const averageResponse = await getClassGeneralAverage(idClassNumber);
	if (!('success' in averageResponse) || !averageResponse.success) {
		throw new Error('Impossible de récupérer la moyenne générale de la classe');
	}

	const degreeResponse = await getClassDegree(idClassNumber);
	if (!('success' in degreeResponse) || !degreeResponse.success) {
		throw new Error('Impossible de récupérer le diplôme de la classe');
	}

	const classe = classResponse.data;
	const students = studentsResponse.data;
	const average = averageResponse.data.average;
	const degree = degreeResponse.data;

	// Récupérer les moyennes pour chaque étudiant
	const studentsWithAverages = await Promise.all(
		students.map(async (student) => {
			const averageResponse = await getUserGeneralAverageInClass(idClassNumber, student.idUser);
			const studentAverage = 'success' in averageResponse && averageResponse.success ? averageResponse.data.average : null;

			return {
				...student,
				average: studentAverage,
			};
		})
	);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});
	};

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			{/* En-tête avec fil d'Ariane */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<Link href="/admin/classes" className="hover:text-blue-600 transition-colors">
						Classes
					</Link>
					<span>/</span>
					<span className="text-gray-900 font-medium">{classe.name}</span>
				</div>
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">{classe.name}</h1>
						<p className="text-gray-600 mt-1">{degree.name}</p>
					</div>
					<ClassActions classe={classe} existingStudentIds={students.map((s) => s.idUser)} />
				</div>
			</div>

			{/* Cartes d'informations */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Carte dates */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Dates de validité</h3>
					<div className="flex flex-col gap-2">
						<div>
							<span className="text-xs text-gray-500">Début:</span>
							<p className="text-base font-medium text-gray-900">{formatDate(classe.startDate)}</p>
						</div>
						<div>
							<span className="text-xs text-gray-500">Fin:</span>
							<p className="text-base font-medium text-gray-900">{formatDate(classe.endDate)}</p>
						</div>
					</div>
				</div>

				{/* Carte nombre d'étudiants */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Effectif</h3>
					<p className="text-4xl font-bold text-blue-600">{students.length}</p>
					<p className="text-sm text-gray-500 mt-1">étudiant{students.length > 1 ? 's' : ''}</p>
				</div>

				{/* Carte moyenne générale */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Moyenne générale</h3>
					<p className="text-4xl font-bold text-green-600">{average ? average.toFixed(2) : 'N/A'}</p>
					<p className="text-sm text-gray-500 mt-1">sur 20</p>
				</div>
			</div>

			{/* Liste des étudiants */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">Liste des étudiants ({students.length})</h2>
				</div>
				<div className="p-6">
					{students.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">Aucun étudiant dans cette classe</p>
							<p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Ajouter un étudiant&quot; pour commencer</p>
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
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Moyenne</th>
										<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
									</tr>
								</thead>
								<tbody>
									{studentsWithAverages.map((student) => (
										<tr key={student.idUser} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-4 px-4">
												<Avatar src={student.avatarPath || undefined} name={student.name} size="sm" className="shrink-0" />
											</td>
											<td className="py-4 px-4 text-sm text-gray-900">
												<Link href={`/admin/students/${student.idUser}`} className="hover:text-blue-600 transition-colors">
													{student.lastName}
												</Link>
											</td>
											<td className="py-4 px-4 text-sm text-gray-900">
												<Link href={`/admin/students/${student.idUser}`} className="hover:text-blue-600 transition-colors">
													{student.name}
												</Link>
											</td>
											<td className="py-4 px-4 text-sm text-gray-600">{student.email}</td>
											<td className="py-4 px-4 text-sm font-semibold text-gray-900">
												{student.average !== null ? (
													<span className={student.average >= 10 ? 'text-green-600' : 'text-red-600'}>{student.average.toFixed(2)}/20</span>
												) : (
													<span className="text-gray-400">N/A</span>
												)}
											</td>
											<td className="py-4 px-4 text-right">
												<RemoveStudentButton idClass={idClassNumber} idStudent={student.idUser} studentName={`${student.name} ${student.lastName}`} />
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
