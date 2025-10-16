import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const putStudentToClass = async (idClass: number, idStudent: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idStudent}`, {
		method: 'PUT',
	})) as ApiError | SuccessMessageResponse;
};
