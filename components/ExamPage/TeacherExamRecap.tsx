import { getOneStudent } from '@/backend_requests/students/getOneStudent';
import { ExamClass, ExamRecap } from '@/types/entitties';
import TeacherExamRecapClient from './TeacherExamRecapClient';

interface TeacherExamRecapProps {
	examData: ExamRecap & { isExamTimeFinished: true };
	idStudent: number;
	examClass: ExamClass;
	canDoCorrection?: boolean;
}

const TeacherExamRecap = async ({ examData, idStudent, examClass, canDoCorrection = true }: TeacherExamRecapProps) => {
	const student = await getOneStudent(idStudent);

	if ('error' in student) {
		throw new Error('Error fetching student data');
	}

	return <TeacherExamRecapClient examData={examData} student={{ name: student.data.name, lastName: student.data.lastName }} examClass={examClass} canDoCorrection={canDoCorrection} />;
};

export default TeacherExamRecap;
