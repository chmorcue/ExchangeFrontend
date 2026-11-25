import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConversionRequest, ConversionResponse } from '../models/conversion.model';

@Injectable({ providedIn: 'root' })
export class ConversionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Conversion`;

  convert(request: ConversionRequest): Observable<ConversionResponse> {
    return this.http.post<ConversionResponse>(this.baseUrl, request);
  }
}
