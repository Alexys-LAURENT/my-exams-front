import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
	const loggedUser = await auth();

	if (!loggedUser) {
		redirect('/login');
	}

	if (loggedUser.user.accountType === 'student') {
		redirect('/student/classes');
	} else if (loggedUser.user.accountType === 'teacher') {
		redirect('/teacher/dashboard');
	} else if (loggedUser.user.accountType === 'admin') {
		redirect('/admin/dashboard');
	}

	return <></>;
}
