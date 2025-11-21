import { Exam } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateExam = async (idExam: number, body: { title?: string; desc?: string; time?: number; idMatiere?: number }) => {
	return (await fetchApi(`/api/exams/${idExam}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Exam>;
};
