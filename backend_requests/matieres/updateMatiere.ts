import { Matiere } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateMatiere = async (idMatiere: number, body: { nom: string }) => {
	return (await fetchApi(`/api/matieres/${idMatiere}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Matiere>;
};
