import { apiMain } from './api';

export type CreateJobPayload = {
  title: string;
  description?: string;
  image?: string;
};

export type UpdateJobPayload = Partial<{
  title: string;
  description: string | null;
  image: string | null;
}>;

export type CreatePersonPayload = {
  name: string;
  age?: number;
  email?: string;
  job?: string | number;
};

export type UpdatePersonPayload = Partial<{
  name: string;
  age: number | null;
  email: string | null;
  job: string | number | null;
}>;

export const dataService = {
  fetchJobs: async () => {
    const response = await apiMain.get('/items/job');
    return response.data;
  },
  fetchPeople: async (
    page: number,
    limit: number,
    jobId?: string,
    searchName?: string,
  ) => {
    const filterAnd: any[] = [];

    if (jobId) {
      filterAnd.push({ job: { _eq: jobId } });
    }

    if (searchName) {
      filterAnd.push({ name: { _icontains: searchName } });
    }

    const filterObj = filterAnd.length > 0 ? { _and: filterAnd } : {};

    const response = await apiMain.get('/items/people', {
      params: {
        fields: '*,job.*',
        page,
        limit,
        sort: '-id',
        filter: JSON.stringify(filterObj),
        meta: 'filter_count',
      },
    });
    return response.data;
  },
  uploadFile: async (formData: FormData) => {
    const response = await apiMain.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  createJob: async (payload: CreateJobPayload) => {
    const response = await apiMain.post('/items/job', payload);
    return response.data;
  },
  updateJob: async (id: string | number, payload: UpdateJobPayload) => {
    const response = await apiMain.patch(`/items/job/${id}`, payload);
    return response.data;
  },
  deleteJob: async (id: string | number) => {
    const response = await apiMain.delete(`/items/job/${id}`);
    return response.data;
  },
  createPerson: async (payload: CreatePersonPayload) => {
    const response = await apiMain.post('/items/people', payload);
    return response.data;
  },
  updatePerson: async (id: string | number, payload: UpdatePersonPayload) => {
    const response = await apiMain.patch(`/items/people/${id}`, payload);
    return response.data;
  },
  deletePerson: async (id: string | number) => {
    const response = await apiMain.delete(`/items/people/${id}`);
    return response.data;
  },
};
