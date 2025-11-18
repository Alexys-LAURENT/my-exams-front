'use client';
import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { putExamsForClass } from '@/backend_requests/classes/putExamsForClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { ModalContext } from '@/Context/ModalContext';
import { ToastContext } from '@/Context/ToastContext';
import { Class, Degree } from '@/types/entitties';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { DatePicker } from '@heroui/date-picker';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import { CalendarDateTime, ZonedDateTime, getLocalTimeZone, toZoned } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
interface AddClassToExamModalContentProps {
	idExam: number;
	existingClassIds: number[];
	idTeacher: number;
}

type ClassWithDegree = Class & { degree: Degree | null };

type ClassFormData = {
	id: string;
	idClass: number | null;
	startDate: ZonedDateTime | null;
	endDate: ZonedDateTime | null;
};

const AddClassToExamModalContent = ({ idExam, existingClassIds, idTeacher }: AddClassToExamModalContentProps) => {
	const { customToast } = useContext(ToastContext);
	const { closeModal } = useContext(ModalContext);
	const router = useRouter();
	const dateNow = new Date();

	const [availableClasses, setAvailableClasses] = useState<ClassWithDegree[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [classForms, setClassForms] = useState<ClassFormData[]>([]);

	useEffect(() => {
		if (isMounted) return;
		const loadAvailableClasses = async () => {
			try {
				const response = await getAllClassesForOneTeacher(idTeacher);
				if ('success' in response) {
					const classes = response.data;
					const filtered = classes.filter((c) => !existingClassIds.includes(c.idClass) && new Date(c.endDate) > dateNow);
					const withDegrees = await Promise.all(
						filtered.map(async (classe) => {
							const degreeResponse = await getClassDegree(classe.idClass);
							const degree = degreeResponse && 'success' in degreeResponse ? degreeResponse.data : null;
							return { ...classe, degree };
						})
					);
					setAvailableClasses(withDegrees);
				}
			} catch (error) {
				console.error('Erreur lors du chargement des classes:', error);
				customToast.error('Erreur lors de la récupération des classes');
			}
		};
		loadAvailableClasses();
		setIsMounted(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addNewClassForm = () => {
		setClassForms((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				idClass: null,
				startDate: null,
				endDate: null,
			},
		]);
	};

	const removeClassForm = (id: string) => {
		setClassForms((prev) => prev.filter((form) => form.id !== id));
	};

	const updateFormClass = (id: string, idClass: number) => {
		setClassForms((prev) => prev.map((form) => (form.id === id ? { ...form, idClass } : form)));
	};

	const updateFormStartDate = (id: string, date: ZonedDateTime | null) => {
		setClassForms((prev) => prev.map((form) => (form.id === id ? { ...form, startDate: date } : form)));
	};

	const updateFormEndDate = (id: string, date: ZonedDateTime | null) => {
		setClassForms((prev) => prev.map((form) => (form.id === id ? { ...form, endDate: date } : form)));
	};

	const getAvailableClassesForForm = (formId: string) => {
		const selectedClassIds = classForms.filter((form) => form.id !== formId && form.idClass !== null).map((form) => form.idClass);
		return availableClasses.filter((classe) => !selectedClassIds.includes(classe.idClass));
	};

	const getMinDate = (classe: ClassWithDegree): ZonedDateTime => {
		const classStart = new Date(classe.startDate);
		const now = new Date();

		// Utiliser la date la plus récente entre le début de la classe et maintenant
		const minDate = classStart > now ? classStart : now;

		const calendarDateTime = new CalendarDateTime(minDate.getFullYear(), minDate.getMonth() + 1, minDate.getDate(), minDate.getHours(), minDate.getMinutes());

		return toZoned(calendarDateTime, getLocalTimeZone());
	};

	const getMaxDate = (classe: ClassWithDegree): ZonedDateTime => {
		const classEnd = new Date(classe.endDate);
		const calendarDateTime = new CalendarDateTime(classEnd.getFullYear(), classEnd.getMonth() + 1, classEnd.getDate(), classEnd.getHours(), classEnd.getMinutes());

		return toZoned(calendarDateTime, getLocalTimeZone());
	};

	const getMinDateForEndDate = (classe: ClassWithDegree, startDate: ZonedDateTime | null): ZonedDateTime => {
		if (!startDate) {
			return getMinDate(classe);
		}
		// La date de fin doit être au minimum la même date et heure que la date de début
		return startDate;
	};

	const getMaxDateForStartDate = (classe: ClassWithDegree, endDate: ZonedDateTime | null): ZonedDateTime => {
		if (!endDate) {
			return getMaxDate(classe);
		}
		// La date de début doit être au maximum la même date et heure que la date de fin
		return endDate;
	};

	const handleSubmit = async () => {
		try {
			const validForms = classForms.filter((form) => form.idClass && form.startDate && form.endDate);

			if (validForms.length === 0) {
				customToast.error('Veuillez ajouter au moins une classe avec des dates valides');
				return;
			}

			// Valider chaque formulaire
			for (const form of validForms) {
				const classe = availableClasses.find((c) => c.idClass === form.idClass);
				if (!classe || !form.startDate || !form.endDate) continue;

				// Convertir en Date pour comparaison
				const start = new Date(form.startDate.toString());
				const end = new Date(form.endDate.toString());
				const classStart = new Date(classe.startDate);
				const classEnd = new Date(classe.endDate);

				if (end <= start) {
					customToast.error(`Pour la classe ${classe.name}: La date de fin doit être après la date de début`);
					return;
				}

				if (start < classStart || start > classEnd) {
					customToast.error(`Pour la classe ${classe.name}: La date de début doit être entre ${formatDateWithShortMonth(classe.startDate)} et ${formatDateWithShortMonth(classe.endDate)}`);
					return;
				}

				if (end < classStart || end > classEnd) {
					customToast.error(`Pour la classe ${classe.name}: La date de fin doit être entre ${formatDateWithShortMonth(classe.startDate)} et ${formatDateWithShortMonth(classe.endDate)}`);
					return;
				}
			}

			setIsLoading(true);

			const promises = validForms.map((form) => {
				// Convertir ZonedDateTime en ISO string avec timezone
				// form.startDate.toString() retourne par exemple "2025-11-19T12:00:00+01:00[Europe/Paris]"
				// On utilise toDate() puis toISOString() pour avoir le bon format
				const startDate = form.startDate!.toDate();
				const endDate = form.endDate!.toDate();

				return putExamsForClass(form.idClass!, idExam, {
					start_date: startDate.toISOString(),
					end_date: endDate.toISOString(),
				});
			});

			const results = await Promise.all(promises);
			const allSuccess = results.every((response) => 'success' in response);

			if (!allSuccess) {
				return customToast.error("Erreur lors de l'ajout de certaines classes");
			} else {
				closeModal();
				customToast.success(validForms.length > 1 ? `${validForms.length} classes ajoutées avec succès` : 'Classe ajoutée avec succès');
				return router.refresh();
			}
		} catch (error) {
			console.error(error);
			customToast.error("Erreur lors de l'ajout des classes");
		} finally {
			setIsLoading(false);
		}
	};

	const canSubmit = classForms.some((form) => form.idClass && form.startDate && form.endDate);

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div>Ajouter des classes à l&apos;examen</div>
			</ModalHeader>
			<ModalBody className="pb-3 !pt-0 px-6">
				{!isMounted ? (
					<div className="text-center py-8">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
					</div>
				) : availableClasses.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-sm text-gray-500">Toutes vos classes sont déjà associées à cet examen</p>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-600">{classForms.length === 0 ? 'Aucune classe ajoutée' : `${classForms.length} classe${classForms.length > 1 ? 's' : ''} à ajouter`}</p>
							<Button
								size="sm"
								onPress={addNewClassForm}
								className="bg-blue-500 text-white"
								startContent={<PlusIcon className="w-4 h-4" />}
								isDisabled={classForms.length >= availableClasses.length}
							>
								Ajouter une classe
							</Button>
						</div>

						{classForms.length > 0 && (
							<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
								{classForms.map((form) => {
									const availableClassesForThisForm = getAvailableClassesForForm(form.id);
									const selectedClass = form.idClass ? availableClasses.find((c) => c.idClass === form.idClass) : null;

									return (
										<div key={form.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 relative">
											<Button isIconOnly size="sm" variant="light" onPress={() => removeClassForm(form.id)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50">
												<TrashIcon className="w-4 h-4" />
											</Button>

											<div className="space-y-3 pr-8">
												<Select
													label={'Classe'}
													size="sm"
													labelPlacement="outside"
													placeholder="Sélectionner une classe"
													selectedKeys={form.idClass ? [form.idClass.toString()] : []}
													onSelectionChange={(keys) => {
														const key = Array.from(keys)[0];
														if (key) updateFormClass(form.id, Number(key));
													}}
													items={availableClassesForThisForm}
												>
													{(classe) => (
														<SelectItem key={classe.idClass.toString()} textValue={classe.name}>
															<div className="flex flex-col">
																<span className="font-medium">{classe.name}</span>
																<span className="text-xs text-gray-500">{classe.degree?.name || 'Diplôme non défini'}</span>
																<span className="text-xs text-gray-400">
																	{formatDateWithShortMonth(classe.startDate)} - {formatDateWithShortMonth(classe.endDate)}
																</span>
															</div>
														</SelectItem>
													)}
												</Select>

												{selectedClass && (
													<>
														<div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
															Période valide: {formatDateWithShortMonth(selectedClass.startDate)} - {formatDateWithShortMonth(selectedClass.endDate)}
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
															<I18nProvider locale="fr-FR">
																<DatePicker
																	label={'Date de début'}
																	labelPlacement="outside"
																	size="sm"
																	granularity="minute"
																	hideTimeZone
																	value={form.startDate}
																	onChange={(date) => updateFormStartDate(form.id, date)}
																	minValue={getMinDate(selectedClass)}
																	maxValue={getMaxDateForStartDate(selectedClass, form.endDate)}
																	isRequired
																	className="w-full"
																	hourCycle={24}
																/>
															</I18nProvider>

															<I18nProvider locale="fr-FR">
																<DatePicker
																	label={'Date de fin'}
																	labelPlacement="outside"
																	size="sm"
																	granularity="minute"
																	hideTimeZone
																	value={form.endDate}
																	onChange={(date) => updateFormEndDate(form.id, date)}
																	minValue={getMinDateForEndDate(selectedClass, form.startDate)}
																	maxValue={getMaxDate(selectedClass)}
																	isRequired
																	className="w-full"
																	hourCycle={24}
																/>
															</I18nProvider>
														</div>
													</>
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}

						{classForms.length === 0 && (
							<div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
								<PlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
								<p className="text-sm text-gray-500 mb-3">Aucune classe ajoutée</p>
								<Button size="sm" onPress={addNewClassForm} className="bg-blue-500 text-white">
									Ajouter votre première classe
								</Button>
							</div>
						)}
					</div>
				)}
			</ModalBody>
			<ModalFooter>
				<Button size="sm" onPress={() => closeModal()} variant="flat" className="mr-2 bg-neutral-200 dark:bg-neutral-800 text-default-500 dark:text-white">
					Annuler
				</Button>
				<Button size="sm" className="bg-blue-500 text-white font-semibold" isLoading={isLoading} onPress={() => handleSubmit()} isDisabled={!canSubmit || availableClasses.length === 0}>
					Ajouter {classForms.length > 0 ? `(${classForms.length})` : ''}
				</Button>
			</ModalFooter>
		</>
	);
};

export default AddClassToExamModalContent;
