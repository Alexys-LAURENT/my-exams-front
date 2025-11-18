'use client';
import { deleteClass } from '@/backend_requests/classes/deleteClass';
import { DeleteConfirmPopover } from '@/components/AdminPage/DeleteConfirmPopover';
import { ToastContext } from '@/Context/ToastContext';
import { Class } from '@/types/entitties';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface ClassCardProps {
	classe: Class;
	degreeName: string;
}

export const ClassCard = ({ classe, degreeName }: ClassCardProps) => {
	const router = useRouter();
	const { customToast } = useContext(ToastContext);
	const [isLoading, setIsLoading] = useState(false);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			const resDelete = await deleteClass(classe.idClass);
			if (!('success' in resDelete)) {
				throw new Error('Erreur lors de la suppression de la classe');
			}
			customToast.success('Classe supprimée avec succès');
			router.refresh();
		} catch (error) {
			console.error('ClassCard:Error::', error);
			customToast.error('Erreur lors de la suppression de la classe');
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewDetails = () => {
		router.push(`/admin/classes/${classe.idClass}`);
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
			<div className="flex justify-between items-start mb-4">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3">
						<h3 className="text-xl font-bold text-gray-900">{classe.name}</h3>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{degreeName}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<span className="font-medium text-gray-700">{formatDate(classe.startDate)}</span>
						<span className="text-gray-400">→</span>
						<span className="font-medium text-gray-700">{formatDate(classe.endDate)}</span>
					</div>
				</div>
				<div className="flex gap-2">
					<Button onPress={handleViewDetails} size="sm" color="primary" variant="flat" className="font-medium">
						Voir les détails
					</Button>
					<DeleteConfirmPopover
						entityName={classe.name}
						entityType="classe"
						onConfirm={handleDelete}
						isLoading={isLoading}
						triggerButton={
							<Button size="sm" color="danger" variant="flat" className="font-medium" isLoading={isLoading}>
								Supprimer
							</Button>
						}
					/>
				</div>
			</div>
		</div>
	);
};
