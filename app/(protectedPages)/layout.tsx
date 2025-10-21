import TopBar from '@/components/TopBar';
import { auth } from '@/utils/auth';

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const loggedUser = await auth();
	return (
		<div className="flex flex-col items-center w-full min-h-screen bg-[#F0F4FF]">
			<TopBar loggedUser={loggedUser!} />
			<div className="flex flex-col  max-w-[1900px] w-full flex-1">{children}</div>
		</div>
	);
};

export default Layout;
