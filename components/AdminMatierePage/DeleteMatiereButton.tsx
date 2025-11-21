'use client';

import { deleteMatiere } from '@/backend_requests/matieres/deleteMatiere';
import { DeleteConfirmPopover } from '@/components/AdminPage/DeleteConfirmPopover';
import { ToastContext } from '@/Context/ToastContext';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface DeleteMatiereButtonProps {
	idMatiere: number;
	matiereName: string;
}

export const DeleteMatiereButton = ({ idMatiere, matiereName }: DeleteMatiereButtonProps) => {
	const { customToast } = useContext(ToastContext);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			const res = await deleteMatiere(idMatiere);

			if (!('success' in res)) {
				customToast.error('Erreur lors de la suppression de la matière');
			} else {
				customToast.success('Matière supprimée avec succès');
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors de la suppression de la matière');
		} finally {
			setIsLoading(false);
		}
	};

	return <DeleteConfirmPopover entityName={matiereName} entityType="matière" onConfirm={handleDelete} isLoading={isLoading} />;
};
