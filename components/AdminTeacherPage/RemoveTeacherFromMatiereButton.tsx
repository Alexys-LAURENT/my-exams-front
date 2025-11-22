'use client';

import { removeTeacherFromMatiere } from '@/backend_requests/matieres/removeTeacherFromMatiere';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface RemoveTeacherFromMatiereButtonProps {
	idMatiere: number;
	idTeacher: number;
	matiereName: string;
	isLastMatiere: boolean;
}

export const RemoveTeacherFromMatiereButton = ({ idMatiere, idTeacher, matiereName, isLastMatiere }: RemoveTeacherFromMatiereButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleRemove = async () => {
		if (isLastMatiere) {
			customToast.error('Un enseignant doit avoir au moins une matière');
			return;
		}

		if (!confirm(`Êtes-vous sûr de vouloir retirer cet enseignant de la matière "${matiereName}" ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await removeTeacherFromMatiere(idMatiere, idTeacher);

			if (!('success' in res)) {
				return customToast.error('Erreur lors du retrait de la matière');
			} else {
				customToast.success('Enseignant retiré de la matière avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors du retrait de la matière');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button size="sm" color="danger" variant="flat" onPress={handleRemove} isLoading={isLoading} isDisabled={isLastMatiere}>
			Retirer
		</Button>
	);
};
