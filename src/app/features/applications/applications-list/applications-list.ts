import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
} from '../../../core/models/application.model';
import { ApplicationsStore } from '../../../core/store/applications.store';

type StatusFilter = ApplicationStatus | 'all';

@Component({
  selector: 'app-applications-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.scss',
})
export class ApplicationsList {
  private readonly store = inject(ApplicationsStore);

  protected readonly statuses = APPLICATION_STATUSES;
  protected readonly total = this.store.total;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.store.applications().filter((app) => {
      const matchesStatus = status === 'all' || app.status === status;
      const matchesSearch =
        !term ||
        [app.company, app.position, app.location, app.source].some((value) =>
          value.toLowerCase().includes(term),
        );
      return matchesStatus && matchesSearch;
    });
  });

  protected readonly hasFilters = computed(
    () => this.search().trim() !== '' || this.statusFilter() !== 'all',
  );

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected onStatusChange(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as StatusFilter);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
  }

  protected statusLabel(status: ApplicationStatus): string {
    return this.statuses.find((s) => s.value === status)?.label ?? status;
  }

  protected remove(app: JobApplication): void {
    if (confirm(`Delete "${app.position}" at ${app.company}?`)) {
      this.store.remove(app.id);
    }
  }
}