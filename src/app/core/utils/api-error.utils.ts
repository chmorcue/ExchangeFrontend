import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api-error.model';

export interface ParsedApiError {
  message: string;
  details: string[];
}

export function parseApiError(err: unknown, fallback = 'Ocurrió un error inesperado.'): ParsedApiError {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as ApiErrorResponse | undefined;
    const details =
      body?.errors?.map((e) => e.error).filter((e): e is string => !!e) ?? [];

    if (body?.message) {
      return { message: body.message, details };
    }

    if (err.status === 0) {
      return {
        message: 'No se pudo conectar con la API.',
        details: ['Verifica que el backend esté ejecutándose en https://localhost:44373.'],
      };
    }

    return { message: fallback, details };
  }

  return { message: fallback, details: [] };
}
