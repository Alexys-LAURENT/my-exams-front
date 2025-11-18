'use client';

import { removeTeacherFromClass } from '@/backend_requests/classes/removeTeacherFromClass';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface RemoveTeacherFromClassButtonProps {
	idClass: number;
	idTeacher: number;
	className: string;
}

export const RemoveTeacherFromClassButton = ({ idClass, idTeacher, className }: RemoveTeacherFromClassButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleRemove = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir retirer cet enseignant de la classe "${className}" ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await removeTeacherFromClass(idClass, idTeacher);

			if (!('success' in res)) {
				return customToast.error('Erreur lors du retrait de la classe');
			} else {
				customToast.success('Enseignant retiré de la classe avec succès');
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
