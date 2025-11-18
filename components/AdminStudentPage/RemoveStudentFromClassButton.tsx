'use client';

import { deleteStudentFromClass } from '@/backend_requests/classes/deleteStudentFromClass';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface RemoveStudentFromClassButtonProps {
	idClass: number;
	idStudent: number;
	className: string;
}

export const RemoveStudentFromClassButton = ({ idClass, idStudent, className }: RemoveStudentFromClassButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleRemove = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir retirer cet étudiant de la classe "${className}" ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await deleteStudentFromClass(idClass, idStudent);

			if (!('success' in res)) {
				return customToast.error('Erreur lors du retrait de la classe');
			} else {
				customToast.success('Étudiant retiré de la classe avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors du retrait de la classe');
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
