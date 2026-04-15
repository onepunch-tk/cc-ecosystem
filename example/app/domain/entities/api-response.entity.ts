export type ApiSuccessResponse<T extends unknown> = {
	success: true;
	data: T;
};

export type ApiErrorResponse = {
	success: false;
	error: string;
};

export type ApiResponse<T extends unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
