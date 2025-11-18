'use client';

import { deleteExamFromClass } from '@/backend_requests/classes/deleteExamFromClass';
import { ToastContext } from '@/Context/ToastContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface RemoveClassFromExamButtonProps {
	idClass: number;
	idExam: number;
	className: string;
}

const RemoveClassFromExamButton = ({ idClass, idExam, className }: RemoveClassFromExamButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleRemove = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir désassocier la classe "${className}" de cet examen ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const response = await deleteExamFromClass(idClass, idExam);

			if (!('success' in response)) {
				return customToast.error('Erreur lors de la désassociation de la classe');
			}

			customToast.success('Classe désassociée avec succès');
			router.refresh();
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors de la désassociation de la classe');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button isIconOnly size="sm" variant="light" onPress={handleRemove} isLoading={isLoading} className="text-red-500 hover:bg-red-50" aria-label="Désassocier la classe">
			<TrashIcon className="w-4 h-4" />
		</Button>
	);
};

export default RemoveClassFromExamButton;
