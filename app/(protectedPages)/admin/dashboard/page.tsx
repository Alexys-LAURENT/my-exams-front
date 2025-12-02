import { getAllClasses } from '@/backend_requests/classes/getAllClasses';
import { getAllDegrees } from '@/backend_requests/degrees/getAllDegrees';
import { getAllMatieres } from '@/backend_requests/matieres/getAllMatieres';
import { getAllStudentsCount } from '@/backend_requests/students/getAllStudentsCount';
import { getAllTeachersCount } from '@/backend_requests/teachers/getAllTeachersCount';
import Link from 'next/link';

const AdminDashboard = async () => {
	// Récupérer les données pour les counts
	const [studentsCountData, teachersCountData, classesData, degreesData, matieresData] = await Promise.all([
		getAllStudentsCount(),
		getAllTeachersCount(),
		getAllClasses(),
		getAllDegrees(),
		getAllMatieres(),
	]);

	if (!('success' in studentsCountData) || !('success' in teachersCountData) || !('success' in classesData) || !('success' in degreesData) || !('success' in matieresData)) {
		throw new Error('Error fetching data');
	}

	// Extraire les counts
	const studentsCount = studentsCountData.data;
	const teachersCount = teachersCountData.data;
	const classesCount = classesData.data.length;
	const degreesCount = degreesData.data.length;
	const matieresCount = matieresData.data.length;

	const dashboardCards = [
		{
			title: 'Élèves',
			description: 'Gérer les élèves : consulter, créer et supprimer',
			icon: '👨‍🎓',
			href: '/admin/students',
			color: 'from-blue-500 to-blue-600',
			count: studentsCount,
		},
		{
			title: 'Professeurs',
			description: 'Gérer les professeurs : consulter, créer et supprimer',
			icon: '👨‍🏫',
			href: '/admin/teachers',
			color: 'from-green-500 to-green-600',
			count: teachersCount,
		},
		{
			title: 'Classes',
			description: 'Gérer les classes et leurs compositions',
			icon: '🏫',
			href: '/admin/classes',
			color: 'from-purple-500 to-purple-600',
			count: classesCount,
		},
		{
			title: 'Diplômes',
			description: 'Gérer les diplômes et formations',
			icon: '🎓',
			href: '/admin/degrees',
			color: 'from-orange-500 to-orange-600',
			count: degreesCount,
		},
		{
			title: 'Matières',
			description: 'Gérer les matières enseignées',
			icon: '📚',
			href: '/admin/matieres',
			color: 'from-red-500 to-red-600',
			count: matieresCount,
		},
	];

	return (
		<div className="flex flex-col gap-8 p-8 w-full">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-gray-800">Tableau de bord administrateur</h1>
				<p className="text-gray-600 text-lg">Gérez votre établissement depuis cette interface.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{dashboardCards.map((card, index) => (
					<Link
						key={index}
						href={card.href}
						className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
					>
						<div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
						<div className="relative p-6 flex flex-col gap-4 h-full">
							<div className="flex items-center justify-between">
								<div className="text-5xl">{card.icon}</div>
								<div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
							</div>
							<div className="flex flex-col gap-2 h-full">
								<h2 className="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
									{card.title}
								</h2>
								<p className="text-gray-600 text-sm">{card.description}</p>
							</div>
							<div className="pt-4 border-t border-gray-200 flex items-center justify-between">
								<p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
								<p className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>{card.count}</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default AdminDashboard;
