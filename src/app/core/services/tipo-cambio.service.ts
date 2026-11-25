import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ActualizarTipoCambioRequest,
  CrearTipoCambioRequest,
  TipoCambio,
} from '../models/tipo-cambio.model';

@Injectable({ providedIn: 'root' })
export class TipoCambioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/TipoCambio`;

  getAll(): Observable<TipoCambio[]> {
    return this.http.get<TipoCambio[]>(this.baseUrl);
  }

  getById(id: number): Observable<TipoCambio> {
    return this.http.get<TipoCambio>(`${this.baseUrl}/${id}`);
  }

  create(request: CrearTipoCambioRequest): Observable<TipoCambio> {
    return this.http.post<TipoCambio>(this.baseUrl, request);
  }

  update(id: number, request: ActualizarTipoCambioRequest): Observable<TipoCambio> {
    return this.http.put<TipoCambio>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
