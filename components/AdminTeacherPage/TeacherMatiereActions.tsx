'use client';

import { useModal } from '@/Context/ModalContext';
import { Button } from '@heroui/button';
import AddTeacherToMatieresModalContent from '../Modals/AddTeacherToMatieresModalContent';

interface TeacherMatiereActionsProps {
	idTeacher: number;
	existingMatiereIds: number[];
}

export const TeacherMatiereActions = ({ idTeacher, existingMatiereIds }: TeacherMatiereActionsProps) => {
	const { openModal } = useModal();

	const handleAddToMatieres = () => {
		openModal({
			modalContent: <AddTeacherToMatieresModalContent idTeacher={idTeacher} existingMatiereIds={existingMatiereIds} />,
			size: 'lg',
		});
	};

	return (
		<Button color="primary" onPress={handleAddToMatieres}>
			Ajouter à des matières
		</Button>
	);
};
