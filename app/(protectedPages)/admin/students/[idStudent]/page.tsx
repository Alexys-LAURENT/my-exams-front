import { getStudentClasses } from '@/backend_requests/classes/getStudentClasses';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getUserGeneralAverageInClass } from '@/backend_requests/stats/getUserGeneralAverageInClass';
import { getOneStudent } from '@/backend_requests/students/getOneStudent';
import { RemoveStudentFromClassButton, StudentActions } from '@/components/AdminStudentPage';
import { Avatar } from '@heroui/avatar';
import Link from 'next/link';

interface PageProps {
	params: Promise<{
		idStudent: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const { idStudent } = await params;
	const idStudentNumber = parseInt(idStudent);

	// Récupérer les informations de l'étudiant
	const [studentResponse, classesResponse] = await Promise.all([getOneStudent(idStudentNumber), getStudentClasses(idStudentNumber)]);

	if (!('success' in studentResponse) || !('success' in classesResponse)) {
		throw new Error("Impossible de récupérer les informations de l'étudiant");
	}

	const student = studentResponse.data;
	const classes = classesResponse.data;

	// Récupérer les diplômes et moyennes pour chaque classe
	const classesWithDetails = await Promise.all(
		classes.map(async (classe) => {
			const [degreeResponse, averageResponse] = await Promise.all([getClassDegree(classe.idClass), getUserGeneralAverageInClass(classe.idClass, idStudentNumber)]);

			if (!('success' in degreeResponse)) {
				throw new Error(`Impossible de récupérer le diplôme pour la classe ${classe.name}`);
			}

			const average = 'success' in averageResponse && averageResponse.success ? averageResponse.data.average : null;

			return {
				...classe,
				degreeName: degreeResponse.data.name,
				average,
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
					<Link href="/admin/students" className="hover:text-blue-600 transition-colors">
						Étudiants
					</Link>
					<span>/</span>
					<span className="text-gray-900 font-medium">
						{student.name} {student.lastName}
					</span>
				</div>
				<div className="flex justify-between items-start">
					<div className="flex gap-4 items-center">
						<Avatar src={student.avatarPath || undefined} name={student.name} size="lg" className="shrink-0 w-20 h-20" />
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								{student.name} {student.lastName}
							</h1>
							<p className="text-gray-600 mt-1">{student.email}</p>
						</div>
					</div>
					<StudentActions student={student} existingClassIds={classes.map((c) => c.idClass)} />
				</div>
			</div>

			{/* Carte d'informations */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Carte nombre de classes */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Classes inscrites</h3>
					<p className="text-4xl font-bold text-blue-600">{classes.length}</p>
					<p className="text-sm text-gray-500 mt-1">classe{classes.length > 1 ? 's' : ''}</p>
				</div>

				{/* Carte type de compte */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Type de compte</h3>
					<p className="text-2xl font-bold text-green-600 capitalize">{student.accountType}</p>
				</div>
			</div>

			{/* Liste des classes */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">Liste des classes ({classes.length})</h2>
				</div>
				<div className="p-6">
					{classes.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500">Cet étudiant n&apos;est inscrit à aucune classe</p>
							<p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Ajouter à des classes&quot; pour commencer</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom de la classe</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Diplôme</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date de début</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date de fin</th>
										<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Moyenne</th>
										<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
									</tr>
								</thead>
								<tbody>
									{classesWithDetails.map((classe) => (
										<tr key={classe.idClass} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-4 px-4 text-sm font-medium text-gray-900">
												<Link href={`/admin/classes/${classe.idClass}`} className="hover:text-blue-600 transition-colors">
													{classe.name}
												</Link>
											</td>
											<td className="py-4 px-4 text-sm text-gray-600">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{classe.degreeName}</span>
											</td>
											<td className="py-4 px-4 text-sm text-gray-600">{formatDate(classe.startDate)}</td>
											<td className="py-4 px-4 text-sm text-gray-600">{formatDate(classe.endDate)}</td>
											<td className="py-4 px-4 text-sm font-semibold text-gray-900">
												<Link href={`/student/${classe.idClass}/${student.idUser}/grades-summary`}>
													{classe.average !== null ? (
														<span className={classe.average >= 10 ? 'text-green-600' : 'text-red-600'}>{classe.average.toFixed(2)}/20</span>
													) : (
														<span className="text-gray-400">N/A</span>
													)}
												</Link>
											</td>
											<td className="py-4 px-4 text-right">
												<RemoveStudentFromClassButton idClass={classe.idClass} idStudent={idStudentNumber} className={classe.name} />
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
