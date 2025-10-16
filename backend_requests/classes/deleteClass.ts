import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const deleteClass = async (idClass: number) => {
	return (await fetchApi(`/api/classes/${idClass}`, {
		method: 'DELETE',
	})) as ApiError | SuccessMessageResponse;
};
