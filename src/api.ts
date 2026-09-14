import { GitHubUser, GitHubFollower, GitHubRepo, ApiResult } from './types.js';

export class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = 'https://api.github.com') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string): Promise<ApiResult<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                return { success: false, error: `HTTP error! Status: ${response.status}` };
            }
            const data: T = await response.json();
            return { success: true, data };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected network error occurred';
            return { success: false, error: errorMessage };
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
}

export const apiService = new ApiService();