import { Exam } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const createExam = async (body: { title: string; desc: string; time: number; imagePath?: string; idTeacher: number }) => {
	return (await fetchApi('/api/exams', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Exam>;
};
