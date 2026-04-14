import { create } from 'zustand';
import { dataService } from '../services/dataService';

export interface Job {
  id: string | number;
  [key: string]: any; // Tuỳ field cụ thể mà Directus trả về
}

export interface Person {
  id: string | number;
  full_name: string;
  email: string;
  job?: Job; // Relational data
  [key: string]: any;
}

interface DataState {
  people: Person[];
  jobs: Job[];
  totalCount: number;
  page: number;
  limit: number;
  searchName: string;
  selectedJobId: string | undefined;
  isLoadingPeople: boolean;
  isLoadingJobs: boolean;
  error: string | null;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchName: (name: string) => void;
  setSelectedJobId: (id: string | undefined) => void;
  fetchJobs: () => Promise<void>;
  fetchPeople: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  people: [],
  jobs: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  searchName: '',
  selectedJobId: undefined,
  isLoadingPeople: false,
  isLoadingJobs: false,
  error: null,

  setPage: (page) => {
    set({ page });
    get().fetchPeople();
  },
  setLimit: (limit) => {
    set({ limit, page: 1 }); // reset page when limit changes
    get().fetchPeople();
  },
  setSearchName: (searchName) => {
    set({ searchName, page: 1 });
    get().fetchPeople();
  },
  setSelectedJobId: (selectedJobId) => {
    set({ selectedJobId, page: 1 });
    get().fetchPeople();
  },

  fetchJobs: async () => {
    set({ isLoadingJobs: true, error: null });
    try {
      const resp = await dataService.fetchJobs();
      set({ jobs: resp.data, isLoadingJobs: false });
    } catch (error: any) {
      set({ error: error?.message || 'Có lỗi xảy ra', isLoadingJobs: false });
    }
  },

  fetchPeople: async () => {
    set({ isLoadingPeople: true, error: null });
    const { page, limit, selectedJobId, searchName } = get();
    try {
      const resp = await dataService.fetchPeople(page, limit, selectedJobId, searchName);
      set({ 
        people: resp.data, 
        totalCount: resp.meta?.filter_count || 0,
        isLoadingPeople: false 
      });
    } catch (error: any) {
      set({ error: error?.message || 'Có lỗi xảy ra', isLoadingPeople: false });
    }
  },
}));
