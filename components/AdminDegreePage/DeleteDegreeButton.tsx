'use client';

import { deleteDegree } from '@/backend_requests/degrees/deleteDegree';
import { DeleteConfirmPopover } from '@/components/AdminPage/DeleteConfirmPopover';
import { ToastContext } from '@/Context/ToastContext';
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
		try {
			setIsLoading(true);
			const res = await deleteDegree(idDegree);

			if (!('success' in res)) {
				customToast.error('Erreur lors de la suppression du diplôme');
			} else {
				customToast.success('Diplôme supprimé avec succès');
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error('Erreur lors de la suppression du diplôme');
		} finally {
			setIsLoading(false);
		}
	};

	return <DeleteConfirmPopover entityName={degreeName} entityType="diplôme" onConfirm={handleDelete} isLoading={isLoading} />;
};
