import type { GitHubUser, GitHubFollower, GitHubRepo, ApiResult , GitHubRepositorySearchResponse } from './types.js';

export class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = 'https://api.github.com') {
        this.baseUrl = baseUrl;
    }


    private async request<T>(endpoint: string): Promise<ApiResult<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);

            if (!response.ok) {
                console.error(`HTTP error: ${response.status}`);
                return { success: false, error: 'Unable to complete the request. Please try again.' };
            }

            const data: T = await response.json();
            return { success: true, data };

        } catch (err) {
            console.error('Network error:', err);
            return { success: false, error: 'Unable to connect to the server. Please check your connection and try again.'
            };
        }
    }

    public async getUsers(since?: number): Promise<ApiResult<GitHubUser[]>> {
        const endpoint = since !== undefined
            ? `/users?per_page=9&since=${since}`
            : '/users?per_page=9';

        return this.request<GitHubUser[]>(endpoint);
    }

    public async getUserProfile(username: string): Promise<ApiResult<GitHubUser>> {
        return this.request<GitHubUser>(`/users/${username}`);
    }

    public async getUserFollowers(username: string): Promise<ApiResult<GitHubFollower[]>> {
        return this.request<GitHubFollower[]>(`/users/${username}/followers?per_page=5`);
    }

    public async getUserRepos(username: string): Promise<ApiResult<GitHubRepo[]>> {
        return this.request<GitHubRepo[]>(`/users/${username}/repos?per_page=5`);
    }

    public async searchRepositories( query: string, page: number = 1, perPage: number = 10):
     Promise<ApiResult<GitHubRepositorySearchResponse>> 
    {
        const endpoint =
        `/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    return this.request<GitHubRepositorySearchResponse>(endpoint);
    }
}

export const apiService = new ApiService();