const BASE_URL = 'https://api.github.com';

export async function fetchUsers() {
    const response = await fetch(`${BASE_URL}/users`);

    if (!response.ok) {
        throw new Error(`Failed to fetch users (Status: ${response.status})`);
    }

    return await response.json();
}

export async function fetchUserProfile(username) {
    const response = await fetch(`${BASE_URL}/users/${username}`);
    if (!response.ok) throw new Error(`User profile not found (${response.status})`);
    return await response.json();
}

export async function fetchUserFollowers(username) {
    const response = await fetch(`${BASE_URL}/users/${username}/followers?per_page=5`);
    if (!response.ok) throw new Error(`Could not fetch followers (${response.status})`);
    return await response.json();
}

export async function fetchUserRepos(username) {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?per_page=5`);
    if (!response.ok) throw new Error(`Could not fetch repositories (${response.status})`);
    return await response.json();
}