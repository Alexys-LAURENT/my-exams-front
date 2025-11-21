'use client';
import { getAllMatieres } from '@/backend_requests/matieres/getAllMatieres';
import { createTeacher } from '@/backend_requests/teachers/createTeacher';
import { updateTeacher } from '@/backend_requests/teachers/updateTeacher';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Matiere, User } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

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
	const [selectedMatiereIds, setSelectedMatiereIds] = useState<Set<string>>(new Set());
	const [matieres, setMatieres] = useState<Matiere[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const isEditMode = !!existingTeacher;

	useEffect(() => {
		if (isMounted || isEditMode) return;
		try {
			const fetchMatieres = async () => {
				const res = await getAllMatieres();
				if ('success' in res) {
					setMatieres(res.data);
				} else {
					console.error('CreateTeacherModalContent:Error::', 'message' in res ? res.message : 'Unknown error');
					throw new Error('Erreur lors de la récupération des matières');
				}
			};
			fetchMatieres();
			setIsMounted(true);
		} catch {
			customToast.error('Erreur lors de la récupération des matières');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

			if (!isEditMode && selectedMatiereIds.size === 0) {
				customToast.error('Veuillez sélectionner au moins une matière');
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
						matiereIds: Array.from(selectedMatiereIds).map((id) => Number(id)),
				  });

			if (!('success' in res)) {
				return customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de l'enseignant`);
			}

			closeModal();
			customToast.success(`Enseignant ${isEditMode ? 'modifié' : 'créé'} avec succès`);
			return router.refresh();
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
						<>
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
								errorMessage={formPassword && formPassword.length < 6 ? 'Le mot de passe doit contenir au moins 6 caractères' : ''}
								isInvalid={formPassword.length > 0 && formPassword.length < 6}
							/>
							<Select
								label={
									<>
										{'Matières'}
										<span className="text-red-500">*</span>
									</>
								}
								labelPlacement="outside"
								selectionMode="multiple"
								selectedKeys={selectedMatiereIds}
								placeholder={'Sélectionner au moins une matière'}
								className="!bg-bg_light_secondary dark:!bg-bg_dark_secondary custom-multiple-select !border-none"
								onSelectionChange={(keys) => {
									setSelectedMatiereIds(keys as Set<string>);
								}}
								items={matieres}
							>
								{(item) => (
									<SelectItem key={item.idMatiere.toString()} textValue={item.nom}>
										{item.nom}
									</SelectItem>
								)}
							</Select>
						</>
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
					isDisabled={!formLastName || !formName || !formEmail || (!isEditMode && (!formPassword || selectedMatiereIds.size === 0))}
				>
					{isEditMode ? "Modifier l'enseignant" : "Créer l'enseignant"}
				</Button>
			</ModalFooter>
		</>
	);
};

export default CreateTeacherModalContent;
