export class ApiService {
    constructor(baseUrl = 'https://api.github.com') {
        this.baseUrl = baseUrl;
    }
    async request(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
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
    async getUsers(since) {
        const endpoint = since !== undefined
            ? `/users?per_page=9&since=${since}`
            : '/users?per_page=9';
        return this.request(endpoint);
    }
    async getUserProfile(username) {
        return this.request(`/users/${username}`);
    }
    async getUserFollowers(username) {
        return this.request(`/users/${username}/followers?per_page=5`);
    }
    async getUserRepos(username) {
        return this.request(`/users/${username}/repos?per_page=5`);
    }
}
export const apiService = new ApiService();
