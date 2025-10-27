import ExamRecapPage from '@/components/ExamPage/ExamRecapPage';
import StudentViewExamPage from '@/components/ExamPage/StudentViewExamPage';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

interface PageProps {
	params: Promise<{
		idExam: string;
		idStudent: string;
		idClass: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const idExam = parseInt((await params).idExam, 10);
	const idStudent = parseInt((await params).idStudent, 10);
	const idClass = parseInt((await params).idClass, 10);
	const session = await auth();

	// If no session, redirect to login (should not happen due to protected pages setup)
	if (!session) {
		redirect('/login');
	}

	// If student tries to access another student's exam page, redirect to home
	if (session.user.accountType === 'student' && session.user.idUser !== idStudent) {
		redirect('/');
	}

	// Render view based on account type
	if (session.user.accountType === 'student') {
		return <StudentViewExamPage idStudent={idStudent} idExam={idExam} idClass={idClass} />;
	}

	if (session.user.accountType === 'teacher') {
		return <ExamRecapPage idClass={idClass} idStudent={idStudent} idExam={idExam} />;
	}
};

export default Page;
