const BASE_URL = 'https://api.github.com';
export async function safeHttpGet(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { success: false, error: `HTTP error! Status: ${response.status}` };
        }
        const data = await response.json();
        return { success: true, data };
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected network error occurred';
        return { success: false, error: errorMessage };
    }
}
//using helper to fetch
export async function fetchUsers() {
    return await safeHttpGet(`${BASE_URL}/users`);
}
export async function fetchUserProfile(username) {
    return await safeHttpGet(`${BASE_URL}/users/${username}`);
}
export async function fetchUserFollowers(username) {
    return await safeHttpGet(`${BASE_URL}/users/${username}/followers?per_page=5`);
}
export async function fetchUserRepos(username) {
    return await safeHttpGet(`${BASE_URL}/users/${username}/repos?per_page=5`);
}
