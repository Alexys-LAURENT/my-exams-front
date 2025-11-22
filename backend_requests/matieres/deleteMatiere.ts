import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteMatiere = async (idMatiere: number) => {
	return (await fetchApi(`/api/matieres/${idMatiere}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
