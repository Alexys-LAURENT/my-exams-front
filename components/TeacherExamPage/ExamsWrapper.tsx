'use client';
import { ExamWithAdditionalData } from '@/app/(protectedPages)/teacher/exams/page';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { useMemo, useState } from 'react';
import ExamAdvancedCard from './ExamAdvancedCard';

const ExamsWrapper = ({ examsWithAdditionalData }: { examsWithAdditionalData: ExamWithAdditionalData[] }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedMatiere, setSelectedMatiere] = useState<string>('all');

	// Extraire les matières uniques
	const matieres = useMemo(() => {
		const map = new Map<string, { label: string; value: string }>();
		for (const exam of examsWithAdditionalData) {
			if (!exam.matiere) continue;
			const value = String(exam.matiere.idMatiere);
			const label = exam.matiere.nom;
			if (!map.has(value)) map.set(value, { label, value });
		}
		return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
	}, [examsWithAdditionalData]);

	// Filtrer les examens
	const filtered = useMemo(() => {
		let result = examsWithAdditionalData;

		// Filtre par matière
		if (selectedMatiere !== 'all') {
			result = result.filter((exam) => String(exam.matiere.idMatiere) === selectedMatiere);
		}

		// Filtre par recherche textuelle
		if (searchQuery.trim() !== '') {
			result = result.filter((exam) => exam.title.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		return result;
	}, [examsWithAdditionalData, selectedMatiere, searchQuery]);

	return (
		<div className="space-y-6">
			{/* Filtres */}
			<div className="bg-white rounded-xl p-4 space-y-4">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<Input
							type="text"
							placeholder="Rechercher un examen par nom..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							classNames={{
								inputWrapper: 'bg-white rounded-lg',
							}}
							className="w-full  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
						/>
					</div>
					<Select
						label="Filtrer par matière"
						placeholder="Sélectionner une matière"
						selectedKeys={[selectedMatiere]}
						onSelectionChange={(keys) => {
							const value = Array.from(keys)[0] as string;
							setSelectedMatiere(value || 'all');
						}}
						size="sm"
						className="max-w-xs"
					>
						<>
							<SelectItem key="all">Toutes les matières</SelectItem>
							{matieres.map((m) => (
								<SelectItem key={m.value}>{m.label}</SelectItem>
							))}
						</>
					</Select>
				</div>
				<p className="text-sm text-gray-500">
					{filtered.length} examen{filtered.length !== 1 ? 's' : ''}
					{(searchQuery || selectedMatiere !== 'all') && ` (sur ${examsWithAdditionalData.length})`}
				</p>
			</div>

			{/* Liste des examens */}
			{filtered.length === 0 ? (
				<div className="bg-white rounded-xl p-12 text-center">
					<p className="text-gray-500">Aucun examen ne correspond à vos critères</p>
				</div>
			) : (
				<div className="space-y-3">
					{filtered.map((exam) => (
						<ExamAdvancedCard key={exam.idExam} exam={exam} />
					))}
				</div>
			)}
		</div>
	);
};

export default ExamsWrapper;
