'use client';

import { deleteDegree } from '@/backend_requests/degrees/deleteDegree';
import { ToastContext } from '@/Context/ToastContext';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface DeleteDegreeButtonProps {
	idDegree: number;
	degreeName: string;
}

export const DeleteDegreeButton = ({ idDegree, degreeName }: DeleteDegreeButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir supprimer le diplôme "${degreeName}" ?`)) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await deleteDegree(idDegree);

			if (!('success' in res)) {
				return customToast.error('Erreur lors de la suppression du diplôme');
			} else {
				customToast.success('Diplôme supprimé avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors de la suppression du diplôme');
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
