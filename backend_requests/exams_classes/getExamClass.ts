import { ExamClass } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamClass = async (idExam: number, idClass: number) => {
	return (await fetchApi(`/api/exams_classes/exams/${idExam}/classes/${idClass}`)) as ApiError | SuccessResponse<ExamClass>;
};
