'use client';

import { useModal } from '@/Context/ModalContext';
import { Matiere } from '@/types/entitties';
import { Button } from '@heroui/button';
import CreateMatiereModalContent from '../Modals/CreateMatiereModalContent';

interface EditMatiereButtonProps {
	matiere: Matiere;
}

export const EditMatiereButton = ({ matiere }: EditMatiereButtonProps) => {
	const { openModal } = useModal();

	const handleEdit = () => {
		openModal({
			modalContent: <CreateMatiereModalContent existingMatiere={matiere} />,
			size: 'md',
		});
	};

	return (
		<Button size="sm" color="primary" variant="flat" onPress={handleEdit}>
			Modifier
		</Button>
	);
};
