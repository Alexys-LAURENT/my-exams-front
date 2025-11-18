'use client';

import { useModal } from '@/Context/ModalContext';
import { Class } from '@/types/entitties';
import { Button } from '@heroui/button';
import AddStudentToClassModalContent from '../Modals/AddStudentToClassModalContent';
import CreateClassModalContent from '../Modals/CreateClassModalContent';

interface ClassActionsProps {
	classe: Class;
	existingStudentIds: number[];
}

export const ClassActions = ({ classe, existingStudentIds }: ClassActionsProps) => {
	const { openModal } = useModal();

	const handleAddStudent = () => {
		openModal({
			modalContent: <AddStudentToClassModalContent idClass={classe.idClass} existingStudentIds={existingStudentIds} />,
			size: 'md',
		});
	};

	const handleEditClass = () => {
		openModal({
			modalContent: <CreateClassModalContent start_date={classe.startDate} end_date={classe.endDate} existingClass={classe} />,
			size: 'md',
		});
	};

	return (
		<div className="flex gap-3">
			<Button color="primary" variant="flat" onPress={handleAddStudent}>
				Ajouter un étudiant
			</Button>
			<Button color="primary" variant="bordered" onPress={handleEditClass}>
				Modifier la classe
			</Button>
		</div>
	);
};
