'use client';
import { putStudentToClass } from '@/backend_requests/classes/putStudentToClass';
import { getAllStudents } from '@/backend_requests/students/getAllStudents';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { User } from '@/types/entitties';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { Select, SelectItem, SelectedItems } from '@heroui/select';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

interface AddStudentToClassModalContentProps {
	idClass: number;
	existingStudentIds: number[];
}

const AddStudentToClassModalContent = ({ idClass, existingStudentIds }: AddStudentToClassModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();
	const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

	const [students, setStudents] = useState<User[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isMounted) return;
		try {
			const getStudents = async () => {
				const res = await getAllStudents();
				if ('success' in res) {
					// Filtrer les étudiants déjà dans la classe
					const availableStudents = res.data.filter((student) => !existingStudentIds.includes(student.idUser));
					setStudents(availableStudents);
				} else {
					console.error('AddStudentToClassModalContent:Error::', 'message' in res ? res.message : 'Unknown error');
					throw new Error('Erreur lors de la récupération des étudiants');
				}
			};
			getStudents();
			setIsMounted(true);
		} catch {
			customToast.error('Erreur lors de la récupération des étudiants');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = async () => {
		try {
			if (selectedStudentIds.size === 0) {
				customToast.error('Veuillez sélectionner au moins un étudiant');
				return;
			}
			setIsLoading(true);

			// Ajouter tous les étudiants sélectionnés
			const promises = Array.from(selectedStudentIds).map((idStr) => putStudentToClass(idClass, Number(idStr)));

			const results = await Promise.all(promises);

			// Vérifier si toutes les requêtes ont réussi
			const allSuccess = results.every((res) => 'success' in res && res.success);

			if (!allSuccess) {
				return customToast.error("Erreur lors de l'ajout de certains étudiants");
			} else {
				closeModal();
				customToast.success(selectedStudentIds.size > 1 ? `${selectedStudentIds.size} étudiants ajoutés avec succès` : 'Étudiant ajouté avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de l'ajout des étudiants");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>Ajouter des étudiants à la classe</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-2">
					<div className="flex flex-col pt-2">
						<Select
							label={
								<>
									{'Étudiants'}
									<span className="text-red-500">*</span>
								</>
							}
							labelPlacement="outside"
							selectionMode="multiple"
							selectedKeys={selectedStudentIds}
							placeholder={'Sélectionner des étudiants'}
							className="!bg-bg_light_secondary dark:!bg-bg_dark_secondary custom-multiple-select !border-none"
							onSelectionChange={(keys) => {
								setSelectedStudentIds(keys as Set<string>);
							}}
							listboxProps={{
								emptyContent: 'Aucun étudiant disponible',
							}}
							items={students}
							renderValue={(items: SelectedItems<User>) => {
								return (
									<div className="flex flex-wrap gap-2">
										{items.map((item) => (
											<div key={item.key} className="flex items-center gap-2 px-2 py-1 my-2 rounded">
												<Avatar alt={item.data?.name} className="shrink-0" size="sm" src={item.data?.avatarPath || undefined} name={item.data?.name} />
												<div className="flex flex-col">
													<span className="text-sm">
														{item.data?.name} {item.data?.lastName}
													</span>
												</div>
											</div>
										))}
									</div>
								);
							}}
						>
							{(item) => (
								<SelectItem key={item.idUser.toString()} textValue={`${item.name} ${item.lastName}`}>
									<div className="flex items-center gap-2">
										<Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatarPath || undefined} name={item.name} />
										<div className="flex flex-col">
											<span>
												{item.name} {item.lastName}
											</span>
											<span className="text-default-500 text-tiny">{item.email}</span>
										</div>
									</div>
								</SelectItem>
							)}
						</Select>
					</div>
					{students.length === 0 && isMounted && <p className="text-sm text-gray-500">Tous les étudiants sont déjà dans cette classe</p>}
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
					isDisabled={selectedStudentIds.size === 0 || students.length === 0}
				>
					Ajouter {selectedStudentIds.size > 0 ? `(${selectedStudentIds.size})` : ''}
				</Button>
			</ModalFooter>
		</>
	);
};

export default AddStudentToClassModalContent;
