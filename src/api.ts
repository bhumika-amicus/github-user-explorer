import { GitHubUser, GitHubFollower, GitHubRepo, ApiResult } from './types.js';

const BASE_URL = 'https://api.github.com';


export async function safeHttpGet<T>(url: string): Promise<ApiResult<T>> {
    try {
        const response = await fetch(url);
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


//using helper to fetch
export async function fetchUsers(): Promise<ApiResult<GitHubUser[]>> {
    return await safeHttpGet<GitHubUser[]>(`${BASE_URL}/users`);
}

export async function fetchUserProfile(username: string): Promise<ApiResult<GitHubUser>> {
    return await safeHttpGet<GitHubUser>(`${BASE_URL}/users/${username}`);
}

export async function fetchUserFollowers(username: string): Promise<ApiResult<GitHubFollower[]>> {
    return await safeHttpGet<GitHubFollower[]>(`${BASE_URL}/users/${username}/followers?per_page=5`);
}

export async function fetchUserRepos(username: string): Promise<ApiResult<GitHubRepo[]>> {
    return await safeHttpGet<GitHubRepo[]>(`${BASE_URL}/users/${username}/repos?per_page=5`);
}