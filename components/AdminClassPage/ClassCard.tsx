'use client';
import { deleteClass } from '@/backend_requests/classes/deleteClass';
import { ToastContext } from '@/Context/ToastContext';
import { Class } from '@/types/entitties';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

interface ClassCardProps {
	classe: Class;
	degreeName: string;
}

export const ClassCard = ({ classe, degreeName }: ClassCardProps) => {
	const router = useRouter();
	const { customToast } = useContext(ToastContext);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});
	};

	const handleDelete = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classe.name}" ?`)) {
			return;
		}

		try {
			const resDelete = await deleteClass(classe.idClass);
			if (!('success' in resDelete)) {
				throw new Error('Erreur lors de la suppression de la classe');
			}
			customToast.success('Classe supprimée avec succès');
			router.refresh();
		} catch (error) {
			console.error('ClassCard:Error::', error);
			customToast.error('Erreur lors de la suppression de la classe');
		}
	};

	const handleViewDetails = () => {
		router.push(`/admin/classes/${classe.idClass}`);
	};

	return (
		<div className="p-6 w-full rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start">
				<div className="flex gap-2 justify-center items-center ">
					<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 w-fit">{degreeName}</span>
					<h3 className="text-xl font-bold text-gray-900">{classe.name}</h3>
				</div>
				<div className="flex gap-2">
					<Button onPress={handleViewDetails} size="sm" className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
						Voir les détails
					</Button>
					<Button onPress={handleDelete} size="sm" color="danger" variant="light" className="px-4 py-2 text-sm font-medium">
						Supprimer
					</Button>
				</div>
			</div>
			<div className="">
				<span className="text-gray-700 text-sm">
					Du <span className="font-medium text-gray-900">{formatDate(classe.startDate)}</span> au <span className="font-medium text-gray-900">{formatDate(classe.endDate)}</span>
				</span>
			</div>
		</div>
	);
};
