'use client';
import { Exam, ExamClass, ExamGrade, Matiere, User } from '@/types/entitties';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import Link from 'next/link';
import { useCallback } from 'react';

type ExamsWithExamGradeInfosAndTeacherInfos = Exam & {
	examGradeInfo: ExamGrade | null;
	teacherInfo: User;
	classAssignment: ExamClass;
	subjectInfo: Matiere;
};

interface StudentExamGradesTableProps {
	exams: ExamsWithExamGradeInfosAndTeacherInfos[];
	idClass: number;
	idStudent: number;
}

export const columns = [
	{ name: 'Examen', uid: 'exam.title' },
	{ name: 'Professeur', uid: 'teacher' },
	{ name: 'Matière', uid: 'subject' },
	{ name: 'Affectation', uid: 'assignement' },
	{ name: 'Réalisé le', uid: 'did_at' },
	{ name: 'Corrigé le', uid: 'corrected_at' },
	{ name: 'Note', uid: 'grade' },
	{ name: 'Actions', uid: 'actions' },
];

const StudentPassedExamsTable = ({ exams, idClass, idStudent }: StudentExamGradesTableProps) => {
	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const renderCell = useCallback(
		(exam: ExamsWithExamGradeInfosAndTeacherInfos, columnKey: React.Key) => {
			switch (columnKey) {
				case 'exam.title':
					return exam.title;
				case 'teacher':
					return (
						<div className="flex items-center">
							<Avatar
								size="sm"
								src={exam.teacherInfo.avatarPath}
								alt={`${exam.teacherInfo.name} ${exam.teacherInfo.lastName}`}
								name={`${exam.teacherInfo.name} ${exam.teacherInfo.lastName}`}
								className="mr-2"
							/>
							{exam.teacherInfo.name} {exam.teacherInfo.lastName}
						</div>
					);
				case 'subject':
					return exam.subjectInfo.nom;
				case 'grade':
					if (!exam.examGradeInfo || exam.examGradeInfo.note === null) {
						return (
							<Chip size="sm" variant="flat" color="default">
								Non noté
							</Chip>
						);
					}
					const note = exam.examGradeInfo.note;
					let color: 'success' | 'warning' | 'danger' | 'default' = 'success';
					if ((note as unknown) === '-') color = 'default';
					if (note < 10) color = 'danger';
					else if (note < 14) color = 'warning';
					return (
						<Chip size="sm" variant="flat" color={color}>
							{note}/20
						</Chip>
					);
				case 'assignement':
					return (
						<div className="text-sm">
							<div>Du {formatDateTime(exam.classAssignment.start_date)}</div>
							<div>au {formatDateTime(exam.classAssignment.end_date)}</div>
						</div>
					);
				case 'did_at':
					return exam.examGradeInfo ? formatDateTime(exam.examGradeInfo.createdAt) : <span className="text-gray-400 italic">Non rendu</span>;
				case 'corrected_at':
					return exam.examGradeInfo && exam.examGradeInfo.updatedAt ? formatDateTime(exam.examGradeInfo.updatedAt) : <span className="text-gray-400 italic">Non rendu</span>;
				case 'actions':
					return (
						<Button size="sm" isIconOnly variant="light" as={Link} href={`/student/${idClass}/${idStudent}/${exam.idExam}`} className="text-blue-600 hover:underline">
							<EyeIcon className="inline-block w-5 h-5 " />
						</Button>
					);
				default:
					return '';
			}
		},
		[idClass, idStudent]
	);

	return (
		<Table
			aria-label="Student Exam Grades Table"
			className="w-full"
			classNames={{
				wrapper: 'bg-white rounded-md shadow-none p-0',
			}}
			isStriped
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={exams}>{(item) => <TableRow key={item.idExam}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
		</Table>
	);
};

export default StudentPassedExamsTable;
