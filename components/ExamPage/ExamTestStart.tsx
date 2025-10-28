'use client';
import { Exam } from '@/types/entitties';
import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { useState } from 'react';

interface ExamTestStartProps {
	exam: Exam;
	isLoading: boolean;
	handleStartExam: () => void;
}

const ExamTestStart = ({ exam, isLoading, handleStartExam }: ExamTestStartProps) => {
	const [isTermsAccepted, setIsTermsAccepted] = useState(false);
	return (
		<div className="flex flex-col items-center flex-1 gap-6 md:justify-center md:p-8 ">
			<div className="space-y-4 text-center">
				<h2 className="text-xl font-bold text-gray-800 md:text-3xl">Prêt à commencer l&apos;examen ?</h2>
				<div className="p-4 space-y-2 text-gray-600 border-2 rounded-lg md:max-w-3xl bg-amber-50 border-amber-300">
					<p className="text-sm md:text-base">
						Assurez-vous d&apos;être dans un <strong>environnement calme et sans distractions.</strong> <br />
						Une fois que vous commencerez, le temps de l&apos;examen sera lancé. <br />
						Vous aurez <strong> {exam.time} minutes </strong> pour le compléter.
					</p>
					<p className="flex items-center justify-center gap-2 text-sm font-bold md:text-base">
						<span className="text-blue-500">⚠️</span>
						Une fois l&apos;examen commencé, vous ne pourrez plus le quitter jusqu&apos;à ce que vous l&apos;ayez terminé. Si vous quittez l&apos;onglet ou la fenêtre, cela sera considéré
						comme une tentative de triche et l&apos;examen sera automatiquement terminé.
						<span className="text-blue-500">⚠️</span>
					</p>
					<div className="flex items-center justify-center gap-2">
						<Checkbox
							classNames={{
								label: 'text-sm text-gray-700 md:text-base',
							}}
							onValueChange={(value) => setIsTermsAccepted(value)}
						>
							J&apos;ai lu et j&apos;accepte les conditions ci-dessus.
						</Checkbox>
					</div>
					<p className="mt-2 italic text-gray-500">Bonne chance !</p>
				</div>
			</div>
			<Button
				isDisabled={!isTermsAccepted || isLoading}
				isLoading={isLoading}
				className="w-full text-lg font-semibold text-white transition-all duration-200 transform rounded-lg md:max-w-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
				onPress={() => handleStartExam()}
			>
				Commencer l&apos;examen
			</Button>
		</div>
	);
};

export default ExamTestStart;
