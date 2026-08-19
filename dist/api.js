const BASE_URL = 'https://api.github.com';
//generic helper function export async function httpGet<T>(url: string): Promise<T> {
export async function httpGet(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
//using helper to fetch
export async function fetchUsers() {
    return await httpGet(`${BASE_URL}/users`);
}
export async function fetchUserProfile(username) {
    return await httpGet(`${BASE_URL}/users/${username}`);
}
export async function fetchUserFollowers(username) {
    return await httpGet(`${BASE_URL}/users/${username}/followers?per_page=5`);
}
export async function fetchUserRepos(username) {
    return await httpGet(`${BASE_URL}/users/${username}/repos?per_page=5`);
}
