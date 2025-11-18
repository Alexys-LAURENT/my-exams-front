'use client';

import { useModal } from '@/Context/ModalContext';
import { Button } from '@heroui/button';
import CreateDegreeModalContent from '../Modals/CreateDegreeModalContent';

export const CreateDegreeButton = () => {
	const { openModal } = useModal();

	const handleCreate = () => {
		openModal({
			modalContent: <CreateDegreeModalContent />,
			size: 'md',
		});
	};

	return (
		<Button color="primary" onPress={handleCreate}>
			Créer un diplôme
		</Button>
	);
};
