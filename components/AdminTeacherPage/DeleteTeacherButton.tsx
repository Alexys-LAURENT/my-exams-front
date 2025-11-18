'use client';

import { deleteTeacher } from '@/backend_requests/teachers/deleteTeacher';
import { DeleteConfirmPopover } from '@/components/AdminPage/DeleteConfirmPopover';
import { ToastContext } from '@/Context/ToastContext';
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
		try {
			setIsLoading(true);
			const res = await deleteTeacher(idTeacher);

			if (!('success' in res)) {
				customToast.error("Erreur lors de la suppression de l'enseignant");
			} else {
				customToast.success('Enseignant supprimé avec succès');
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de la suppression de l'enseignant");
		} finally {
			setIsLoading(false);
		}
	};

	return <DeleteConfirmPopover entityName={teacherName} entityType="enseignant" onConfirm={handleDelete} isLoading={isLoading} />;
};
