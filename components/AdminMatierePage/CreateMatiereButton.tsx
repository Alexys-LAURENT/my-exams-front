'use client';

import { useModal } from '@/Context/ModalContext';
import { Button } from '@heroui/button';
import CreateMatiereModalContent from '../Modals/CreateMatiereModalContent';

export const CreateMatiereButton = () => {
	const { openModal } = useModal();

	const handleCreate = () => {
		openModal({
			modalContent: <CreateMatiereModalContent />,
			size: 'md',
		});
	};

	return (
		<Button color="primary" onPress={handleCreate}>
			Créer une matière
		</Button>
	);
};
