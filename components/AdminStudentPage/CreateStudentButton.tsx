'use client';

import { useModal } from '@/Context/ModalContext';
import { Button } from '@heroui/button';
import CreateStudentModalContent from '../Modals/CreateStudentModalContent';

export const CreateStudentButton = () => {
	const { openModal } = useModal();

	const handleCreate = () => {
		openModal({
			modalContent: <CreateStudentModalContent />,
			size: 'md',
		});
	};

	return (
		<Button color="primary" onPress={handleCreate}>
			Créer un étudiant
		</Button>
	);
};
