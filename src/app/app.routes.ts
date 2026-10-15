import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard | Job Tracker',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'applications',
    title: 'Applications | Job Tracker',
    loadComponent: () =>
      import('./features/applications/applications-list/applications-list').then(
        (m) => m.ApplicationsList,
      ),
  },
  {
    path: 'applications/new',
    title: 'New Application | Job Tracker',
    loadComponent: () =>
      import('./features/applications/application-form/application-form').then(
        (m) => m.ApplicationForm,
      ),
  },
  {
    path: 'applications/:id/edit',
    title: 'Edit Application | Job Tracker',
    loadComponent: () =>
      import('./features/applications/application-form/application-form').then(
        (m) => m.ApplicationForm,
      ),
  },
  {
    path: '**',
    title: 'Not Found | Job Tracker',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];