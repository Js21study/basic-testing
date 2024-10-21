import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockData = { title: 'mock title' };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts/1');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    await throttledGetDataFromApi('/posts/1');

    expect(axios.get).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(mockData);
  });
});
