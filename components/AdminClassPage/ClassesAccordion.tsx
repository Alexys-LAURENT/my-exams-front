'use client';

import { Class } from '@/types/entitties';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { ClassCard } from './ClassCard';

interface ClassWithDegree extends Class {
	degreeName: string;
}

interface ClassesAccordionProps {
	groupedClasses: [string, ClassWithDegree[]][];
	currentSchoolYear: string;
}

export const ClassesAccordion = ({ groupedClasses, currentSchoolYear }: ClassesAccordionProps) => {
	return (
		<Accordion variant="splitted" defaultExpandedKeys={[currentSchoolYear]} className="px-0">
			{groupedClasses.map(([schoolYear, classes]) => (
				<AccordionItem
					key={schoolYear}
					aria-label={`Année scolaire ${schoolYear}`}
					title={
						<div className="flex items-center gap-3">
							<span className="text-xl font-semibold">Année scolaire {schoolYear}</span>
							<span className="text-sm text-gray-500">
								({classes.length} classe{classes.length > 1 ? 's' : ''})
							</span>
						</div>
					}
					classNames={{ base: 'shadow-none border border-black/10', trigger: 'cursor-pointer' }}
				>
					<div className="flex flex-col gap-4 mb-4">
						{classes.map((classe) => (
							<ClassCard key={classe.idClass} classe={classe} degreeName={classe.degreeName} />
						))}
					</div>
				</AccordionItem>
			))}
		</Accordion>
	);
};
