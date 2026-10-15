import { TestBed } from '@angular/core/testing';
import { NewJobApplication } from '../models/application.model';
import { ApplicationsStore, STORAGE_KEY } from './applications.store';

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

describe('ApplicationsStore', () => {
  let store: ApplicationsStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(ApplicationsStore);
  });

  it('starts empty', () => {
    expect(store.total()).toBe(0);
  });

  it('adds an application with a generated id', () => {
    const created = store.add(sample());
    expect(created.id).toBeTruthy();
    expect(store.total()).toBe(1);
    expect(store.getById(created.id)?.company).toBe('Acme');
  });

  it('persists changes to localStorage', () => {
    store.add(sample());
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toHaveLength(1);
  });

  it('updates an application', () => {
    const created = store.add(sample());
    store.update(created.id, { status: 'interview' });
    expect(store.getById(created.id)?.status).toBe('interview');
  });

  it('removes an application', () => {
    const created = store.add(sample());
    store.remove(created.id);
    expect(store.total()).toBe(0);
  });

  it('counts applications by status', () => {
    store.add(sample({ status: 'applied' }));
    store.add(sample({ status: 'applied' }));
    store.add(sample({ status: 'offer' }));
    expect(store.countByStatus().applied).toBe(2);
    expect(store.countByStatus().offer).toBe(1);
    expect(store.countByStatus().rejected).toBe(0);
  });
});