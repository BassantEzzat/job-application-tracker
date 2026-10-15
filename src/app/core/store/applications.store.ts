import { Injectable, computed, inject, signal } from '@angular/core';
import {
  ApplicationStatus,
  JobApplication,
  NewJobApplication,
} from '../models/application.model';
import { StorageService } from '../services/storage.service';

export const STORAGE_KEY = 'job-tracker:applications';

@Injectable({ providedIn: 'root' })
export class ApplicationsStore {
  private readonly storage = inject(StorageService);

  private readonly _applications = signal<JobApplication[]>(
    this.storage.get<JobApplication[]>(STORAGE_KEY, []),
  );

  readonly applications = this._applications.asReadonly();

  readonly total = computed(() => this._applications().length);

  readonly countByStatus = computed(() => {
    const counts: Record<ApplicationStatus, number> = {
      wishlist: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    for (const app of this._applications()) {
      counts[app.status]++;
    }
    return counts;
  });

  getById(id: string): JobApplication | undefined {
    return this._applications().find((a) => a.id === id);
  }

  add(data: NewJobApplication): JobApplication {
    const now = new Date().toISOString();
    const application: JobApplication = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.commit([application, ...this._applications()]);
    return application;
  }

  update(id: string, changes: Partial<NewJobApplication>): void {
    const now = new Date().toISOString();
    this.commit(
      this._applications().map((a) =>
        a.id === id ? { ...a, ...changes, updatedAt: now } : a,
      ),
    );
  }

  remove(id: string): void {
    this.commit(this._applications().filter((a) => a.id !== id));
  }

  private commit(next: JobApplication[]): void {
    this._applications.set(next);
    this.storage.set(STORAGE_KEY, next);
  }
}