import { getExamGradeOneStudent } from '@/backend_requests/exam_grades/getExamGradeOneStudent';
import { getExamsByTypeOfStudentInClass } from '@/backend_requests/exams/getExamsByTypeOfStudentInClass';
import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import { getOneMatiere } from '@/backend_requests/matieres/getOneMatiere';
import { getOneTeacher } from '@/backend_requests/teachers/getOneTeacher';
import { DASHBOARD_LIMITS } from '@/constants/dashboardLimits';
import StudentPassedExamsTable from '../StudentPassedExamsTable';

interface LatestExamGradesProps {
	idClass: number;
	idStudent: number;
}

const LatestPassedExams = async ({ idClass, idStudent }: LatestExamGradesProps) => {
	const latestPassedExams = await getExamsByTypeOfStudentInClass(idClass, idStudent, 'completed', { limit: DASHBOARD_LIMITS.LATEST_GRADES });

	if (!('success' in latestPassedExams)) {
		throw new Error('Erreur lors de la récupération des examens terminés');
	}

	const examsWithExamGradeInfosAndTeacherInfos = await Promise.all(
		latestPassedExams.data.map(async (eg) => {
			const examGradeInfosResponse = await getExamGradeOneStudent(idStudent, idClass, eg.idExam);

			if (!('success' in examGradeInfosResponse) && !('exists' in examGradeInfosResponse)) {
				throw new Error("Erreur lors de la récupération des informations de l'examen");
			}
			const teachInfosResponse = await getOneTeacher(eg.idTeacher);

			if (!('success' in teachInfosResponse)) {
				throw new Error("Erreur lors de la récupération des informations de l'enseignant");
			}

			const classAssignment = await getExamClass(eg.idExam, idClass);
			if (!('success' in classAssignment)) {
				throw new Error("Erreur lors de la récupération des informations de l'affectation de l'examen à la classe");
			}

			const SubjectResponse = await getOneMatiere(eg.idMatiere);
			if (!('success' in SubjectResponse)) {
				throw new Error('Erreur lors de la récupération des informations de la matière');
			}

			return {
				...eg,
				examGradeInfo: 'data' in examGradeInfosResponse ? examGradeInfosResponse.data : null,
				teacherInfo: teachInfosResponse.data,
				classAssignment: classAssignment.data,
				subjectInfo: SubjectResponse.data,
			};
		})
	);

	return (
		<div className="w-full bg-white rounded-xl p-4">
			<h2 className="text-xl font-bold text-gray-900 mb-4">Dernières notes</h2>

			<StudentPassedExamsTable exams={examsWithExamGradeInfosAndTeacherInfos} idClass={idClass} idStudent={idStudent} />
		</div>
	);
};

export default LatestPassedExams;
