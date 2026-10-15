import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NewJobApplication } from '../../core/models/application.model';
import { ApplicationsStore } from '../../core/store/applications.store';
import { Dashboard } from './dashboard';

const sample = (overrides: Partial<NewJobApplication> = {}): NewJobApplication => ({
  company: 'Acme',
  position: 'Angular Developer',
  status: 'applied',
  location: 'Cairo',
  source: 'Wuzzuf',
  appliedDate: '2026-10-15',
  jobUrl: '',
  notes: '',
  ...overrides,
});

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let el: HTMLElement;

  async function setup(seed: NewJobApplication[] = []) {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([])],
    });
    const store = TestBed.inject(ApplicationsStore);
    seed.forEach((s) => store.add(s));
    fixture = TestBed.createComponent(Dashboard);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  it('shows the empty state when there are no applications', async () => {
    await setup();
    expect(el.querySelector('.empty')).not.toBeNull();
    expect(el.querySelector('.stats')).toBeNull();
  });

  it('shows summary numbers', async () => {
    await setup([
      sample({ status: 'applied' }),
      sample({ status: 'interview' }),
      sample({ status: 'offer' }),
    ]);
    const values = Array.from(el.querySelectorAll('.stat__value')).map((v) =>
      v.textContent?.trim(),
    );
    // Total, Active (applied + interview), Interviews, Offers
    expect(values).toEqual(['3', '2', '1', '1']);
  });

  it('renders a bar for every status', async () => {
    await setup([sample()]);
    expect(el.querySelectorAll('.bars__row').length).toBe(5);
  });

  it('lists at most 5 recent applications', async () => {
    await setup(Array.from({ length: 7 }, (_, i) => sample({ company: `Company ${i}` })));
    expect(el.querySelectorAll('.recent li').length).toBe(5);
  });
});