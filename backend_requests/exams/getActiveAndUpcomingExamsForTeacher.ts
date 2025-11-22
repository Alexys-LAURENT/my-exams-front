import { Exam, ExamClass } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export type ExamWithClassDates = Exam & {
	examClasses: ExamClass[];
};

export const getActiveAndUpcomingExamsForTeacher = async (idTeacher: number, limit?: number) => {
	const queryParams = limit ? `?limit=${limit}` : '';
	return (await fetchApi(`/api/teachers/${idTeacher}/exams/active${queryParams}`)) as ApiError | SuccessResponse<ExamClass[]>;
};
