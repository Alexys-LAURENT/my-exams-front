import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import { auth } from '@/utils/auth';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import Link from 'next/link';
import ExamCard from '../teacher/ExamCard';

const BlockExam = async () => {
	const loggedUser = await auth();
	const idTeacher = loggedUser!.user.idUser;

	const examsResponse = await getAllExamsForOneTeacher(idTeacher);

	if (!('success' in examsResponse)) {
		return (
			<div className="bg-white rounded-xl shadow-lg p-6">
				<h2 className="text-xl font-bold mb-4">Mes Examens</h2>
				<p className="text-red-500">Erreur lors du chargement des examens</p>
			</div>
		);
	}

	const allExams = examsResponse.data;
	const sortedExams = allExams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	const recentExams = sortedExams.slice(0, 5);

	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-xl font-bold mb-1">Mes Examens</h2>
					<p className="text-gray-600 text-sm">Les 5 derniers examens</p>
				</div>
				<Link href="/teacher/exams" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
					Voir tout
				</Link>
			</div>

			<div className="mb-4">
				<Link href="/teacher/exam/create">
					<Button color="primary" className="w-full font-semibold" startContent={<PlusIcon className="w-5 h-5" />}>
						Créer un nouvel examen
					</Button>
				</Link>
			</div>

			{recentExams.length === 0 ? (
				<div className="text-center py-8">
					<DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">Aucun examen</p>
				</div>
			) : (
				<div className="space-y-3">
					{recentExams.map((exam) => (
						<ExamCard key={exam.idExam} exam={exam} />
					))}
				</div>
			)}
		</div>
	);
};

export default BlockExam;
