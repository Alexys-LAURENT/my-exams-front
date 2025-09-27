'use client';
import { UiProviders } from '@/Providers/UiProvider';

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<UiProviders>
			{/* <TopLoaderProvider> */}
			{children}
			{/* </TopLoaderProvider> */}
		</UiProviders>
	);
};

export default ContextWrapper;
