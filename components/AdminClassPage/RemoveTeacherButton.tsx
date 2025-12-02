'use client';

import { removeTeacherFromClass } from '@/backend_requests/classes/removeTeacherFromClass';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface RemoveTeacherButtonProps {
	idClass: number;
	idTeacher: number;
	teacherName: string;
}

export const RemoveTeacherButton = ({ idClass, idTeacher, teacherName }: RemoveTeacherButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleRemove = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir retirer ${teacherName} de cette classe ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const result = await removeTeacherFromClass(idClass, idTeacher);

			if ('success' in result && result.success) {
				customToast.success('Professeur retiré avec succès');
				router.refresh();
			} else {
				customToast.error('Erreur lors du retrait du professeur');
			}
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors du retrait du professeur');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button color="danger" variant="flat" size="sm" onPress={handleRemove} isLoading={isLoading}>
			Retirer
		</Button>
	);
};
