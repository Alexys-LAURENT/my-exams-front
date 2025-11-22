import { getCountExamsByTypeOfStudentInClass } from '@/backend_requests/exams/getCountExamsByTypeOfStudentInClass';
import { getExamsByTypeOfStudentInClass } from '@/backend_requests/exams/getExamsByTypeOfStudentInClass';
import ExamCard from '@/components/StudentDashboard/ExamCard';
import { auth } from '@/utils/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface PageProps {
	params: Promise<{ idClass: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
	const { idClass } = await params;
	const { status } = await searchParams;

	if (!status) {
		redirect(`/student/${idClass}/exams?status=pending`);
	}

	if (!['pending', 'completed', 'comming'].includes(Array.isArray(status) ? status[0] : status || 'pending')) {
		redirect(`/student/${idClass}/exams?status=pending`);
	}
	console.log(status);

	const idClassNumber = parseInt(idClass);

	// Récupérer l'utilisateur connecté (garanti par le middleware)
	const session = await auth();
	const idStudent = session!.user!.idUser;

	const [todoExamsResponse, passedExamsResponse, commingExamsResponse] = await Promise.all([
		getCountExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'pending'),
		getCountExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'completed'),
		getCountExamsByTypeOfStudentInClass(idClassNumber, idStudent, 'comming'),
	]);

	if (!('success' in todoExamsResponse) || !('success' in passedExamsResponse) || !('success' in commingExamsResponse)) {
		throw new Error('Erreur lors de la récupération des données des examens');
	}

	const totalTodoExams = Number.parseInt(todoExamsResponse.data.count as unknown as string);
	const totalPassedExams = Number.parseInt(passedExamsResponse.data.count as unknown as string);
	const totalCommingExams = Number.parseInt(commingExamsResponse.data.count as unknown as string);

	const examsReponse = await getExamsByTypeOfStudentInClass(idClassNumber, idStudent, status as 'pending' | 'completed' | 'comming');

	if (!('success' in examsReponse)) {
		throw new Error('Erreur lors de la récupération des examens');
	}

	return (
		<div className="p-6">
			{/* Header */}
			<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Examens</h1>

			<div className="w-full h-[1px] bg-black/10 my-4"></div>

			<Link
				href={`/student/${idClass}/exams?status=pending`}
				className={`font-semibold inline-flex items-center gap-2 px-4 py-2 border-b-2 ${status === 'pending' ? ' text-blue-700 border-blue-300' : ' hover:text-blue-700 !border-0'} mr-2 mb-2`}
			>
				Examens à faire ({totalTodoExams})
			</Link>

			<Link
				href={`/student/${idClass}/exams?status=completed`}
				className={`font-semibold inline-flex items-center gap-2 px-4 py-2 border-b-2 ${
					status === 'completed' ? ' text-blue-700 border-blue-300' : ' hover:text-blue-700 !border-0'
				} mr-2 mb-2`}
			>
				Examens terminés ({totalPassedExams})
			</Link>

			<Link
				href={`/student/${idClass}/exams?status=comming`}
				className={`font-semibold inline-flex items-center gap-2 px-4 py-2 border-b-2 ${status === 'comming' ? ' text-blue-700 border-blue-300' : ' hover:text-blue-700 !border-0'} mr-2 mb-2`}
			>
				Examens à venir ({totalCommingExams})
			</Link>

			<div className="flex w-full items-center gap-4 mt-6 flex-wrap">
				{examsReponse.data.length === 0 ? (
					<div className="text-center text-gray-500">
						{status === 'pending'
							? "Vous n'avez aucun examen à faire pour le moment."
							: status === 'completed'
							? "Vous n'avez aucun examen terminé pour le moment."
							: "Vous n'avez aucun examen à venir pour le moment."}
					</div>
				) : (
					examsReponse.data.toReversed().map((exam) => <ExamCard exam={exam} idClass={idClassNumber} idStudent={idStudent} key={exam.idExam} />)
				)}
			</div>
		</div>
	);
};

export default Page;
