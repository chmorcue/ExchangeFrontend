export interface ApiValidationError {
  property: string;
  error: string;
}

export interface ApiErrorResponse {
  success: boolean;
  data: unknown;
  message: string;
  errors?: ApiValidationError[] | null;
}
