'use client';

import { Input } from '@heroui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const SearchFilter = ({ placeholder = 'Rechercher...' }: { placeholder?: string }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());
			if (searchValue) {
				params.set('search', searchValue);
			} else {
				params.delete('search');
			}
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		}, 500); // Debounce de 500ms

		return () => clearTimeout(timeoutId);
	}, [searchValue, pathname, router, searchParams]);

	return (
		<Input
			placeholder={placeholder}
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
	);
};
