'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAllClassesForOneTeacher } from '@/backend_requests/classes/getAllClassesForOneTeacher';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { putExamsForClass } from '@/backend_requests/classes/putExamsForClass';
import { Class, Degree } from '@/types/entitties';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import formatDateWithShortMonth from '@/utils/formatDateWithShortMonth';

type ClassWithDegree = Class & { degree: Degree | null };

const AddClassToExam = ({ idExam, existingClassIds }: { idExam: number; existingClassIds: number[] }) => {
	const dateNow = new Date();
	const { data: session } = useSession();
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [availableClasses, setAvailableClasses] = useState<ClassWithDegree[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isModalOpen && session?.user?.idUser) {
			loadAvailableClasses();
		}
	}, [isModalOpen, session]);

	const loadAvailableClasses = async () => {
		if (!session?.user?.idUser) return;
		setIsLoading(true);
		try {
			const response = await getAllClassesForOneTeacher(session.user.idUser);
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
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (selectedClasses.length === 0 || !startDate || !endDate) {
			setError('Veuillez sélectionner au moins une classe et remplir les dates');
			return;
		}

		const startDateISO = startDate;
		const endDateISO = endDate;

		console.log('Dates envoyées:', { start_date: startDateISO, end_date: endDateISO });

		if (new Date(endDateISO) < new Date(startDateISO)) {
			setError('La date de fin doit être après la date de début');
			return;
		}

		setIsLoading(true);
		try {
			const promises = selectedClasses.map((idClass) =>
				putExamsForClass(idClass, idExam, {
					start_date: startDateISO,
					end_date: endDateISO,
				})
			);

			const results = await Promise.all(promises);
			const allSuccess = results.every((response) => 'success' in response);

			if (allSuccess) {
				setIsModalOpen(false);
				setSelectedClasses([]);
				setStartDate('');
				setEndDate('');
				router.refresh();
			} else {
				setError("Erreur lors de l'ajout de certaines classes");
				console.error("Erreur lors de l'ajout des classes:", results);
				console.log(startDateISO, endDateISO);
			}
		} catch (error) {
			console.error("Erreur lors de l'ajout des classes:", error);
			setError("Erreur lors de l'ajout des classes");
		} finally {
			setIsLoading(false);
		}
	};

	const toggleClassSelection = (idClass: number) => {
		setSelectedClasses((prev) => {
			if (prev.includes(idClass)) {
				return prev.filter((id) => id !== idClass);
			} else {
				return [...prev, idClass];
			}
		});
	};

	return (
		<div>
			<button
				onClick={() => setIsModalOpen(true)}
				className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
			>
				<PlusIcon className="w-5 h-5" />
				<span>Ajouter une classe</span>
			</button>
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-900">Ajouter une classe à l'examen</h2>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
								<XMarkIcon className="w-6 h-6" />
							</button>
						</div>
						<form onSubmit={handleSubmit} className="p-6">
							{error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
									{isLoading ? (
										<div className="text-center py-4">
											<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
										</div>
									) : availableClasses.length === 0 ? (
										<p className="text-gray-500 text-center py-4">Toutes vos classes sont déjà associées à cet examen</p>
									) : (
										<div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
											{availableClasses.map((classe) => (
												<label
													key={classe.idClass}
													className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
														selectedClasses.includes(classe.idClass) ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
													}`}
												>
													<input
														type="checkbox"
														name="class"
														value={classe.idClass}
														checked={selectedClasses.includes(classe.idClass)}
														onChange={() => toggleClassSelection(classe.idClass)}
														className="mr-3"
													/>
													<div className="flex-1">
														<p className="font-medium text-gray-900">{classe.degree?.name || 'Diplôme non défini'}</p>
														<p className="text-sm text-gray-500">
															{formatDateWithShortMonth(classe.startDate)} - {formatDateWithShortMonth(classe.endDate)}
														</p>
													</div>
												</label>
											))}
										</div>
									)}
								</div>
								{availableClasses.length > 0 && (
									<div>
										<div>
											<label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
												Date de début
											</label>
											<input
												type="date"
												id="startDate"
												value={startDate}
												onChange={(e) => setStartDate(e.target.value)}
												required
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
												Date de fin
											</label>
											<input
												type="date"
												id="endDate"
												value={endDate}
												onChange={(e) => setEndDate(e.target.value)}
												required
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
											/>
										</div>
									</div>
								)}
							</div>
							{availableClasses.length > 0 && (
								<div className="mt-6 flex gap-3">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Annuler
									</button>
									<button
										type="submit"
										disabled={isLoading || selectedClasses.length === 0}
										className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isLoading ? 'Ajout...' : `Ajouter${selectedClasses.length > 1 ? ` (${selectedClasses.length})` : ''}`}
									</button>
								</div>
							)}
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddClassToExam;
