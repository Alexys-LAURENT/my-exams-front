'use client';

import { deleteStudentFromClass } from '@/backend_requests/classes/deleteStudentFromClass';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface RemoveStudentButtonProps {
	idClass: number;
	idStudent: number;
	studentName: string;
}

export const RemoveStudentButton = ({ idClass, idStudent, studentName }: RemoveStudentButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleRemove = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir retirer ${studentName} de cette classe ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await deleteStudentFromClass(idClass, idStudent);

			if (!('success' in res)) {
				return customToast.error("Erreur lors de la suppression de l'étudiant");
			} else {
				customToast.success('Étudiant retiré avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de la suppression de l'étudiant");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button size="sm" color="danger" variant="flat" onPress={handleRemove} isLoading={isLoading}>
			Retirer
		</Button>
	);
};
