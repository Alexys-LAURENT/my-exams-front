import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteExamFromClass = async (idClass: number, idExam: number) => {
	return (await fetchApi(`/api/classes/${idClass}/exams/${idExam}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
