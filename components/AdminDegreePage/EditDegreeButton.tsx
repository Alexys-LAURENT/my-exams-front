'use client';

import { useModal } from '@/Context/ModalContext';
import { Degree } from '@/types/entitties';
import { Button } from '@heroui/button';
import CreateDegreeModalContent from '../Modals/CreateDegreeModalContent';

interface EditDegreeButtonProps {
	degree: Degree;
}

export const EditDegreeButton = ({ degree }: EditDegreeButtonProps) => {
	const { openModal } = useModal();

	const handleEdit = () => {
		openModal({
			modalContent: <CreateDegreeModalContent existingDegree={degree} />,
			size: 'md',
		});
	};

	return (
		<Button size="sm" color="primary" variant="flat" onPress={handleEdit}>
			Modifier
		</Button>
	);
};
