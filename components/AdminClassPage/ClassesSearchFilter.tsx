'use client';

import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ClassesSearchFilterProps {
	schoolYears: string[];
	currentSchoolYear: string;
}

export const ClassesSearchFilter = ({ schoolYears, currentSchoolYear }: ClassesSearchFilterProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
	const [selectedYear, setSelectedYear] = useState<string>(searchParams.get('year') || currentSchoolYear);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());
			if (searchValue) {
				params.set('search', searchValue);
			} else {
				params.delete('search');
			}
			if (selectedYear && selectedYear !== currentSchoolYear) {
				params.set('year', selectedYear);
			} else {
				params.delete('year');
			}
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		}, 500); // Debounce de 500ms

		return () => clearTimeout(timeoutId);
	}, [searchValue, selectedYear, pathname, router, searchParams, currentSchoolYear]);

	return (
		<div className="flex gap-3 items-center">
			<Select label="Année scolaire" placeholder="Sélectionner une année" selectedKeys={[selectedYear]} onChange={(e) => setSelectedYear(e.target.value)} size="sm" className="max-w-xs">
				{schoolYears.map((year) => (
					<SelectItem key={year}>{year}</SelectItem>
				))}
			</Select>
			<Input
				placeholder="Rechercher une classe..."
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				size="sm"
				isClearable
				onClear={() => setSearchValue('')}
				className="max-w-xs"
				startContent={
					<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				}
			/>
		</div>
	);
};
