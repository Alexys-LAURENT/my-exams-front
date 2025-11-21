'use client';
import { createMatiere } from '@/backend_requests/matieres/createMatiere';
import { updateMatiere } from '@/backend_requests/matieres/updateMatiere';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Matiere } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface CreateMatiereModalContentProps {
	existingMatiere?: Matiere;
}

const CreateMatiereModalContent = ({ existingMatiere }: CreateMatiereModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();

	const [formNom, setFormNom] = useState(existingMatiere?.nom || '');
	const [isLoading, setIsLoading] = useState(false);

	const isEditMode = !!existingMatiere;

	const handleSubmit = async () => {
		try {
			if (!formNom) {
				customToast.error('Veuillez remplir le nom de la matière');
				return;
			}

			setIsLoading(true);

			const res = isEditMode
				? await updateMatiere(existingMatiere.idMatiere, {
						nom: formNom,
				  })
				: await createMatiere({
						nom: formNom,
				  });

			if (!('success' in res)) {
				return customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la matière`);
			} else {
				closeModal();
				customToast.success(`Matière ${isEditMode ? 'modifiée' : 'créée'} avec succès`);
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la matière`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>{isEditMode ? 'Modifier la matière' : 'Créer une matière'}</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-3">
					<Input
						placeholder={'Entrez le nom de la matière'}
						labelPlacement="outside"
						size="sm"
						label={
							<>
								{'Nom de la matière'}
								<span className="text-red-500">*</span>
							</>
						}
						value={formNom}
						onChange={(e) => setFormNom(e.target.value)}
					/>
				</form>
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button size="sm" className="bg-blue-500 text-white font-semibold" isLoading={isLoading} onPress={() => handleSubmit()} isDisabled={!formNom}>
					{isEditMode ? 'Modifier la matière' : 'Créer la matière'}
				</Button>
			</ModalFooter>
		</>
	);
};

export default CreateMatiereModalContent;
