'use client';

import { useModal } from '@/Context/ModalContext';
import { Class } from '@/types/entitties';
import { Button } from '@heroui/button';
import AddStudentToClassModalContent from '../Modals/AddStudentToClassModalContent';
import AddTeacherToClassModalContent from '../Modals/AddTeacherToClassModalContent';
import CreateClassModalContent from '../Modals/CreateClassModalContent';

interface ClassActionsProps {
	classe: Class;
	existingStudentIds: number[];
	existingTeacherIds: number[];
}

export const ClassActions = ({ classe, existingStudentIds, existingTeacherIds }: ClassActionsProps) => {
	const { openModal } = useModal();

	const handleAddStudent = () => {
		openModal({
			modalContent: <AddStudentToClassModalContent idClass={classe.idClass} existingStudentIds={existingStudentIds} />,
			size: 'md',
		});
	};

	const handleAddTeacher = () => {
		openModal({
			modalContent: <AddTeacherToClassModalContent idClass={classe.idClass} existingTeacherIds={existingTeacherIds} />,
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
			<Button color="secondary" variant="flat" onPress={handleAddTeacher}>
				Ajouter un professeur
			</Button>
			<Button color="primary" variant="bordered" onPress={handleEditClass}>
				Modifier la classe
			</Button>
		</div>
	);
};
