'use client';
import Link from 'next/link';
import { AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { ClassWithDegree } from '@/app/(protectedPages)/teacher/dashboard/page';
import formatDate from '@/utils/formatDateWithShortMonth';

const BlockClass = ({ classesWithDegrees }: { classesWithDegrees: ClassWithDegree[] }) => {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
			<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
				<div className="flex items-center justify-between text-white">
					<div>
						<h2 className="text-2xl font-bold mb-1">Mes Classes</h2>
						<p className="text-indigo-100 text-sm">Les 5 dernières classes</p>
					</div>
					<AcademicCapIcon className="w-12 h-12 opacity-80" />
				</div>
			</div>
			<div className="flex-1 p-6">
				{classesWithDegrees.length === 0 ? (
					<div className="text-center py-8">
						<AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500">Aucune classe</p>
					</div>
				) : (
					<div className="space-y-3">
						{classesWithDegrees.map((classe, index) => (
							<Link
								key={classe.idClass}
								href={`/teacher/classes/${classe.idClass}`}
								className="block bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-300 group"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<p className="text-gray-900 font-medium group-hover:text-indigo-700 transition-colors">{classe.degree ? classe.degree.name : `Classe ${index + 1}`}</p>
										<p className="text-xs text-gray-500 mt-1">
											Du {formatDate(classe.startDate)}, jusqu&apos;au {formatDate(classe.endDate)}
										</p>
									</div>
									<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
			<div className="p-6 pt-0">
				<Link
					href="/teacher/classes"
					className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center shadow-md hover:shadow-lg"
				>
					Voir toutes les classes
				</Link>
			</div>
		</div>
	);
};

export default BlockClass;
