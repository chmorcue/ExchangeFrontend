import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'conversion',
  },
  {
    path: 'conversion',
    loadComponent: () =>
      import('./features/conversion/conversion.page').then((m) => m.ConversionPage),
    title: 'Conversión | Exchange',
  },
  {
    path: 'tipos-cambio',
    loadComponent: () =>
      import('./features/tipos-cambio/tipos-cambio.page').then((m) => m.TiposCambioPage),
    title: 'Tipos de cambio | Exchange',
  },
  {
    path: '**',
    redirectTo: 'conversion',
  },
];
