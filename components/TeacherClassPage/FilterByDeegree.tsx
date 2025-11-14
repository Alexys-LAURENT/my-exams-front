'use client';
import { useEffect, useMemo, useState } from 'react';
import { ClassWithDegree } from '@/app/(protectedPages)/teacher/classes/page';
import { usePathname, useRouter, useSearchParams } from 'next/dist/client/components/navigation';
import AccordionComp from './AccordionComp';

const FilterByDeegree = ({ classesWithDetails }: { classesWithDetails: ClassWithDegree[] }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

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

	const initial = searchParams.get('degree') ?? 'all';
	const [degree, setDegree] = useState(initial);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		if (degree === 'all') params.delete('degree');
		else params.set('degree', degree);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [degree]);

	const filtered = useMemo(() => {
		if (degree === 'all') return classesWithDetails;
		return classesWithDetails.filter((c) => {
			if (!c.degree) return false;
			const v = c.degree.idDegree != null ? String(c.degree.idDegree) : c.degree.name;
			return v === degree;
		});
	}, [classesWithDetails, degree]);

	return (
		<div>
			<div className="flex items-center gap-3">
				<label htmlFor="degree" className="text-sm text-gray-600">
					Filtrer par diplôme :
				</label>
				<select id="degree" className="border rounded-md px-3 py-2 text-sm" value={degree} onChange={(e) => setDegree(e.target.value)}>
					<option value="all">Tous les diplômes</option>
					{degrees.map((d) => (
						<option key={d.value} value={d.value}>
							{d.label}
						</option>
					))}
				</select>
				<span className="text-xs text-gray-500">
					{filtered.length} classe{filtered.length !== 1 ? 's' : ''}
				</span>
			</div>
			<AccordionComp classesWithDetails={filtered} />
		</div>
	);
};

export default FilterByDeegree;
