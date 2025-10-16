import { Meta } from './entitties';

export type ApiError = BasicApiError | ValidationApiError | EntityNotFoundApiError;

export type BasicApiError = {
	error: true;
	message: string;
};

export type ValidationApiError = {
	error: true;
	exists?: false;
	validation: JSON;
};

export type EntityNotFoundApiError = {
	error: true;
	message: string;
	exists: false;
};

export interface SuccessResponse<T> {
	success: true;
	data: T;
}

export interface SuccessMessageResponse {
	success: true;
	message: string;
}

export interface PaginatedResponse<T> {
	success: true;
	data: {
		meta: Meta;
		data: T;
	};
}
