'use client';

import { deleteTeacher } from '@/backend_requests/teachers/deleteTeacher';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface DeleteTeacherButtonProps {
	idTeacher: number;
	teacherName: string;
}

export const DeleteTeacherButton = ({ idTeacher, teacherName }: DeleteTeacherButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir supprimer l'enseignant "${teacherName}" ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await deleteTeacher(idTeacher);

			if (!('success' in res)) {
				return customToast.error("Erreur lors de la suppression de l'enseignant");
			} else {
				customToast.success('Enseignant supprimé avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de la suppression de l'enseignant");
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
