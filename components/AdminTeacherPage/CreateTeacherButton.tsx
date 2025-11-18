'use client';

import { useModal } from '@/Context/ModalContext';
import { Button } from '@heroui/button';
import CreateTeacherModalContent from '../Modals/CreateTeacherModalContent';

export const CreateTeacherButton = () => {
	const { openModal } = useModal();

	const handleCreate = () => {
		openModal({
			modalContent: <CreateTeacherModalContent />,
			size: 'md',
		});
	};

	return (
		<Button color="primary" onPress={handleCreate}>
			Créer un enseignant
		</Button>
	);
};
