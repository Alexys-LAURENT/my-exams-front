'use client';

import { useModal } from '@/Context/ModalContext';
import { User } from '@/types/entitties';
import { Button } from '@heroui/button';
import AddStudentToClassesModalContent from '../Modals/AddStudentToClassesModalContent';
import CreateStudentModalContent from '../Modals/CreateStudentModalContent';

interface StudentActionsProps {
	student: User;
	existingClassIds: number[];
}

export const StudentActions = ({ student, existingClassIds }: StudentActionsProps) => {
	const { openModal } = useModal();

	const handleEdit = () => {
		openModal({
			modalContent: <CreateStudentModalContent existingStudent={student} />,
			size: 'md',
		});
	};

	const handleAddToClasses = () => {
		openModal({
			modalContent: <AddStudentToClassesModalContent idStudent={student.idUser} existingClassIds={existingClassIds} />,
			size: 'lg',
		});
	};

	return (
		<div className="flex gap-2">
			<Button color="primary" variant="flat" onPress={handleEdit}>
				Modifier
			</Button>
			<Button color="primary" onPress={handleAddToClasses}>
				Ajouter à des classes
			</Button>
		</div>
	);
};
