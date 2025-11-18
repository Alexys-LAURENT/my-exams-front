'use client';
import { getAllClasses } from '@/backend_requests/classes/getAllClasses';
import { putTeacherToClass } from '@/backend_requests/classes/putTeacherToClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { SCHOOL_YEAR_START_MONTH } from '@/constants/schoolYears';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Class } from '@/types/entitties';
import { Button } from '@heroui/button';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { Select, SelectItem, SelectedItems } from '@heroui/select';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

interface AddTeacherToClassesModalContentProps {
	idTeacher: number;
	existingClassIds: number[];
}

type ClassWithDegree = Class & { degreeName: string };

const AddTeacherToClassesModalContent = ({ idTeacher, existingClassIds }: AddTeacherToClassesModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();
	const [selectedClassIds, setSelectedClassIds] = useState<Set<string>>(new Set());

	const [classes, setClasses] = useState<ClassWithDegree[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isMounted) return;
		try {
			const getClasses = async () => {
				const res = await getAllClasses();
				if ('success' in res) {
					// Filtrer les classes déjà assignées et ne garder que celles à partir de l'année scolaire actuelle
					const now = new Date();
					const currentSchoolYearStart = now.getMonth() >= SCHOOL_YEAR_START_MONTH ? now.getFullYear() : now.getFullYear() - 1;

					const filteredClasses = res.data.filter((classe) => {
						// Exclure les classes déjà assignées
						if (existingClassIds.includes(classe.idClass)) return false;

						// Ne garder que les classes de l'année scolaire actuelle ou future
						const classStartDate = new Date(classe.startDate);
						const classYear = classStartDate.getMonth() >= SCHOOL_YEAR_START_MONTH ? classStartDate.getFullYear() : classStartDate.getFullYear() - 1;

						return classYear >= currentSchoolYearStart;
					});

					// Récupérer les diplômes pour chaque classe
					const classesWithDegrees = await Promise.all(
						filteredClasses.map(async (classe) => {
							const degreeResponse = await getClassDegree(classe.idClass);
							const degreeName = 'success' in degreeResponse && degreeResponse.success ? degreeResponse.data.name : 'N/A';

							return {
								...classe,
								degreeName,
							};
						})
					);

					setClasses(classesWithDegrees);
				} else {
					console.error('AddTeacherToClassesModalContent:Error::', 'message' in res ? res.message : 'Unknown error');
					throw new Error('Erreur lors de la récupération des classes');
				}
			};
			getClasses();
			setIsMounted(true);
		} catch {
			customToast.error('Erreur lors de la récupération des classes');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = async () => {
		try {
			if (selectedClassIds.size === 0) {
				customToast.error('Veuillez sélectionner au moins une classe');
				return;
			}
			setIsLoading(true);

			// Ajouter l'enseignant à toutes les classes sélectionnées
			const promises = Array.from(selectedClassIds).map((idStr) => putTeacherToClass(Number(idStr), idTeacher));

			const results = await Promise.all(promises);

			// Vérifier si toutes les requêtes ont réussi
			const allSuccess = results.every((res) => 'success' in res && res.success);

			if (!allSuccess) {
				return customToast.error("Erreur lors de l'ajout à certaines classes");
			} else {
				closeModal();
				customToast.success(selectedClassIds.size > 1 ? `Enseignant ajouté à ${selectedClassIds.size} classes avec succès` : 'Enseignant ajouté à la classe avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de l'ajout aux classes");
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>Ajouter l&apos;enseignant à des classes</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-2">
					<div className="flex flex-col pt-2">
						<Select
							label={
								<>
									{'Classes'}
									<span className="text-red-500">*</span>
								</>
							}
							labelPlacement="outside"
							selectionMode="multiple"
							selectedKeys={selectedClassIds}
							placeholder={'Sélectionner des classes'}
							className="!bg-bg_light_secondary dark:!bg-bg_dark_secondary custom-multiple-select !border-none"
							onSelectionChange={(keys) => {
								setSelectedClassIds(keys as Set<string>);
							}}
							items={classes}
							renderValue={(items: SelectedItems<ClassWithDegree>) => {
								return (
									<div className="flex flex-wrap gap-2">
										{items.map((item) => (
											<div key={item.key} className="flex items-center gap-2  px-2 py-1 rounded">
												<div className="flex flex-col">
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium">{item.data?.name}</span>
														<span className="text-xs bg-blue-200 dark:bg-blue-800 px-1.5 py-0.5 rounded">{item.data?.degreeName}</span>
													</div>
													<span className="text-default-500 text-tiny">{item.data && `${formatDate(item.data.startDate)} - ${formatDate(item.data.endDate)}`}</span>
												</div>
											</div>
										))}
									</div>
								);
							}}
						>
							{(item) => (
								<SelectItem key={item.idClass.toString()} textValue={`${item.name} ${item.degreeName}`}>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<span className="font-medium">{item.name}</span>
											<span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{item.degreeName}</span>
										</div>
										<span className="text-default-500 text-tiny">
											{formatDate(item.startDate)} - {formatDate(item.endDate)}
										</span>
									</div>
								</SelectItem>
							)}
						</Select>
					</div>
					{classes.length === 0 && isMounted && (
						<p className="text-sm text-gray-500">Aucune classe disponible (toutes les classes actuelles sont déjà assignées ou aucune classe future n&apos;existe)</p>
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
					isDisabled={selectedClassIds.size === 0 || classes.length === 0}
				>
					Ajouter {selectedClassIds.size > 0 ? `(${selectedClassIds.size})` : ''}
				</Button>
			</ModalFooter>
		</>
	);
};

export default AddTeacherToClassesModalContent;
