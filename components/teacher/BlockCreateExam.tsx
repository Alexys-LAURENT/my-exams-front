'use client';
import Link from 'next/link';
import { PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const BlockCreateExam = () => {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
			<div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
				<div className="flex items-center justify-between text-white">
					<div>
						<h2 className="text-2xl font-bold mb-1">Nouvel Examen</h2>
						<p className="text-green-100 text-sm">Créez un examen</p>
					</div>
					<PlusCircleIcon className="w-12 h-12 opacity-80" />
				</div>
			</div>
			<div className="flex-1 flex flex-col items-center justify-center p-6">
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
						<DocumentTextIcon className="w-10 h-10 text-green-600" />
					</div>
					<p className="text-gray-600">Créez un nouvel examen pour vos étudiants</p>
				</div>
				<Link
					href="/teacher/exam/create"
					className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-md hover:shadow-lg transform hover:scale-105"
				>
					<PlusCircleIcon className="w-6 h-6 mr-2" />
					Créer un examen
				</Link>
			</div>
		</div>
	);
};

export default BlockCreateExam;
