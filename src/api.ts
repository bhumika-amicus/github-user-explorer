import { GitHubUser, GitHubFollower, GitHubRepo } from './types.js';

const BASE_URL = 'https://api.github.com';


//generic helper function export async function httpGet<T>(url: string): Promise<T> {
export async function httpGet<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
}

//using helper to fetch
export async function fetchUsers(): Promise<GitHubUser[]> {
    return await httpGet<GitHubUser[]>(`${BASE_URL}/users`);
}

export async function fetchUserProfile(username: string): Promise<GitHubUser> {
    return await httpGet<GitHubUser>(`${BASE_URL}/users/${username}`);
}

export async function fetchUserFollowers(username: string): Promise<GitHubFollower[]> {
    return await httpGet<GitHubFollower[]>(`${BASE_URL}/users/${username}/followers?per_page=5`);
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
    return await httpGet<GitHubRepo[]>(`${BASE_URL}/users/${username}/repos?per_page=5`);
}