'use client';

import { useEffect, useState } from 'react';
import { getAllExamsForOneTeacher } from '@/backend_requests/exams/getAllExamsForOneTeacher';
import { getQuestionsCountForOneExam } from '@/backend_requests/questions/getQuestionsCountForOneExam';
import { DocumentTextIcon, ClockIcon, CalendarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
};

const formatTime = (minutes: number) => {
	if (minutes < 60) {
		return `${minutes} min`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

const Page = () => {
	const { data: session } = useSession();
	const [examsWithQuestions, setExamsWithQuestions] = useState<any[]>([]);
	const [filteredExams, setFilteredExams] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchExams = async () => {
			if (!session?.user?.idUser) return;

			const idTeacher = session.user.idUser;
			const examsResponse = await getAllExamsForOneTeacher(idTeacher);
			const exams = 'success' in examsResponse ? examsResponse.data : [];
			const sortedExams = exams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

			const examsWithQuestionsData = await Promise.all(
				sortedExams.map(async (exam) => {
					const questionsCount = await getQuestionsCountForOneExam(exam.idExam);
					return {
						...exam,
						questionsCount: 'success' in questionsCount ? questionsCount.data : 0,
					};
				})
			);

			setExamsWithQuestions(examsWithQuestionsData);
			setFilteredExams(examsWithQuestionsData);
			setLoading(false);
		};

		fetchExams();
	}, [session]);

	useEffect(() => {
		if (searchQuery.trim() === '') {
			setFilteredExams(examsWithQuestions);
		} else {
			const filtered = examsWithQuestions.filter((exam) => exam.title.toLowerCase().includes(searchQuery.toLowerCase()));
			setFilteredExams(filtered);
		}
	}, [searchQuery, examsWithQuestions]);

	if (loading) {
		return (
			<div className="min-h-screen from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Chargement...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen from-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Examens</h1>
					<p className="text-gray-600">Gérez et consultez tous vos examens</p>
				</div>
				{examsWithQuestions.length === 0 ? (
					<div className="bg-white rounded-xl shadow-lg p-12 text-center">
						<DocumentTextIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucun examen créé</h3>
					</div>
				) : (
					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						<div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
							<div className="flex items-center justify-between text-white">
								<div>
									<h1 className="text-2xl font-bold mb-1">Liste des examens</h1>
									<p className="text-amber-100 text-sm">
										{filteredExams.length} examen{filteredExams.length !== 1 ? 's' : ''}
										{searchQuery && ` (sur ${examsWithQuestions.length})`}
									</p>
								</div>
								<DocumentTextIcon className="w-12 h-12 opacity-80" />
							</div>
						</div>
						<div className="p-6">
							<div className="mb-4">
								<div className="relative">
									<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="text"
										placeholder="Rechercher un examen par nom..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
									/>
								</div>
							</div>

							{filteredExams.length === 0 ? (
								<div className="text-center py-8">
									<DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-600">Aucun examen ne correspond à votre recherche</p>
								</div>
							) : (
								<div className="space-y-3">
									{filteredExams.map((exam) => (
										<Link
											key={exam.idExam}
											href={`/teacher/exams/${exam.idExam}`}
											className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-amber-50 hover:to-orange-50 transition-all duration-200 px-6 py-4 rounded-lg border border-gray-200 hover:border-amber-300 group"
										>
											<div className="flex items-center justify-between gap-4">
												<div className="flex-1 min-w-0">
													<div className="mb-2">
														<h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors truncate">{exam.title}</h3>
													</div>

													<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
														<div className="flex items-center gap-1">
															<ClockIcon className="w-4 h-4 text-amber-500" />
															<span>{formatTime(exam.time)}</span>
														</div>
														<div className="flex items-center gap-1">
															<DocumentTextIcon className="w-4 h-4 text-amber-500" />
															<span>
																{exam.questionsCount} question{exam.questionsCount !== 1 ? 's' : ''}
															</span>
														</div>
														<div className="flex items-center gap-1">
															<CalendarIcon className="w-4 h-4 text-amber-500" />
															<span>{formatDate(exam.createdAt)}</span>
														</div>
													</div>

													{exam.desc && <p className="text-sm text-gray-600 mt-2 line-clamp-1">{exam.desc}</p>}
												</div>

												<div className="flex-shrink-0">
													<span className="text-amber-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">Voir détails →</span>
												</div>
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
