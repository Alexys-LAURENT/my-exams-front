'use client';

import { Exam, ExamGrade, Matiere } from '@/types/entitties';
import { Chip } from '@heroui/chip';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import Link from 'next/link';

type ExamWithGradeType = Exam & {
	examGrade: ExamGrade | null;
};

interface GradesTableProps {
	idClass: number;
	idStudent: number;
	subjects: Matiere[];
	examsWithGrades: ExamWithGradeType[];
	subjectAverages: {
		idMatiere: number;
		average: number | null;
	}[];
}

const GradesTable = ({ subjects, examsWithGrades, subjectAverages, idClass, idStudent }: GradesTableProps) => {
	// Group exams by subject
	const examsBySubject = subjects.map((subject) => {
		const subjectExams = examsWithGrades.filter((exam) => exam.idMatiere === subject.idMatiere);

		// Sort exams by date
		subjectExams.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

		// Get average from subjectAverages
		const averageData = subjectAverages.find((avg) => avg.idMatiere === subject.idMatiere);
		const average = averageData?.average ?? null;

		return {
			subject,
			exams: subjectExams,
			average,
		};
	});

	// Find max number of exams to determine columns
	const maxExams = Math.max(...examsBySubject.map((item) => item.exams.length), 0);

	const getGradeColor = (note: number) => {
		if (note >= 15) return 'success';
		if (note >= 10) return 'warning';
		return 'danger';
	};

	const columns = [
		{ uid: 'subject', name: 'MATIÈRE' },
		{ uid: 'average', name: 'MOYENNE' },
		...Array.from({ length: maxExams }).map((_, index) => ({
			uid: `note-${index}`,
			name: `NOTE ${index + 1}`,
		})),
	];

	const rows = examsBySubject.map((item) => ({
		id: item.subject.idMatiere,
		subject: item.subject.nom,
		average: item.average,
		exams: item.exams,
	}));

	const renderCell = (item: (typeof rows)[0], columnKey: React.Key) => {
		const key = String(columnKey);

		if (key === 'subject') {
			return <div className="font-medium">{item.subject}</div>;
		}

		if (key === 'average') {
			return item.average !== null ? (
				<span className={`font-bold ${item.average >= 10 ? 'text-green-600' : 'text-red-600'}`}>{item.average.toFixed(2)}/20</span>
			) : (
				<span className="text-gray-400">-</span>
			);
		}

		if (key.startsWith('note-')) {
			const index = parseInt(key.split('-')[1]);
			const exam = item.exams[index];

			if (!exam) return <span className="text-gray-300">-</span>;

			if (exam.examGrade && exam.examGrade.note !== null) {
				return (
					<Link href={`/student/${idClass}/${idStudent}/${exam.idExam}`} title={exam.title}>
						<Chip color={getGradeColor(exam.examGrade.note)} variant="flat" size="sm">
							{exam.examGrade.note}/20
						</Chip>
					</Link>
				);
			}
			return (
				<Link href={`/student/${idClass}/${idStudent}/${exam.idExam}`} title={exam.title}>
					<span className="text-gray-400 text-sm italic" title={exam.title}>
						Non noté
					</span>
				</Link>
			);
		}
		return null;
	};

	return (
		<Table
			radius="none"
			classNames={{
				table: 'table-border',
				wrapper: 'shadow-none p-0',
				thead: '!p-0 remove-second-tr',
				th: '!rounded-none',
				tr: '!rounded-none',
			}}
			aria-label="Tableau des notes par matière"
			isStriped
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.uid} className="">
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={rows}>
				{(item) => (
					<TableRow key={item.id} className="">
						{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
export default GradesTable;
