import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteStudentFromClass = async (idClass: number, idStudent: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idStudent}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
