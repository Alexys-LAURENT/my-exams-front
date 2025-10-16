import { ExamGrade } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamGradeOneStudent = async (idStudent: number, idExam: number) => {
	return (await fetchApi(`/api/exam_grades/students/${idStudent}/exams/${idExam}`)) as ApiError | SuccessResponse<ExamGrade>;
};
