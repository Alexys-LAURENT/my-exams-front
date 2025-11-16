import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { useState, useEffect, ReactNode } from 'react';

interface EditEntityModalProps<T> {
	isOpen: boolean;
	onClose: () => void;
	entity: T | null;
	title: string;
	onSave: (data: T) => Promise<void>;
	error?: string;
	children: (data: T, onChange: (field: keyof T, value: any) => void) => ReactNode;
	initialData: T;
}

export function EditEntityModal<T extends Record<string, any>>({ isOpen, onClose, entity, title, onSave, error, children, initialData }: EditEntityModalProps<T>) {
	const [formData, setFormData] = useState<T>(initialData);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (entity) {
			setFormData(entity);
		}
	}, [entity]);

	const handleChange = (field: keyof T, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await onSave(formData);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg" placement="center">
			<ModalContent>
				<form onSubmit={handleSubmit}>
					<ModalHeader className="flex flex-col gap-1">
						<h2 className="text-2xl font-bold text-gray-800">{title}</h2>
					</ModalHeader>
					<ModalBody>
						{error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
						{children(formData, handleChange)}
					</ModalBody>
					<ModalFooter>
						<Button color="default" variant="flat" onPress={onClose} isDisabled={isLoading}>
							Annuler
						</Button>
						<Button color="primary" type="submit" isLoading={isLoading}>
							Enregistrer
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
