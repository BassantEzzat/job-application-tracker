import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NewJobApplication } from '../../../core/models/application.model';
import { ApplicationsStore } from '../../../core/store/applications.store';
import { ApplicationsList } from './applications-list';

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

describe('ApplicationsList', () => {
  let fixture: ComponentFixture<ApplicationsList>;
  let el: HTMLElement;

  const rows = () => el.querySelectorAll('tbody tr');

  async function setup(seed: NewJobApplication[] = []) {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [ApplicationsList],
      providers: [provideRouter([])],
    });
    const store = TestBed.inject(ApplicationsStore);
    seed.forEach((s) => store.add(s));
    fixture = TestBed.createComponent(ApplicationsList);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  it('shows the empty state when there are no applications', async () => {
    await setup();
    expect(el.querySelector('.empty')).not.toBeNull();
    expect(rows().length).toBe(0);
  });

  it('renders a row per application', async () => {
    await setup([sample(), sample({ company: 'Globex' })]);
    expect(rows().length).toBe(2);
  });

  it('filters by search term', async () => {
    await setup([sample(), sample({ company: 'Globex' })]);
    const input = el.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'globex';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Globex');
  });

  it('filters by status', async () => {
    await setup([sample(), sample({ status: 'offer' })]);
    const select = el.querySelector('select') as HTMLSelectElement;
    select.value = 'offer';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(rows().length).toBe(1);
  });

  it('deletes an application after confirmation', async () => {
    await setup([sample()]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    (el.querySelector('.delete-btn') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(el.querySelector('.empty')).not.toBeNull();
  });
});