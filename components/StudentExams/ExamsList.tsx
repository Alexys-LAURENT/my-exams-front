'use client';

import { ExamGrade, ExamWithDates } from '@/types/entitties';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ToDoExamCard from '../StudentDashboard/ToDoExamCard';
import UpcomingExamCard from '../StudentDashboard/UpcomingExamCard';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

type ExamsListProps = {
	pendingExams: ExamWithGrade[];
	completedExams: ExamWithGrade[];
	upcomingExams: ExamWithDates[];
	idStudent: number;
	idClass: number;
};

const ExamsList = ({ pendingExams, completedExams, upcomingExams, idStudent, idClass }: ExamsListProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'upcoming'>((searchParams.get('status') as 'all' | 'pending' | 'completed' | 'upcoming') || 'all');

	// Debounce pour la recherche
	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());

			if (searchQuery) {
				params.set('search', searchQuery);
			} else {
				params.delete('search');
			}

			if (activeFilter !== 'all') {
				params.set('status', activeFilter);
			} else {
				params.delete('status');
			}

			router.replace(`?${params.toString()}`, { scroll: false });
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery, activeFilter, router, searchParams]);

	const allExams = useMemo(() => {
		return [
			...pendingExams.map((exam) => ({ ...exam, category: 'pending' as const })),
			...completedExams.map((exam) => ({ ...exam, category: 'completed' as const })),
			...upcomingExams.map((exam) => ({ ...exam, category: 'upcoming' as const, examGrade: null })),
		];
	}, [pendingExams, completedExams, upcomingExams]);

	const filteredExams = useMemo(() => {
		let exams = allExams;

		// Filtre par catégorie
		if (activeFilter !== 'all') {
			exams = exams.filter((exam) => exam.category === activeFilter);
		}

		// Filtre par recherche
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			exams = exams.filter((exam) => exam.title.toLowerCase().includes(query) || exam.desc?.toLowerCase().includes(query));
		}

		return exams;
	}, [allExams, activeFilter, searchQuery]);

	const filteredPendingExams = filteredExams.filter((exam) => exam.category === 'pending');
	const filteredCompletedExams = filteredExams.filter((exam) => exam.category === 'completed');
	const filteredUpcomingExams = filteredExams.filter((exam) => exam.category === 'upcoming');

	return (
		<div>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Examens</h1>
				<p className="text-gray-600">
					{pendingExams.length} à faire • {completedExams.length} passé{completedExams.length > 1 ? 's' : ''} • {upcomingExams.length} à venir
				</p>
			</div>

			{/* Barre de recherche et filtres */}
			<div className="bg-white border border-black/10 rounded-xl p-6 mb-8">
				{/* Recherche */}
				<div className="relative mb-4">
					<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher un examen par nom..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					/>
				</div>

				{/* Filtres */}
				<div className="flex items-center gap-2">
					<FunnelIcon className="w-5 h-5 text-gray-500" />
					<span className="text-sm font-medium text-gray-700 mr-2">Filtrer par :</span>
					<button
						onClick={() => setActiveFilter('all')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
					>
						Tous ({allExams.length})
					</button>
					<button
						onClick={() => setActiveFilter('pending')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
							activeFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						À faire ({pendingExams.length})
					</button>
					<button
						onClick={() => setActiveFilter('completed')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
							activeFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Passés ({completedExams.length})
					</button>
					<button
						onClick={() => setActiveFilter('upcoming')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
							activeFilter === 'upcoming' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						À venir ({upcomingExams.length})
					</button>
				</div>
			</div>

			{/* Message si aucun résultat */}
			{filteredExams.length === 0 && (
				<div className="bg-white border border-black/10 rounded-xl p-8 text-center">
					<p className="text-gray-600">Aucun examen trouvé</p>
				</div>
			)}

			{/* Examens à venir */}
			{filteredUpcomingExams.length > 0 && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Examens à venir</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredUpcomingExams.map((exam) => (
							<UpcomingExamCard key={exam.idExam} exam={exam} />
						))}
					</div>
				</div>
			)}

			{/* Examens à faire */}
			{filteredPendingExams.length > 0 && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Examens à faire</h2>
					<div className="bg-white border border-black/10 rounded-xl divide-y divide-gray-100">
						{filteredPendingExams.map((exam) => (
							<ToDoExamCard key={exam.idExam} idClass={idClass} exam={exam} idStudent={idStudent} />
						))}
					</div>
				</div>
			)}

			{/* Examens passés */}
			{filteredCompletedExams.length > 0 && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Examens passés</h2>
					<div className="bg-white border border-black/10 rounded-xl divide-y divide-gray-100">
						{filteredCompletedExams.map((exam) => (
							<ToDoExamCard key={exam.idExam} idClass={idClass} exam={exam} idStudent={idStudent} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ExamsList;
