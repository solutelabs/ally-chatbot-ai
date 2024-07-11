export interface ApiResponseType {
    success: boolean;
    message: string;
    data?: any;
}

export const ApiResponse = (success: boolean, message: string, data?: any) => {
    return {
        success,
        message,
        data,
    }
}