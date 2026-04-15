import { apiMain } from './api';

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
        filter: JSON.stringify(filterObj),
        meta: 'filter_count',
      },
    });
    return response.data;
  },
};
