'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ExamWithQuestionCount } from '@/app/(protectedPages)/teacher/exams/page';
import ExamComp from './ExamComp';

const FilterComp = ({ examsWithQuestionsData }: { examsWithQuestionsData: ExamWithQuestionCount[] }) => {
	const { data: session } = useSession();
	const [examsWithQuestions, setExamsWithQuestions] = useState<any[]>([]);
	const [filteredExams, setFilteredExams] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchExams = async () => {
			if (!session?.user?.idUser) return;

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
		<div>
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
									<ExamComp key={exam.idExam} exam={exam} />
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default FilterComp;
