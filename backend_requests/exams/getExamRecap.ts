import { ExamRecap } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamRecap = async (idStudent: number, idClass: number, idExam: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idStudent}/exams/${idExam}/recap`)) as ApiError | SuccessResponse<ExamRecap>;
};
