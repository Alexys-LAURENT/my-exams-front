'use client';
import { stopExam } from '@/backend_requests/exams/stopExam';
import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ButtonFinishExamProps {
	idExam: number;
	idStudent: number;
	idClass: number;
	isExamFinished: boolean;
}

const ButtonFinishExam = ({ idExam, idStudent, idClass, isExamFinished }: ButtonFinishExamProps) => {
	const [isPopOverOpen, setIsPopOverOpen] = useState(false);

	const router = useRouter();

	const handleFinishExam = async () => {
		try {
			await stopExam(idStudent, idClass, idExam);
			router.refresh();
		} catch (error) {
			console.error('Error stopping exam:', error);
		}
	};

	if (isExamFinished) {
		return (
			<Button className="w-full px-4 py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg md:w-fit" onPress={handleFinishExam}>
				Terminer l&apos;examen
			</Button>
		);
	}

	return (
		<Popover
			classNames={{
				base: 'max-w-sm',
			}}
			isOpen={isPopOverOpen}
			placement="bottom"
			onOpenChange={setIsPopOverOpen}
		>
			<PopoverTrigger>
				<Button className="w-full px-4 py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg md:w-fit">Terminer l&apos;examen</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="p-4">
					<p className="mb-2 text-sm text-gray-700">Êtes-vous sûr de vouloir terminer l&apos;examen sans avoir répondu à toutes les questions ?</p>
					<div className="flex gap-2 mt-3">
						<Button size="sm" className="flex-1 px-4 py-2 font-semibold text-white bg-red-500 rounded-lg" onPress={() => setIsPopOverOpen(false)}>
							Non
						</Button>
						<Button
							size="sm"
							className="flex-1 px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg"
							onPress={() => {
								setIsPopOverOpen(false);
								handleFinishExam();
							}}
						>
							Oui
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ButtonFinishExam;
