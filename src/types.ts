// 1. Full User profile payload returned from /users and /users/{username}
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name?: string | null;
    public_repos?: number;
    followers?: number;
    following?: number;
    bio?: string | null;
}

// 2. Follower payload returned from /users/{username}/followers
export interface GitHubFollower {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

// 3. Repository payload returned from /users/{username}/repos
export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
}


// Using Generic Type for API Results
export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };
