'use client';
import { createDegree } from '@/backend_requests/degrees/createDegree';
import { updateDegree } from '@/backend_requests/degrees/updateDegree';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Degree } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface CreateDegreeModalContentProps {
	existingDegree?: Degree;
}

const CreateDegreeModalContent = ({ existingDegree }: CreateDegreeModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();

	const [formName, setFormName] = useState(existingDegree?.name || '');
	const [isLoading, setIsLoading] = useState(false);

	const isEditMode = !!existingDegree;

	const handleSubmit = async () => {
		try {
			if (!formName) {
				customToast.error('Veuillez remplir le nom du diplôme');
				return;
			}

			setIsLoading(true);

			const res = isEditMode
				? await updateDegree(existingDegree.idDegree, {
						name: formName,
				  })
				: await createDegree({
						name: formName,
				  });

			if (!('success' in res)) {
				return customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} du diplôme`);
			} else {
				closeModal();
				customToast.success(`Diplôme ${isEditMode ? 'modifié' : 'créé'} avec succès`);
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} du diplôme`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>{isEditMode ? 'Modifier le diplôme' : 'Créer un diplôme'}</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-3">
					<Input
						placeholder={'Entrez le nom du diplôme'}
						labelPlacement="outside"
						size="sm"
						label={
							<>
								{'Nom du diplôme'}
								<span className="text-red-500">*</span>
							</>
						}
						value={formName}
						onChange={(e) => setFormName(e.target.value)}
					/>
				</form>
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button size="sm" className="bg-blue-500 text-white font-semibold" isLoading={isLoading} onPress={() => handleSubmit()} isDisabled={!formName}>
					{isEditMode ? 'Modifier le diplôme' : 'Créer le diplôme'}
				</Button>
			</ModalFooter>
		</>
	);
};

export default CreateDegreeModalContent;
