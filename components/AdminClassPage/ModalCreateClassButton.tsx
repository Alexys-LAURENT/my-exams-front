'use client';
import { getCurrentSchoolYearDates, getNextSchoolYearDates } from '@/constants/schoolYears';
import { useModal } from '@/Context/ModalContext';
import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import React from 'react';
import CreateClassModalContent from '../Modals/CreateClassModalContent';

const ChevronDownIcon = () => {
	return (
		<svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
				fill="currentColor"
			/>
		</svg>
	);
};

const ModalCreateClassButton = () => {
	const { openModal } = useModal();
	const { startDate: currentStartDate, endDate: currentEndDate } = getCurrentSchoolYearDates();
	const { startDate: nextStartDate, endDate: nextEndDate } = getNextSchoolYearDates();

	const [selectedOption, setSelectedOption] = React.useState<'current' | 'next'>('current');
	const [isOpen, setIsOpen] = React.useState(false);

	const labelsMap = {
		current: 'Année scolaire actuelle',
		next: 'Année scolaire suivante',
	};

	const descriptionsMap = {
		current: `Du ${currentStartDate} au ${currentEndDate}`,
		next: `Du ${nextStartDate} au ${nextEndDate}`,
	};

	const handleCreateClass = () => {
		const dates = selectedOption === 'current' ? { start_date: currentStartDate, end_date: currentEndDate } : { start_date: nextStartDate, end_date: nextEndDate };

		openModal({
			modalContent: <CreateClassModalContent start_date={dates.start_date} end_date={dates.end_date} />,
			size: 'md',
		});
	};

	const handleOptionSelect = (option: 'current' | 'next') => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	return (
		<div className="flex gap-2">
			<Button color="primary" onPress={handleCreateClass}>
				Créer une classe - {labelsMap[selectedOption]}
			</Button>
			<Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
				<PopoverTrigger>
					<Button isIconOnly color="primary" variant="flat">
						<ChevronDownIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-2">
					<div className="flex flex-col gap-2 min-w-[280px]">
						<button
							onClick={() => handleOptionSelect('current')}
							className={`text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
								selectedOption === 'current' ? 'bg-blue-50 border-2 border-blue-500' : 'border-2 border-transparent'
							}`}
						>
							<div className="font-semibold text-gray-900">{labelsMap.current}</div>
							<div className="text-sm text-gray-500">{descriptionsMap.current}</div>
						</button>
						<button
							onClick={() => handleOptionSelect('next')}
							className={`text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
								selectedOption === 'next' ? 'bg-blue-50 border-2 border-blue-500' : 'border-2 border-transparent'
							}`}
						>
							<div className="font-semibold text-gray-900">{labelsMap.next}</div>
							<div className="text-sm text-gray-500">{descriptionsMap.next}</div>
						</button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default ModalCreateClassButton;
