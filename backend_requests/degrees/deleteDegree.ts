import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteDegree = async (idDegree: number) => {
	return (await fetchApi(`/api/degrees/${idDegree}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
