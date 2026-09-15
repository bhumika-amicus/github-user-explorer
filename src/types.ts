//Full User profile payload returned from /users and /users/{username}
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

// Follower payload derived from GitHubUser using Pick utility type
export type GitHubFollower = Pick<GitHubUser, 'login' | 'id' | 'avatar_url' | 'html_url'>;

//Repository payload returned from /users/{username}/repos
export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
}

//Transformed User for User Card UI display derived using Pick & type intersection
export type TransformedUser = Pick<GitHubUser, 'login' | 'id'> & {
    avatar: string;
};

// Allowed sorting directions for the Users page
export type SortDirection = 'asc' | 'desc';

//Generic Union Type for API Results
export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };



//Repository search item of GitHubRepositorySearchResponse.items
export interface GitHubRepositorySearchItem {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    owner: {
        login: string;
    };
}

//Repository search payload returned from /search/repositories
export interface GitHubRepositorySearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepositorySearchItem[];
}


export interface RepositoryDisplay {
    name: string;
    description: string | null;
    ownerLogin: string;
    stars: number;
    language: string | null;
    htmlUrl: string;
}
// Repository status for the Repositories page
export type RepositoryStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'empty'
    | 'error';