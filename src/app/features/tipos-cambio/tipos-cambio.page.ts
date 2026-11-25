import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TipoCambioService } from '../../core/services/tipo-cambio.service';
import { TipoCambio } from '../../core/models/tipo-cambio.model';
import { parseApiError } from '../../core/utils/api-error.utils';

@Component({
  selector: 'app-tipos-cambio-page',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './tipos-cambio.page.html',
  styleUrl: './tipos-cambio.page.scss',
})
export class TiposCambioPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tipoCambioService = inject(TipoCambioService);

  readonly items = signal<TipoCambio[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deletingId = signal<number | null>(null);
  readonly editingId = signal<number | null>(null);
  readonly loadError = signal('');
  readonly formError = signal('');
  readonly formErrorDetails = signal<string[]>([]);
  readonly successMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    monedaOrigen: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
    monedaDestino: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
    cambio: [0, [Validators.required, Validators.min(0.000001)]],
  });

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.loadError.set('');

    this.tipoCambioService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => this.items.set(items),
        error: (err) => {
          const parsed = parseApiError(err, 'No se pudieron cargar los tipos de cambio.');
          this.loadError.set(parsed.message);
        },
      });
  }

  submit(): void {
    this.formError.set('');
    this.formErrorDetails.set([]);
    this.successMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const monedaOrigen = raw.monedaOrigen.trim().toUpperCase();
    const monedaDestino = raw.monedaDestino.trim().toUpperCase();
    const cambio = Number(raw.cambio);

    if (!this.isEditing() && monedaOrigen === monedaDestino) {
      this.formError.set('La moneda origen y destino deben ser diferentes.');
      return;
    }

    this.saving.set(true);
    const editingId = this.editingId();

    const request$ =
      editingId == null
        ? this.tipoCambioService.create({ monedaOrigen, monedaDestino, cambio })
        : this.tipoCambioService.update(editingId, { cambio });

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.successMessage.set(
          editingId == null ? 'Tipo de cambio creado correctamente.' : 'Tipo de cambio actualizado correctamente.',
        );
        this.cancelEdit();
        this.loadItems();
      },
      error: (err) => {
        const parsed = parseApiError(
          err,
          editingId == null ? 'No se pudo crear el tipo de cambio.' : 'No se pudo actualizar el tipo de cambio.',
        );
        this.formError.set(parsed.message);
        this.formErrorDetails.set(parsed.details);
      },
    });
  }

  startEdit(item: TipoCambio): void {
    this.editingId.set(item.id);
    this.formError.set('');
    this.formErrorDetails.set([]);
    this.successMessage.set('');
    this.form.reset({
      monedaOrigen: item.monedaOrigen,
      monedaDestino: item.monedaDestino,
      cambio: item.cambio,
    });
    this.form.controls.monedaOrigen.disable();
    this.form.controls.monedaDestino.disable();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.controls.monedaOrigen.enable();
    this.form.controls.monedaDestino.enable();
    this.form.reset({ monedaOrigen: '', monedaDestino: '', cambio: 0 });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  remove(item: TipoCambio): void {
    const confirmed = window.confirm(
      `¿Eliminar el tipo de cambio ${item.monedaOrigen}/${item.monedaDestino}?`,
    );
    if (!confirmed) return;

    this.deletingId.set(item.id);
    this.formError.set('');
    this.formErrorDetails.set([]);
    this.successMessage.set('');

    this.tipoCambioService
      .delete(item.id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.successMessage.set('Tipo de cambio eliminado correctamente.');
          if (this.editingId() === item.id) {
            this.cancelEdit();
          }
          this.loadItems();
        },
        error: (err) => {
          const parsed = parseApiError(err, 'No se pudo eliminar el tipo de cambio.');
          this.formError.set(parsed.message);
          this.formErrorDetails.set(parsed.details);
        },
      });
  }

  hasError(controlName: 'monedaOrigen' | 'monedaDestino' | 'cambio', error: string): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.hasError(error);
  }

  isEditing(): boolean {
    return this.editingId() != null;
  }
}
