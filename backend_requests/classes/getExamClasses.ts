import { ExamClass } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamClasses = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/classes`)) as ApiError | SuccessResponse<ExamClass[]>;
};
