import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
} from '../../../core/models/application.model';
import { ApplicationsStore } from '../../../core/store/applications.store';

@Component({
  selector: 'app-application-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './application-form.html',
  styleUrl: './application-form.scss',
})
export class ApplicationForm {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(ApplicationsStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly id = this.route.snapshot.paramMap.get('id');

  protected readonly isEdit = this.id !== null;
  protected readonly notFound = signal(false);
  protected readonly statuses = APPLICATION_STATUSES;
  protected readonly sources = ['Wuzzuf', 'LinkedIn', 'Referral', 'Company Website', 'Other'];

  protected readonly form = this.fb.nonNullable.group({
    company: ['', [Validators.required, Validators.minLength(2)]],
    position: ['', [Validators.required, Validators.minLength(2)]],
    status: ['applied' as ApplicationStatus, Validators.required],
    location: [''],
    source: [''],
    appliedDate: [new Date().toISOString().slice(0, 10), Validators.required],
    jobUrl: ['', Validators.pattern(/^https?:\/\/\S+$/i)],
    notes: ['', Validators.maxLength(500)],
  });

  constructor() {
    if (this.id) {
      const existing = this.store.getById(this.id);
      if (existing) {
        this.form.patchValue({
          company: existing.company,
          position: existing.position,
          status: existing.status,
          location: existing.location,
          source: existing.source,
          appliedDate: existing.appliedDate,
          jobUrl: existing.jobUrl,
          notes: existing.notes,
        });
      } else {
        this.notFound.set(true);
      }
    }
  }

  protected showError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const data = {
      ...value,
      company: value.company.trim(),
      position: value.position.trim(),
      location: value.location.trim(),
      source: value.source.trim(),
      jobUrl: value.jobUrl.trim(),
      notes: value.notes.trim(),
    };

    if (this.id) {
      this.store.update(this.id, data);
    } else {
      this.store.add(data);
    }
    this.router.navigate(['/applications']);
  }
}