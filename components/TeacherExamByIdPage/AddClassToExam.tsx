'use client';

import { useModal } from '@/Context/ModalContext';
import AddClassToExamModalContent from '@/components/Modals/AddClassToExamModalContent';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';

interface AddClassToExamProps {
	idExam: number;
	existingClassIds: number[];
	idTeacher: number;
}

const AddClassToExam = ({ idExam, existingClassIds, idTeacher }: AddClassToExamProps) => {
	const { openModal } = useModal();

	const handleOpenModal = () => {
		openModal({
			modalContent: <AddClassToExamModalContent idExam={idExam} existingClassIds={existingClassIds} idTeacher={idTeacher} />,
			size: 'md',
			scrollBehavior: 'inside',
		});
	};

	return (
		<Button size="sm" onPress={handleOpenModal} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold" startContent={<PlusIcon className="w-5 h-5" />}>
			Ajouter une classe
		</Button>
	);
};

export default AddClassToExam;
