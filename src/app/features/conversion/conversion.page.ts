import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ConversionService } from '../../core/services/conversion.service';
import { ConversionResponse } from '../../core/models/conversion.model';
import { parseApiError } from '../../core/utils/api-error.utils';

@Component({
  selector: 'app-conversion-page',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './conversion.page.html',
  styleUrl: './conversion.page.scss',
})
export class ConversionPage {
  private readonly fb = inject(FormBuilder);
  private readonly conversionService = inject(ConversionService);

  readonly loading = signal(false);
  readonly result = signal<ConversionResponse | null>(null);
  readonly errorMessage = signal('');
  readonly errorDetails = signal<string[]>([]);

  readonly form = this.fb.nonNullable.group({
    monto: [1, [Validators.required, Validators.min(0.01)]],
    monedaOrigen: ['USD', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
    monedaDestino: ['PEN', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
  });

  submit(): void {
    this.errorMessage.set('');
    this.errorDetails.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const monedaOrigen = raw.monedaOrigen.trim().toUpperCase();
    const monedaDestino = raw.monedaDestino.trim().toUpperCase();

    if (monedaOrigen === monedaDestino) {
      this.errorMessage.set('La moneda origen y destino deben ser diferentes.');
      return;
    }

    this.loading.set(true);
    this.result.set(null);

    this.conversionService
      .convert({
        monto: Number(raw.monto),
        monedaOrigen,
        monedaDestino,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.result.set(response),
        error: (err) => {
          const parsed = parseApiError(err, 'No se pudo realizar la conversión.');
          this.errorMessage.set(parsed.message);
          this.errorDetails.set(parsed.details);
        },
      });
  }

  swapCurrencies(): void {
    const { monedaOrigen, monedaDestino } = this.form.getRawValue();
    this.form.patchValue({
      monedaOrigen: monedaDestino,
      monedaDestino: monedaOrigen,
    });
  }

  hasError(controlName: 'monto' | 'monedaOrigen' | 'monedaDestino', error: string): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.hasError(error);
  }
}
