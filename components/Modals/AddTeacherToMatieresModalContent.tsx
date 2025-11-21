'use client';
import { getAllMatieres } from '@/backend_requests/matieres/getAllMatieres';
import { addTeacherToMatiere } from '@/backend_requests/matieres/addTeacherToMatiere';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Matiere } from '@/types/entitties';
import { Button } from '@heroui/button';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { Select, SelectItem, SelectedItems } from '@heroui/select';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

interface AddTeacherToMatieresModalContentProps {
	idTeacher: number;
	existingMatiereIds: number[];
}

const AddTeacherToMatieresModalContent = ({ idTeacher, existingMatiereIds }: AddTeacherToMatieresModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();
	const [selectedMatiereIds, setSelectedMatiereIds] = useState<Set<string>>(new Set());

	const [matieres, setMatieres] = useState<Matiere[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isMounted) return;
		try {
			const getMatieres = async () => {
				const res = await getAllMatieres();
				if ('success' in res) {
					// Filtrer les matières déjà assignées
					const filteredMatieres = res.data.filter((matiere) => !existingMatiereIds.includes(matiere.idMatiere));
					setMatieres(filteredMatieres);
				} else {
					console.error('AddTeacherToMatieresModalContent:Error::', 'message' in res ? res.message : 'Unknown error');
					throw new Error('Erreur lors de la récupération des matières');
				}
			};
			getMatieres();
			setIsMounted(true);
		} catch {
			customToast.error('Erreur lors de la récupération des matières');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = async () => {
		try {
			if (selectedMatiereIds.size === 0) {
				customToast.error('Veuillez sélectionner au moins une matière');
				return;
			}
			setIsLoading(true);

			// Ajouter l'enseignant à toutes les matières sélectionnées
			const promises = Array.from(selectedMatiereIds).map((idStr) => addTeacherToMatiere(Number(idStr), idTeacher));

			const results = await Promise.all(promises);

			// Vérifier si toutes les requêtes ont réussi
			const allSuccess = results.every((res) => 'success' in res && res.success);

			if (!allSuccess) {
				return customToast.error("Erreur lors de l'ajout à certaines matières");
			} else {
				closeModal();
				customToast.success(
					selectedMatiereIds.size > 1 ? `Enseignant ajouté à ${selectedMatiereIds.size} matières avec succès` : 'Enseignant ajouté à la matière avec succès'
				);
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de l'ajout aux matières");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>Ajouter l&apos;enseignant à des matières</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-2">
					<div className="flex flex-col pt-2">
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
							placeholder={'Sélectionner des matières'}
							className="!bg-bg_light_secondary dark:!bg-bg_dark_secondary custom-multiple-select !border-none"
							onSelectionChange={(keys) => {
								setSelectedMatiereIds(keys as Set<string>);
							}}
							items={matieres}
							renderValue={(items: SelectedItems<Matiere>) => {
								return (
									<div className="flex flex-wrap gap-2">
										{items.map((item) => (
											<div key={item.key} className="flex items-center gap-2 px-2 py-1 rounded">
												<span className="text-sm font-medium">{item.data?.nom}</span>
											</div>
										))}
									</div>
								);
							}}
						>
							{(item) => (
								<SelectItem key={item.idMatiere.toString()} textValue={item.nom}>
									<div className="flex flex-col">
										<span className="font-medium">{item.nom}</span>
									</div>
								</SelectItem>
							)}
						</Select>
					</div>
					{matieres.length === 0 && isMounted && <p className="text-sm text-gray-500">Aucune matière disponible (toutes les matières sont déjà assignées)</p>}
				</form>
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button size="sm" className="bg-blue-500 text-white font-semibold" isLoading={isLoading} onPress={() => handleSubmit()} isDisabled={selectedMatiereIds.size === 0 || matieres.length === 0}>
					Ajouter {selectedMatiereIds.size > 0 ? `(${selectedMatiereIds.size})` : ''}
				</Button>
			</ModalFooter>
		</>
	);
};

export default AddTeacherToMatieresModalContent;
