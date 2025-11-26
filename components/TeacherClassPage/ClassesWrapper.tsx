'use client';
import { ClassWithDegree } from '@/app/(protectedPages)/teacher/classes/page';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Select, SelectItem } from '@heroui/select';
import { useMemo, useState } from 'react';
import ClassCardClient from './ClassCardClient';

const ClassesWrapper = ({ classesWithDetails }: { classesWithDetails: ClassWithDegree[] }) => {
	const [selectedDegree, setSelectedDegree] = useState<string>('all');

	// Extraire les diplômes uniques
	const degrees = useMemo(() => {
		const map = new Map<string, { label: string; value: string }>();
		for (const c of classesWithDetails) {
			if (!c.degree) continue;
			const value = c.degree.idDegree != null ? String(c.degree.idDegree) : c.degree.name;
			const label = c.degree.name;
			if (!map.has(value)) map.set(value, { label, value });
		}
		return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
	}, [classesWithDetails]);

	// Filtrer les classes selon le diplôme sélectionné
	const filtered = useMemo(() => {
		if (selectedDegree === 'all') return classesWithDetails;
		return classesWithDetails.filter((c) => {
			if (!c.degree) return false;
			const v = c.degree.idDegree != null ? String(c.degree.idDegree) : c.degree.name;
			return v === selectedDegree;
		});
	}, [classesWithDetails, selectedDegree]);

	// Grouper par année scolaire
	const schoolYearKey = (d: Date) => {
		const y = d.getFullYear();
		const m = d.getMonth();
		return m >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
	};

	const groups = filtered.reduce<Record<string, ClassWithDegree[]>>((acc, c) => {
		const key = schoolYearKey(new Date(c.startDate));
		(acc[key] ||= []).push(c);
		return acc;
	}, {});

	const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

	return (
		<div className="space-y-6">
			{/* Filtre */}
			<div className="flex items-center gap-4 bg-white rounded-xl p-4">
				<Select
					label="Filtrer par diplôme"
					placeholder="Sélectionner un diplôme"
					selectedKeys={[selectedDegree]}
					onSelectionChange={(keys) => {
						const value = Array.from(keys)[0] as string;
						setSelectedDegree(value || 'all');
					}}
					size="sm"
					className="max-w-xs"
				>
					<>
						<SelectItem key="all">Tous les diplômes</SelectItem>
						{degrees.map((d) => (
							<SelectItem key={d.value}>{d.label}</SelectItem>
						))}
					</>
				</Select>
				<span className="text-sm text-gray-500">
					{filtered.length} classe{filtered.length !== 1 ? 's' : ''}
				</span>
			</div>

			{/* Accordions */}
			<Accordion variant="splitted" className="px-0">
				{years.map((year) => (
					<AccordionItem
						key={year}
						aria-label={`Année ${year}`}
						title={
							<div className="cursor-pointer flex items-center justify-between">
								<span className="text-lg font-semibold text-gray-900">Année {year}</span>
								<span className="text-sm text-gray-500 font-normal">
									{groups[year].length} classe{groups[year].length > 1 ? 's' : ''}
								</span>
							</div>
						}
						className="bg-white shadow-none transition-shadow rounded-xl border border-gray-200"
					>
						<div className="space-y-2 pb-3 bg-white">
							{groups[year]
								.slice()
								.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
								.map((classe) => (
									<ClassCardClient key={classe.idClass} classe={classe} degree={classe.degree} studentsCount={classe.studentsCount} />
								))}
						</div>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default ClassesWrapper;
