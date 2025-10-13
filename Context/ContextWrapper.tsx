'use client';
import { UiProviders } from '@/Providers/UiProvider';
import { SessionProvider } from "next-auth/react";

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<UiProviders>
			<SessionProvider>
			{/* <TopLoaderProvider> */}
			{children}
			{/* </TopLoaderProvider> */}
			</SessionProvider>
		</UiProviders>
	);
};

export default ContextWrapper;
