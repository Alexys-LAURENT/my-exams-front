'use client';

import { Meta } from '@/types/entitties';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
	meta: Meta;
}

export const Pagination = ({ meta }: PaginationProps) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createPageUrl = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		return `${pathname}?${params.toString()}`;
	};

	const { currentPage, lastPage, previousPageUrl, nextPageUrl } = meta;

	// Ne rien afficher si une seule page
	if (lastPage <= 1) return null;

	// Calculer les pages à afficher
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 5; // Nombre maximum de pages visibles

		if (lastPage <= maxVisible) {
			// Afficher toutes les pages si peu nombreuses
			for (let i = 1; i <= lastPage; i++) {
				pages.push(i);
			}
		} else {
			// Toujours afficher la première page
			pages.push(1);

			// Déterminer la plage autour de la page actuelle
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(lastPage - 1, currentPage + 1);

			// Ajouter des ellipses au début si nécessaire
			if (start > 2) {
				pages.push('...');
			}

			// Ajouter les pages du milieu
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			// Ajouter des ellipses à la fin si nécessaire
			if (end < lastPage - 1) {
				pages.push('...');
			}

			// Toujours afficher la dernière page
			pages.push(lastPage);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex items-center gap-2">
			{/* Bouton Précédent */}
			{previousPageUrl ? (
				<Link href={createPageUrl(currentPage - 1)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
					Précédent
				</Link>
			) : (
				<button disabled className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
					Précédent
				</button>
			)}

			{/* Numéros de page */}
			<div className="flex items-center gap-1">
				{pageNumbers.map((page, index) => {
					if (page === '...') {
						return (
							<span key={`ellipsis-${index}`} className="px-3 py-1.5 text-sm text-gray-500">
								...
							</span>
						);
					}

					const pageNumber = page as number;
					const isActive = pageNumber === currentPage;

					return isActive ? (
						<span key={pageNumber} className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-md">
							{pageNumber}
						</span>
					) : (
						<Link
							key={pageNumber}
							href={createPageUrl(pageNumber)}
							className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
						>
							{pageNumber}
						</Link>
					);
				})}
			</div>

			{/* Bouton Suivant */}
			{nextPageUrl ? (
				<Link href={createPageUrl(currentPage + 1)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
					Suivant
				</Link>
			) : (
				<button disabled className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
					Suivant
				</button>
			)}
		</div>
	);
};
