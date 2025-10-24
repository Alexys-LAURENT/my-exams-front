import StudentViewExamPage from '@/components/ExamPage/StudentViewExamPage';
import TeacherViewExamPage from '@/components/ExamPage/TeacherViewExamPage';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

interface PageProps {
	params: Promise<{
		idExam: string;
		idStudent: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const idExam = parseInt((await params).idExam, 10);
	const idStudent = parseInt((await params).idStudent, 10);
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
		return <StudentViewExamPage idStudent={idStudent} idExam={idExam} />;
	}

	if (session.user.accountType === 'teacher') {
		return <TeacherViewExamPage />;
	}

	return (
		<div>
			<p>Est ce que l’user qui accède à cette page est prof ou eleve ?</p>
			<p>Si prof :</p>
			<ul>
				<li>Récupère les infos de l’examen</li>
				<li>Récupère les questions de l’examen (avec les réponses si qcm)</li>
				<li>Récupère les réponses des élèves</li>
				<li>Récupère les évaluations des réponses des élèves</li>
			</ul>
			<p>Page récapitulatif de l’examen pour l’user (avec possibilité de corriger si c’est un prof)</p>
			<br />
			<p>Si eleve :</p>
			<p>Est ce que l’eleve à déjà fait cet examen ?</p>
			<p>si oui : </p>
			<ul>
				<li>Récupère les infos de l&apos;examen</li>
				<li>Récupère les questions de l&apos;examen (avec les réponses si qcm)</li>
				<li>Récupère les réponses de l&apos;user</li>
				<li>Récupère les évaluations des réponses de l&apos;user</li>
			</ul>
			<p>Page récapitulatif de l’examen pour l’user (avec possibilité de corriger si c’est un prof)</p>
			<br />
			<p>si non :</p>
			<p>Récupère les infos de l’examen</p>
			<p>Page Start commencer l’examen</p>
		</div>
	);
};

export default Page;
