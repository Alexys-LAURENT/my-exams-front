'use client';

import { deleteStudent } from '@/backend_requests/students/deleteStudent';
import { DeleteConfirmPopover } from '@/components/AdminPage/DeleteConfirmPopover';
import { ToastContext } from '@/Context/ToastContext';
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
		try {
			setIsLoading(true);
			const res = await deleteStudent(idStudent);

			if (!('success' in res)) {
				customToast.error("Erreur lors de la suppression de l'étudiant");
			} else {
				customToast.success('Étudiant supprimé avec succès');
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de la suppression de l'étudiant");
		} finally {
			setIsLoading(false);
		}
	};

	return <DeleteConfirmPopover entityName={studentName} entityType="étudiant" onConfirm={handleDelete} isLoading={isLoading} />;
};
