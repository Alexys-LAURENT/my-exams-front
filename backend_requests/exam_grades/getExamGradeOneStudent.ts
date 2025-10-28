import { ExamGrade } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamGradeOneStudent = async (idStudent: number, idClass: number, idExam: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idStudent}/exams/${idExam}/exam_grades`)) as ApiError | SuccessResponse<ExamGrade>;
};
