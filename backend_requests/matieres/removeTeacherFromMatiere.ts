import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const removeTeacherFromMatiere = async (idMatiere: number, idTeacher: number) => {
	return (await fetchApi(`/api/matieres/${idMatiere}/teachers/${idTeacher}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
