'use client';

import { deleteStudent } from '@/backend_requests/students/deleteStudent';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface DeleteStudentButtonProps {
	idStudent: number;
	studentName: string;
}

export const DeleteStudentButton = ({ idStudent, studentName }: DeleteStudentButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant "${studentName}" ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await deleteStudent(idStudent);

			if (!('success' in res)) {
				return customToast.error("Erreur lors de la suppression de l'étudiant");
			} else {
				customToast.success('Étudiant supprimé avec succès');
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
		<Button size="sm" color="danger" variant="flat" onPress={handleDelete} isLoading={isLoading}>
			Supprimer
		</Button>
	);
};
