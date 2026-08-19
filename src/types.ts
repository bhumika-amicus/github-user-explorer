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

//Generic Union Type for API Results
export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };
