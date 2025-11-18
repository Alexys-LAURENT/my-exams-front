'use client';
import { createClass } from '@/backend_requests/classes/createClass';
import { updateClass } from '@/backend_requests/classes/updateClass';
import { getAllDegrees } from '@/backend_requests/degrees/getAllDegrees';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Class, Degree } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

interface CreateClassModalContentProps {
	start_date: string;
	end_date: string;
	existingClass?: Class;
}

const CreateClassModalContent = ({ start_date, end_date, existingClass }: CreateClassModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();
	const [formNameValue, setFormNameValue] = useState(existingClass?.name || '');
	const [formDegreeValue, setFormDegreeValue] = useState<number | undefined>(existingClass?.idDegree);

	const [degrees, setDegrees] = useState<Degree[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isCreationLoading, setIsCreationLoading] = useState(false);

	const isEditMode = !!existingClass;

	useEffect(() => {
		if (isMounted) return;
		try {
			const getDegrees = async () => {
				const res = await getAllDegrees();
				if ('success' in res) {
					setDegrees(res.data);
				} else {
					console.error('CreateClassModalContent:Error::', 'message' in res ? res.message : 'Unknown error');
					throw new Error('Erreur lors de la récupération des degrees');
				}
			};
			getDegrees();
			setIsMounted(true);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			customToast.error('Erreur lors de la récupération des degrees');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = async () => {
		try {
			if (!formDegreeValue) {
				customToast.error('Veuillez sélectionner un diplôme');
				return;
			}
			setIsCreationLoading(true);

			const body = {
				name: formNameValue,
				idDegree: formDegreeValue,
				startDate: start_date,
				endDate: end_date,
			};

			const res = isEditMode ? await updateClass(existingClass.idClass, body) : await createClass(body);

			if (!('success' in res)) {
				return customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la classe`);
			} else {
				closeModal();
				customToast.success(`Classe ${isEditMode ? 'modifiée' : 'créée'} avec succès`);
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la classe`);
		} finally {
			setIsCreationLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>{isEditMode ? 'Modifier la classe' : 'Créer une classe'}</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-2">
					<Input
						placeholder={'Entrez le nom de la classe'}
						labelPlacement="outside"
						size="sm"
						label={
							<>
								{'Nom de la classe'}
								<span className="text-red-500">*</span>
							</>
						}
						value={formNameValue}
						onChange={(e) => setFormNameValue(e.target.value)}
					/>

					<div className="flex flex-col pt-2">
						<Select
							label={
								<>
									{'Diplome de la classe'}
									<span className="text-red-500">*</span>
								</>
							}
							size="sm"
							labelPlacement="outside"
							selectedKeys={formDegreeValue ? [formDegreeValue.toString()] : []}
							placeholder={'Sélectionner un diplôme'}
							className="!bg-bg_light_secondary dark:!bg-bg_dark_secondary custom-multiple-select !border-none"
							onSelectionChange={(value) => {
								setFormDegreeValue(Number(value.anchorKey));
							}}
							items={degrees}
						>
							{(item) => <SelectItem key={item.idDegree.toString()}>{item.name}</SelectItem>}
						</Select>
					</div>
					{/* Affichage des dates en lecture seule */}
					<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
						<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Période de la classe</p>
						<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
							Du {formatDate(start_date)} au {formatDate(end_date)}
						</p>
					</div>
				</form>
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button size="sm" className="bg-blue-500 text-white font-semibold" isLoading={isCreationLoading} onPress={() => handleSubmit()} isDisabled={!formNameValue || !formDegreeValue}>
					{isEditMode ? 'Modifier la classe' : 'Créer la classe'}
				</Button>
			</ModalFooter>
		</>
	);
};

export default CreateClassModalContent;
