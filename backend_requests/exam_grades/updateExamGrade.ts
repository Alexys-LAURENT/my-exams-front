import { ExamGrade } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateExamGrade = async (
	idExamGrade: number,
	data: {
		note: number;
		status: string;
	}
) => {
	return (await fetchApi(`/api/exam_grades/${idExamGrade}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	})) as ApiError | SuccessResponse<ExamGrade>;
};
