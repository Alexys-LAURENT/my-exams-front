import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteTeacher = async (idTeacher: number) => {
	return (await fetchApi(`/api/teachers/${idTeacher}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
