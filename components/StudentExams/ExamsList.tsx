'use client';

import { useState, useMemo } from 'react';
import { ExamWithDates, ExamGrade } from '@/types/entitties';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ExamCard from './ExamCard';

type ExamWithGrade = ExamWithDates & {
	examGrade: ExamGrade | null;
};

type ExamsListProps = {
	pendingExams: ExamWithGrade[];
	completedExams: ExamWithGrade[];
	idStudent: number;
};

const ExamsList = ({ pendingExams, completedExams, idStudent }: ExamsListProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

	const allExams = useMemo(() => {
		return [
			...pendingExams.map((exam) => ({ ...exam, category: 'pending' as const })),
			...completedExams.map((exam) => ({ ...exam, category: 'completed' as const })),
		];
	}, [pendingExams, completedExams]);

	// Filtrer les examens selon la recherche et le filtre actif
	const filteredExams = useMemo(() => {
		let exams = allExams;

		// Filtre par catégorie
		if (activeFilter === 'pending') {
			exams = exams.filter((exam) => exam.category === 'pending');
		} else if (activeFilter === 'completed') {
			exams = exams.filter((exam) => exam.category === 'completed');
		}

		// Filtre par recherche
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			exams = exams.filter(
				(exam) =>
					exam.title.toLowerCase().includes(query) ||
					exam.desc?.toLowerCase().includes(query)
			);
		}

		return exams;
	}, [allExams, activeFilter, searchQuery]);

	// Séparer les examens filtrés par catégorie pour l'affichage
	const filteredPendingExams = filteredExams.filter((exam) => exam.category === 'pending');
	const filteredCompletedExams = filteredExams.filter((exam) => exam.category === 'completed');

	return (
		<div>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Examens</h1>
				<p className="text-gray-600">
					{pendingExams.length} examen{pendingExams.length > 1 ? 's' : ''} à faire • {completedExams.length} examen
					{completedExams.length > 1 ? 's' : ''} passé{completedExams.length > 1 ? 's' : ''}
				</p>
			</div>

			{/* Barre de recherche et filtres */}
			<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
				{/* Recherche */}
				<div className="relative mb-4">
					<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher un examen..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					/>
				</div>

				{/* Filtres */}
				<div className="flex gap-2">
					<button
						onClick={() => setActiveFilter('all')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							activeFilter === 'all'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Tous ({allExams.length})
					</button>
					<button
						onClick={() => setActiveFilter('pending')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							activeFilter === 'pending'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						À faire ({pendingExams.length})
					</button>
					<button
						onClick={() => setActiveFilter('completed')}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							activeFilter === 'completed'
								? 'bg-green-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Passés ({completedExams.length})
					</button>
				</div>
			</div>

			{/* Message si aucun résultat */}
			{filteredExams.length === 0 && (
				<div className="bg-white rounded-xl shadow-lg p-8 text-center">
					<p className="text-gray-600">Aucun examen trouvé</p>
				</div>
			)}

			{/* Affichage selon le filtre actif */}
			{activeFilter === 'all' ? (
				// Mode "Tous" : affichage côte à côte
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Colonne gauche : Examens à faire */}
					{filteredPendingExams.length > 0 && (
						<div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Examens à faire</h2>
							<div className="space-y-4">
								{filteredPendingExams.map((exam) => (
									<ExamCard key={exam.idExam} exam={exam} idStudent={idStudent} category="pending" />
								))}
							</div>
						</div>
					)}

					{/* Colonne droite : Examens passés */}
					{filteredCompletedExams.length > 0 && (
						<div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Examens passés</h2>
							<div className="space-y-4">
								{filteredCompletedExams.map((exam) => (
									<ExamCard key={exam.idExam} exam={exam} idStudent={idStudent} category="completed" />
								))}
							</div>
						</div>
					)}
				</div>
			) : (
				// Mode filtre "À faire" ou "Passés" : affichage en grille complète
				<>
					{activeFilter === 'pending' && filteredPendingExams.length > 0 && (
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Examens à faire</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredPendingExams.map((exam) => (
									<ExamCard key={exam.idExam} exam={exam} idStudent={idStudent} category="pending" />
								))}
							</div>
						</div>
					)}

					{activeFilter === 'completed' && filteredCompletedExams.length > 0 && (
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Examens passés</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredCompletedExams.map((exam) => (
									<ExamCard key={exam.idExam} exam={exam} idStudent={idStudent} category="completed" />
								))}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ExamsList;
