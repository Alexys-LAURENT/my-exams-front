'use client';

import { useModal } from '@/Context/ModalContext';
import { User } from '@/types/entitties';
import { Button } from '@heroui/button';
import AddTeacherToClassesModalContent from '../Modals/AddTeacherToClassesModalContent';
import CreateTeacherModalContent from '../Modals/CreateTeacherModalContent';

interface TeacherActionsProps {
	teacher: User;
	existingClassIds: number[];
}

export const TeacherActions = ({ teacher, existingClassIds }: TeacherActionsProps) => {
	const { openModal } = useModal();

	const handleEdit = () => {
		openModal({
			modalContent: <CreateTeacherModalContent existingTeacher={teacher} />,
			size: 'md',
		});
	};

	const handleAddToClasses = () => {
		openModal({
			modalContent: <AddTeacherToClassesModalContent idTeacher={teacher.idUser} existingClassIds={existingClassIds} />,
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
