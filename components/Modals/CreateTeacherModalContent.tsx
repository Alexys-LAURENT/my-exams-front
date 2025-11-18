'use client';
import { createTeacher } from '@/backend_requests/teachers/createTeacher';
import { updateTeacher } from '@/backend_requests/teachers/updateTeacher';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { User } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface CreateTeacherModalContentProps {
	existingTeacher?: User;
}

const CreateTeacherModalContent = ({ existingTeacher }: CreateTeacherModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();

	const [formLastName, setFormLastName] = useState(existingTeacher?.lastName || '');
	const [formName, setFormName] = useState(existingTeacher?.name || '');
	const [formEmail, setFormEmail] = useState(existingTeacher?.email || '');
	const [formPassword, setFormPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const isEditMode = !!existingTeacher;

	const handleSubmit = async () => {
		try {
			if (!formLastName || !formName || !formEmail) {
				customToast.error('Veuillez remplir tous les champs obligatoires');
				return;
			}

			if (!isEditMode && !formPassword) {
				customToast.error('Le mot de passe est obligatoire pour créer un enseignant');
				return;
			}

			setIsLoading(true);

			const res = isEditMode
				? await updateTeacher(existingTeacher.idUser, {
						lastName: formLastName,
						name: formName,
						email: formEmail,
				  })
				: await createTeacher({
						lastName: formLastName,
						name: formName,
						email: formEmail,
						password: formPassword,
				  });

			if (!('success' in res)) {
				return customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de l'enseignant`);
			} else {
				closeModal();
				customToast.success(`Enseignant ${isEditMode ? 'modifié' : 'créé'} avec succès`);
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de l'enseignant`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>{isEditMode ? "Modifier l'enseignant" : 'Créer un enseignant'}</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-3">
					<Input
						placeholder={'Entrez le nom'}
						labelPlacement="outside"
						size="sm"
						label={
							<>
								{'Nom'}
								<span className="text-red-500">*</span>
							</>
						}
						value={formLastName}
						onChange={(e) => setFormLastName(e.target.value)}
					/>
					<Input
						placeholder={'Entrez le prénom'}
						labelPlacement="outside"
						size="sm"
						label={
							<>
								{'Prénom'}
								<span className="text-red-500">*</span>
							</>
						}
						value={formName}
						onChange={(e) => setFormName(e.target.value)}
					/>
					<Input
						type="email"
						placeholder={"Entrez l'email"}
						labelPlacement="outside"
						size="sm"
						label={
							<>
								{'Email'}
								<span className="text-red-500">*</span>
							</>
						}
						value={formEmail}
						onChange={(e) => setFormEmail(e.target.value)}
					/>
					{!isEditMode && (
						<Input
							type="password"
							placeholder={'Entrez le mot de passe'}
							labelPlacement="outside"
							size="sm"
							label={
								<>
									{'Mot de passe'}
									<span className="text-red-500">*</span>
								</>
							}
							value={formPassword}
							onChange={(e) => setFormPassword(e.target.value)}
						/>
					)}
				</form>
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button
					size="sm"
					className="bg-blue-500 text-white font-semibold"
					isLoading={isLoading}
					onPress={() => handleSubmit()}
					isDisabled={!formLastName || !formName || !formEmail || (!isEditMode && !formPassword)}
				>
					{isEditMode ? "Modifier l'enseignant" : "Créer l'enseignant"}
				</Button>
			</ModalFooter>
		</>
	);
};

export default CreateTeacherModalContent;
