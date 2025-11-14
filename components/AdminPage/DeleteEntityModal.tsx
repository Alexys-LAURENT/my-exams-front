import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { ReactNode } from 'react';

interface DeleteEntityModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	title: string;
	message: ReactNode;
	error?: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
}

export const DeleteEntityModal = ({ isOpen, onClose, onConfirm, title, message, error, confirmButtonText = 'Supprimer', cancelButtonText = 'Annuler' }: DeleteEntityModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold text-gray-800">{title}</h2>
				</ModalHeader>
				<ModalBody>
					<div className="text-gray-600 mb-4">{message}</div>
					<p className="text-sm text-red-600 font-medium">Cette action est irréversible.</p>
					{error && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
				</ModalBody>
				<ModalFooter>
					<Button color="default" variant="flat" onPress={onClose}>
						{cancelButtonText}
					</Button>
					<Button color="danger" onPress={onConfirm}>
						{confirmButtonText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
