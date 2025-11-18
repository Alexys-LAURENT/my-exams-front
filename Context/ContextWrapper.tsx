'use client';
import { UiProviders } from '@/Providers/UiProvider';
import { SessionProvider } from 'next-auth/react';
import ModalProvider from './ModalContext';
import ToastProvider from './ToastContext';

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<UiProviders>
			<SessionProvider>
				<ToastProvider>
					<ModalProvider>
						{/* <TopLoaderProvider> */}
						{children}
						{/* </TopLoaderProvider> */}
					</ModalProvider>
				</ToastProvider>
			</SessionProvider>
		</UiProviders>
	);
};

export default ContextWrapper;
