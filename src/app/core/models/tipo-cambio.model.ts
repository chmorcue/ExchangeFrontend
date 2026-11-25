export interface TipoCambio {
  id: number;
  monedaOrigen: string;
  monedaDestino: string;
  cambio: number;
  fechaCreacion: string;
  fechaActualiza?: string | null;
}

export interface CrearTipoCambioRequest {
  monedaOrigen: string;
  monedaDestino: string;
  cambio: number;
}

export interface ActualizarTipoCambioRequest {
  cambio: number;
}
