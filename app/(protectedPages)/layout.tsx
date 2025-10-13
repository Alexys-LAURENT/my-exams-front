import TopBar from '@/components/TopBar';
import { auth } from '@/utils/auth';

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const loggedUser = await auth();
	return (
		<div className="flex w-full flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<TopBar loggedUser={loggedUser!} />
			{children}
		</div>
	);
};

export default Layout;
