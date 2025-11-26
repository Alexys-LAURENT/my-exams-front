import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { auth } from '@/utils/auth';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ClassCard from '../teacher/ClassCard';

const BlockClass = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;

	const classesResponse = await getAllClassesForOneTeacher(idTeacher, 5);

	if (!('success' in classesResponse)) {
		return (
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h2 className="text-xl font-bold mb-4">Mes Classes</h2>
				<p className="text-red-500">Erreur lors du chargement des classes</p>
			</div>
		);
	}

	const classes = classesResponse.data;

	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-xl font-bold mb-1">Mes Classes</h2>
					<p className="text-gray-600 text-sm">Les 5 dernières classes</p>
				</div>
				<Link href="/teacher/classes" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
					Voir tout
				</Link>
			</div>
			{classes.length === 0 ? (
				<div className="text-center py-8">
					<AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">Aucune classe</p>
				</div>
			) : (
				<div className="space-y-3">
					{classes.map((classe) => (
						<ClassCard key={classe.idClass} classe={classe} />
					))}
				</div>
			)}
		</div>
	);
};

export default BlockClass;
