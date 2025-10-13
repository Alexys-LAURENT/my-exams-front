import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { auth } from '@/utils/auth';
import { fetchApi } from '@/utils/fetchApi';

export const getStudentClasses = async (idStudent?: number) => {
	let theIdUser: number;
	if (idStudent) {
		theIdUser = idStudent;
	} else {
		const loggedUser = await auth();
		theIdUser = loggedUser!.user.idUser;
	}
	return (await fetchApi(`/api/students/${theIdUser}/classes`)) as ApiError | SuccessResponse<Class[]>;
};
