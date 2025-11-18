'use client';

import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { useState } from 'react';

interface DeleteConfirmPopoverProps {
	entityName: string;
	entityType: 'classe' | 'enseignant' | 'étudiant' | 'diplôme';
	onConfirm: () => Promise<void>;
	isLoading?: boolean;
	triggerButton?: React.ReactNode;
}

export const DeleteConfirmPopover = ({ entityName, entityType, onConfirm, isLoading = false, triggerButton }: DeleteConfirmPopoverProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleConfirm = async () => {
		setIsDeleting(true);
		try {
			await onConfirm();
			setIsOpen(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger>
				{triggerButton || (
					<Button size="sm" color="danger" variant="flat" isLoading={isLoading}>
						Supprimer
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-[340px]">
				<div className="px-1 py-2 w-full">
					<div className="flex items-start gap-3 mb-4">
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
							<svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h3 className="text-base font-semibold text-gray-900 mb-1">Confirmer la suppression</h3>
							<p className="text-sm text-gray-600 mb-2">
								Êtes-vous sûr de vouloir supprimer {entityType === 'classe' ? 'la' : entityType === 'étudiant' ? "l'" : 'le'} {entityType}{' '}
								<span className="font-semibold text-gray-900">&quot;{entityName}&quot;</span> ?
							</p>
							<div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
								<p className="text-xs text-red-800 font-medium">⚠️ Cette action est irréversible !</p>
								<p className="text-xs text-red-700 mt-1">Toutes les relations associées seront également supprimées.</p>
							</div>
						</div>
					</div>
					<div className="flex gap-2 justify-end">
						<Button size="sm" variant="flat" onPress={() => setIsOpen(false)} isDisabled={isDeleting}>
							Annuler
						</Button>
						<Button size="sm" color="danger" onPress={handleConfirm} isLoading={isDeleting}>
							Supprimer définitivement
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
