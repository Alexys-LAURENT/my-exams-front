'use client';
import { putTeacherToClass } from '@/backend_requests/classes/putTeacherToClass';
import { getAllTeachers } from '@/backend_requests/teachers/getAllTeachers';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { User } from '@/types/entitties';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

interface AddTeacherToClassModalContentProps {
	idClass: number;
	existingTeacherIds: number[];
}

const AddTeacherToClassModalContent = ({ idClass, existingTeacherIds }: AddTeacherToClassModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();
	const [selectedTeachers, setSelectedTeachers] = useState<User[]>([]);
	const [teachers, setTeachers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const loadTeachers = async (filter?: string) => {
		try {
			setIsSearching(true);
			const res = await getAllTeachers(1, filter);
			if ('success' in res) {
				// Filtrer les professeurs déjà dans la classe et ceux déjà sélectionnés
				const selectedIds = selectedTeachers.map((t) => t.idUser);
				const availableTeachers = res.data.data.filter((teacher) => !existingTeacherIds.includes(teacher.idUser) && !selectedIds.includes(teacher.idUser));
				setTeachers(availableTeachers);
			} else {
				console.error('AddTeacherToClassModalContent:Error::', 'message' in res ? res.message : 'Unknown error');
				throw new Error('Erreur lors de la récupération des professeurs');
			}
		} catch {
			customToast.error('Erreur lors de la récupération des professeurs');
		} finally {
			setIsSearching(false);
		}
	};

	useEffect(() => {
		loadTeachers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTeachers]);

	const handleSubmit = async () => {
		try {
			if (selectedTeachers.length === 0) {
				customToast.error('Veuillez sélectionner au moins un professeur');
				return;
			}
			setIsLoading(true);

			// Ajouter tous les professeurs sélectionnés
			const promises = selectedTeachers.map((teacher) => putTeacherToClass(idClass, teacher.idUser));

			const results = await Promise.all(promises);

			// Vérifier si toutes les requêtes ont réussi
			const allSuccess = results.every((res) => 'success' in res && res.success);

			if (!allSuccess) {
				return customToast.error("Erreur lors de l'ajout de certains professeurs");
			} else {
				closeModal();
				customToast.success(selectedTeachers.length > 1 ? `${selectedTeachers.length} professeurs ajoutés avec succès` : 'Professeur ajouté avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de l'ajout des professeurs");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectionChange = (key: string | number | null) => {
		if (key) {
			const teacher = teachers.find((t) => t.idUser.toString() === key.toString());
			if (teacher && !selectedTeachers.find((t) => t.idUser === teacher.idUser)) {
				setSelectedTeachers([...selectedTeachers, teacher]);
				setSearchValue('');
			}
		}
	};

	const removeTeacher = (idUser: number) => {
		setSelectedTeachers(selectedTeachers.filter((t) => t.idUser !== idUser));
	};

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>Ajouter des professeurs à la classe</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6 ">
				<form className="flex flex-col gap-2">
					<div className="flex flex-col pt-2 gap-3">
						{/* Afficher les professeurs sélectionnés */}
						{selectedTeachers.length > 0 && (
							<div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
								{selectedTeachers.map((teacher) => (
									<Chip
										key={teacher.idUser}
										onClose={() => removeTeacher(teacher.idUser)}
										variant="flat"
										color="primary"
										avatar={<Avatar name={teacher.name} src={teacher.avatarPath || undefined} />}
									>
										{teacher.name} {teacher.lastName}
									</Chip>
								))}
							</div>
						)}

						<Autocomplete
							label={
								<>
									{'Rechercher et ajouter des professeurs'}
									<span className="text-red-500">*</span>
								</>
							}
							labelPlacement="outside"
							placeholder="Rechercher un professeur..."
							inputValue={searchValue}
							onInputChange={(value) => {
								setSearchValue(value);
								loadTeachers(value);
							}}
							onSelectionChange={handleSelectionChange}
							isLoading={isSearching}
							items={teachers}
							allowsCustomValue={false}
							listboxProps={{
								emptyContent: searchValue ? 'Aucun professeur trouvé' : 'Commencez à taper pour rechercher',
							}}
							className="!bg-bg_light_secondary dark:!bg-bg_dark_secondary !border-none"
						>
							{(item) => (
								<AutocompleteItem key={item.idUser.toString()} textValue={`${item.name} ${item.lastName}`}>
									<div className="flex items-center gap-2">
										<Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatarPath || undefined} name={item.name} />
										<div className="flex flex-col">
											<span>
												{item.name} {item.lastName}
											</span>
											<span className="text-default-500 text-tiny">{item.email}</span>
										</div>
									</div>
								</AutocompleteItem>
							)}
						</Autocomplete>
					</div>
					{selectedTeachers.length === 0 && teachers.length === 0 && !isSearching && searchValue === '' && (
						<p className="text-sm text-gray-500">Tous les professeurs sont déjà dans cette classe</p>
					)}
				</form>
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button size="sm" className="bg-blue-500 text-white font-semibold" isLoading={isLoading} onPress={() => handleSubmit()} isDisabled={selectedTeachers.length === 0}>
					Ajouter {selectedTeachers.length > 0 ? `(${selectedTeachers.length})` : ''}
				</Button>
			</ModalFooter>
		</>
	);
};

export default AddTeacherToClassModalContent;
