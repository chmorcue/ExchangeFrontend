export interface ConversionRequest {
  monto: number;
  monedaOrigen: string;
  monedaDestino: string;
}

export interface ConversionResponse {
  monto: number;
  montoConvertido: number;
  monedaOrigen: string;
  monedaDestino: string;
  tipoCambio: number;
}
