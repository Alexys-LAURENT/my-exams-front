import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const startExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/start`, {
		method: 'POST',
	})) as ApiError | SuccessMessageResponse;
};
