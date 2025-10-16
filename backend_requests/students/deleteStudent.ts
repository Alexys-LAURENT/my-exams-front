import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteStudent = async (idStudent: number) => {
	return (await fetchApi(`/api/students/${idStudent}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
