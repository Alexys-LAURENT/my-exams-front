import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const putExamsForClass = async (
	idClass: number,
	idExam: number,
	body: {
		start_date: string;
		end_date: string;
	}
) => {
	return (await fetchApi(`/api/classes/${idClass}/exams/${idExam}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessMessageResponse;
};
