'use client';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { createContext, JSX, ReactNode, useContext, useState } from 'react';

interface openModalProps {
	modalContent: JSX.Element;
	size?: sizeProps;
	isDismissable?: boolean;
	scrollBehavior?: scrollBehaviorType;
	hideCloseButton?: boolean;
}

type sizeProps = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
type scrollBehaviorType = 'normal' | 'inside' | 'outside';
export const ModalContext = createContext({
	openModal: (_: openModalProps) => {},
	closeModal: () => {},
	isOpen: false,
	onOpen: () => {},
	onClose: () => {},
});

const ModalProvider = ({ children }: { children: ReactNode }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [modalContent, setModalContent] = useState<null | JSX.Element>(null);
	const [size, setSize] = useState<sizeProps>('5xl');
	const [isDismisable, setIsDismisable] = useState(true);
	const [scrollBehavior, setScrollBehavior] = useState<scrollBehaviorType>('normal');
	const [hideCloseButton, setHideCloseButton] = useState(false);

	const openModal = (data: openModalProps) => {
		setModalContent(data.modalContent || null);
		setSize(data.size || 'md');
		setIsDismisable(data.isDismissable === false ? false : true);
		setScrollBehavior(data.scrollBehavior || 'normal');
		setHideCloseButton(data.hideCloseButton || false);

		onOpen();
	};

	const closeModal = () => {
		onClose();
		setModalContent(null);
	};

	return (
		<ModalContext.Provider value={{ openModal, closeModal, isOpen, onOpen, onClose }}>
			<>
				<Modal
					hideCloseButton={hideCloseButton}
					scrollBehavior={scrollBehavior}
					isDismissable={isDismisable}
					size={size}
					isOpen={isOpen}
					onOpenChange={closeModal}
					placement="bottom-center"
					className="max-w-2xl"
					classNames={{
						base: '!rounded-b-none sm:!rounded-b-large m-0 bg-white',
						backdrop: 'bg-overlay/50 dark:bg-overlay/80',
					}}
				>
					<ModalContent>{(_) => <>{modalContent}</>}</ModalContent>
				</Modal>
				{children}
			</>
		</ModalContext.Provider>
	);
};

export default ModalProvider;

export const useModal = () => {
	const context = useContext(ModalContext);
	return context;
};
