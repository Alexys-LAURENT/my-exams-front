import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getAllTeachers } from '@/backend_requests/teachers/getAllTeachers';
import { RemoveTeacherFromClassButton, TeacherActions } from '@/components/AdminTeacherPage';
import { Avatar } from '@heroui/avatar';
import Link from 'next/link';

interface PageProps {
	params: Promise<{
		idTeacher: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const { idTeacher } = await params;
	const idTeacherNumber = parseInt(idTeacher);

	// Récupérer les informations de l'enseignant
	const teachersResponse = await getAllTeachers();
	if (!('success' in teachersResponse) || !teachersResponse.success) {
		throw new Error("Impossible de récupérer les informations de l'enseignant");
	}

	const teacher = teachersResponse.data.find((t) => t.idUser === idTeacherNumber);
	if (!teacher) {
		throw new Error('Enseignant introuvable');
	}

	// Récupérer les classes de l'enseignant
	const classesResponse = await getAllClassesForOneTeacher(idTeacherNumber);
	if (!('success' in classesResponse) || !classesResponse.success) {
		throw new Error("Impossible de récupérer les classes de l'enseignant");
	}

	const classes = classesResponse.data;

	// Récupérer les diplômes pour chaque classe
	const classesWithDetails = await Promise.all(
		classes.map(async (classe) => {
			const degreeResponse = await getClassDegree(classe.idClass);

			if (!('success' in degreeResponse) || !degreeResponse.success) {
				throw new Error(`Impossible de récupérer le diplôme pour la classe ${classe.name}`);
			}

			return {
				...classe,
				degreeName: degreeResponse.data.name,
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
					<Link href="/admin/teachers" className="hover:text-blue-600 transition-colors">
						Enseignants
					</Link>
					<span>/</span>
					<span className="text-gray-900 font-medium">
						{teacher.name} {teacher.lastName}
					</span>
				</div>
				<div className="flex justify-between items-start">
					<div className="flex gap-4 items-center">
						<Avatar src={teacher.avatarPath || undefined} name={teacher.name} size="lg" className="shrink-0 w-20 h-20" />
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								{teacher.name} {teacher.lastName}
							</h1>
							<p className="text-gray-600 mt-1">{teacher.email}</p>
						</div>
					</div>
					<TeacherActions teacher={teacher} existingClassIds={classes.map((c) => c.idClass)} />
				</div>
			</div>

			{/* Carte d'informations */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Carte nombre de classes */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Classes enseignées</h3>
					<p className="text-4xl font-bold text-blue-600">{classes.length}</p>
					<p className="text-sm text-gray-500 mt-1">classe{classes.length > 1 ? 's' : ''}</p>
				</div>

				{/* Carte type de compte */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-sm font-semibold text-gray-600 mb-3">Type de compte</h3>
					<p className="text-2xl font-bold text-green-600 capitalize">{teacher.accountType}</p>
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
							<p className="text-gray-500">Cet enseignant n&apos;est assigné à aucune classe</p>
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
											<td className="py-4 px-4 text-right">
												<RemoveTeacherFromClassButton idClass={classe.idClass} idTeacher={idTeacherNumber} className={classe.name} />
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
