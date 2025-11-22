import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const addTeacherToMatiere = async (idMatiere: number, idTeacher: number) => {
	return (await fetchApi(`/api/matieres/${idMatiere}/teachers/${idTeacher}`, {
		method: 'PUT',
	})) as ApiError | SuccessMessageResponse;
};
