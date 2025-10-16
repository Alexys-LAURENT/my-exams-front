import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const putTeacherToClass = async (idClass: number, idTeacher: number) => {
	return (await fetchApi(`/api/classes/${idClass}/teachers/${idTeacher}`, {
		method: 'PUT',
	})) as ApiError | SuccessMessageResponse;
};
