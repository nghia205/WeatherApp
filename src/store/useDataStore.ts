import { create } from 'zustand';
import {
  CreateJobPayload,
  CreatePersonPayload,
  dataService,
  UpdateJobPayload,
  UpdatePersonPayload,
} from '../services/dataService';
import { FORBIDDEN_ERROR_MESSAGE, isForbiddenError } from '../utils/apiError';

export interface Job {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  [key: string]: any;
}

export interface Person {
  id: string | number;
  name?: string;
  full_name?: string;
  email?: string;
  age?: string | number;
  job?: Job;
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
  isFetchingMore: boolean;
  isCreatingJob: boolean;
  isCreatingPerson: boolean;
  isDeletingJob: boolean;
  isDeletingPerson: boolean;
  error: string | null;
  peopleError: string | null;
  jobsError: string | null;
  createError: string | null;
  loadMoreError: string | null;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchName: (name: string) => void;
  setSelectedJobId: (id: string | undefined) => void;
  fetchJobs: () => Promise<void>;
  fetchPeople: () => Promise<void>;
  fetchMorePeople: () => Promise<void>;
  createJob: (payload: CreateJobPayload) => Promise<Job>;
  createPerson: (payload: CreatePersonPayload) => Promise<Person>;
  updateJob: (id: string | number, payload: UpdateJobPayload) => Promise<Job>;
  updatePerson: (
    id: string | number,
    payload: UpdatePersonPayload,
  ) => Promise<Person>;
  deleteJob: (id: string | number) => Promise<void>;
  deletePerson: (id: string | number) => Promise<void>;
  uploadJobImage: (formData: FormData) => Promise<string>;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isForbiddenError(error)) return FORBIDDEN_ERROR_MESSAGE;

  return error instanceof Error ? error.message : fallback;
};

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
  isFetchingMore: false,
  isCreatingJob: false,
  isCreatingPerson: false,
  isDeletingJob: false,
  isDeletingPerson: false,
  error: null,
  peopleError: null,
  jobsError: null,
  createError: null,
  loadMoreError: null,

  setPage: page => {
    set({ page });
    get().fetchPeople();
  },
  setLimit: limit => {
    set({ limit, page: 1 });
    get().fetchPeople();
  },
  setSearchName: searchName => {
    set({ searchName, page: 1 });
    get().fetchPeople();
  },
  setSelectedJobId: selectedJobId => {
    set({ selectedJobId, page: 1 });
    get().fetchPeople();
  },

  fetchJobs: async () => {
    set({ isLoadingJobs: true, jobsError: null });

    try {
      const resp = await dataService.fetchJobs();
      set({ jobs: resp.data, isLoadingJobs: false });
    } catch (error) {
      set({
        jobsError: getErrorMessage(error, 'Unable to load jobs'),
        isLoadingJobs: false,
      });
    }
  },

  fetchPeople: async () => {
    set({
      isLoadingPeople: true,
      peopleError: null,
      loadMoreError: null,
      page: 1,
    });

    const { limit, selectedJobId, searchName } = get();

    try {
      const resp = await dataService.fetchPeople(
        1,
        limit,
        selectedJobId,
        searchName,
      );

      set({
        people: resp.data,
        totalCount: resp.meta?.filter_count || 0,
        isLoadingPeople: false,
      });
    } catch (error) {
      set({
        peopleError: getErrorMessage(error, 'Unable to load people'),
        isLoadingPeople: false,
      });
    }
  },

  fetchMorePeople: async () => {
    const {
      page,
      limit,
      selectedJobId,
      searchName,
      people,
      totalCount,
      isFetchingMore,
    } = get();

    if (isFetchingMore || people.length >= totalCount) return;

    set({ isFetchingMore: true, loadMoreError: null });
    const nextPage = page + 1;

    try {
      const resp = await dataService.fetchPeople(
        nextPage,
        limit,
        selectedJobId,
        searchName,
      );

      set({
        people: [...people, ...resp.data],
        page: nextPage,
        totalCount: resp.meta?.filter_count || 0,
        isFetchingMore: false,
      });
    } catch (error) {
      set({
        loadMoreError: getErrorMessage(error, 'Unable to load more people'),
        isFetchingMore: false,
      });
    }
  },

  uploadJobImage: async formData => {
    try {
      const resp = await dataService.uploadFile(formData);
      return resp.data.id;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to upload job image'));
    }
  },

  createJob: async payload => {
    set({ isCreatingJob: true, createError: null });

    try {
      const resp = await dataService.createJob(payload);
      const createdJob = resp.data as Job;

      set(state => ({
        jobs: [createdJob, ...state.jobs],
        isCreatingJob: false,
      }));

      return createdJob;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create job');

      set({
        createError: message,
        isCreatingJob: false,
      });

      throw new Error(message);
    }
  },

  updateJob: async (id, payload) => {
    set({ isCreatingJob: true, createError: null });

    try {
      const resp = await dataService.updateJob(id, payload);
      const updatedJob = resp.data as Job;

      set(state => ({
        jobs: state.jobs.map(job => (job.id === id ? updatedJob : job)),
        people: state.people.map(person =>
          person.job?.id === id ? { ...person, job: updatedJob } : person,
        ),
        isCreatingJob: false,
      }));

      return updatedJob;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to update job');

      set({
        createError: message,
        isCreatingJob: false,
      });

      throw new Error(message);
    }
  },

  createPerson: async payload => {
    set({ isCreatingPerson: true, createError: null });

    try {
      const resp = await dataService.createPerson(payload);
      const createdPerson = resp.data as Person;

      set({
        isCreatingPerson: false,
      });

      await get().fetchPeople();

      return createdPerson;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create person');

      set({
        createError: message,
        isCreatingPerson: false,
      });

      throw new Error(message);
    }
  },

  updatePerson: async (id, payload) => {
    set({ isCreatingPerson: true, createError: null });

    try {
      await dataService.updatePerson(id, payload);

      set({
        isCreatingPerson: false,
      });

      await get().fetchPeople();

      const updatedPerson = get().people.find(person => person.id === id);

      return (updatedPerson || { id, ...payload }) as Person;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to update person');

      set({
        createError: message,
        isCreatingPerson: false,
      });

      throw new Error(message);
    }
  },

  deleteJob: async id => {
    set({ isDeletingJob: true, createError: null });

    try {
      await dataService.deleteJob(id);

      set(state => ({
        jobs: state.jobs.filter(job => job.id !== id),
        people: state.people.map(person =>
          person.job?.id === id ? { ...person, job: undefined } : person,
        ),
        isDeletingJob: false,
      }));

      await get().fetchPeople();
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to delete job');

      set({
        createError: message,
        isDeletingJob: false,
      });

      throw new Error(message);
    }
  },

  deletePerson: async id => {
    set({ isDeletingPerson: true, createError: null });

    try {
      await dataService.deletePerson(id);

      set(state => ({
        people: state.people.filter(person => person.id !== id),
        totalCount: Math.max(0, state.totalCount - 1),
        isDeletingPerson: false,
      }));
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to delete person');

      set({
        createError: message,
        isDeletingPerson: false,
      });

      throw new Error(message);
    }
  },
}));
