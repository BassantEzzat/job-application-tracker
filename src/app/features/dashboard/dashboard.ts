import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
} from '../../core/models/application.model';
import { ApplicationsStore } from '../../core/store/applications.store';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly store = inject(ApplicationsStore);

  protected readonly total = this.store.total;

  protected readonly cards = computed(() => {
    const counts = this.store.countByStatus();
    return [
      { label: 'Total', value: this.store.total() },
      { label: 'Active', value: counts.applied + counts.interview },
      { label: 'Interviews', value: counts.interview },
      { label: 'Offers', value: counts.offer },
    ];
  });

  protected readonly bars = computed(() => {
    const counts = this.store.countByStatus();
    const total = this.store.total();
    return APPLICATION_STATUSES.map((s) => ({
      value: s.value,
      label: s.label,
      count: counts[s.value],
      percent: total ? Math.round((counts[s.value] / total) * 100) : 0,
    }));
  });

  protected readonly recent = computed(() => this.store.applications().slice(0, 5));

  protected statusLabel(status: ApplicationStatus): string {
    return APPLICATION_STATUSES.find((s) => s.value === status)?.label ?? status;
  }
}