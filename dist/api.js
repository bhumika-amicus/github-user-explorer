export class ApiService {
    constructor(baseUrl = 'https://api.github.com') {
        this.baseUrl = baseUrl;
    }
    async request(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                console.error(`HTTP error: ${response.status}`);
                return { success: false, error: 'Unable to complete the request. Please try again.' };
            }
            const data = await response.json();
            return { success: true, data };
        }
        catch (err) {
            console.error('Network error:', err);
            return { success: false, error: 'Unable to connect to the server. Please check your connection and try again.'
            };
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
    async searchRepositories(query, page = 1, perPage = 10) {
        const endpoint = `/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
        return this.request(endpoint);
    }
}
export const apiService = new ApiService();
