import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { JobApplication } from '../../../core/models/application.model';
import { ApplicationsStore, STORAGE_KEY } from '../../../core/store/applications.store';
import { ApplicationForm } from './application-form';

const existing: JobApplication = {
  id: 'abc',
  company: 'Acme',
  position: 'Angular Developer',
  status: 'applied',
  location: 'Cairo',
  source: 'Wuzzuf',
  appliedDate: '2026-10-15',
  jobUrl: '',
  notes: '',
  createdAt: '2026-10-15T00:00:00.000Z',
  updatedAt: '2026-10-15T00:00:00.000Z',
};

describe('ApplicationForm', () => {
  let fixture: ComponentFixture<ApplicationForm>;
  let el: HTMLElement;
  let store: ApplicationsStore;
  let navigate: ReturnType<typeof vi.spyOn>;

  async function setup(options: { id?: string; seed?: JobApplication[] } = {}) {
    localStorage.clear();
    if (options.seed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options.seed));
    }

    TestBed.configureTestingModule({
      imports: [ApplicationForm],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(options.id ? { id: options.id } : {}) },
          },
        },
      ],
    });

    store = TestBed.inject(ApplicationsStore);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(ApplicationForm);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  const input = (id: string) => el.querySelector(`#${id}`) as HTMLInputElement;

  async function type(id: string, value: string) {
    const field = input(id);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function submit() {
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  it('shows validation errors and does not save an empty form', async () => {
    await setup();
    await submit();
    expect(el.querySelectorAll('.error').length).toBeGreaterThan(0);
    expect(store.total()).toBe(0);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('adds an application and navigates to the list', async () => {
    await setup();
    await type('company', 'Globex');
    await type('position', 'Frontend Developer');
    await submit();
    expect(store.total()).toBe(1);
    expect(store.applications()[0].company).toBe('Globex');
    expect(navigate).toHaveBeenCalledWith(['/applications']);
  });

  it('pre-fills the form in edit mode', async () => {
    await setup({ id: 'abc', seed: [existing] });
    expect(input('company').value).toBe('Acme');
    expect(input('position').value).toBe('Angular Developer');
  });

  it('saves changes in edit mode', async () => {
    await setup({ id: 'abc', seed: [existing] });
    await type('company', 'Initech');
    await submit();
    expect(store.getById('abc')?.company).toBe('Initech');
    expect(store.total()).toBe(1);
  });

  it('shows a not-found message for an unknown id', async () => {
    await setup({ id: 'missing' });
    expect(el.querySelector('.empty')).not.toBeNull();
    expect(el.querySelector('form')).toBeNull();
  });
});