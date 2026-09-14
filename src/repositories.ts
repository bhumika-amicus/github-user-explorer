import { apiService } from './api.js';
import type { GitHubRepositorySearchResponse, RepositoryDisplay } from './types.js';

const searchForm = document.querySelector<HTMLFormElement>( '#repository-search-form' );

const searchInput = document.querySelector<HTMLInputElement>('#repository-search' );

const validationMessage = document.querySelector<HTMLParagraphElement>( '#repository-validation' );

const statusMessage = document.querySelector<HTMLParagraphElement>(
    '#repository-status'
);

const repositoriesContainer = document.querySelector<HTMLElement>(
    '#repositories-container'
);

const paginationContainer = document.querySelector<HTMLElement>(
    '#repository-pagination'
);


let currentQuery: string = '';
let currentPage: number = 1;
let totalRepositories: number = 0;
const pageSize: number = 10;


function transformRepositories(
    repositories: GitHubRepositorySearchResponse['items'] ): RepositoryDisplay[] {
    return repositories.map(repository => ({
        name: repository.name,
        description: repository.description,
        ownerLogin: repository.owner.login,
        stars: repository.stargazers_count,
        language: repository.language,
        htmlUrl: repository.html_url
    }));
}

function renderRepositories(repositories: RepositoryDisplay[]): void {
    if (!repositoriesContainer) return;

    repositoriesContainer.innerHTML = '';

    for (const repository of repositories) {
        const card = document.createElement('article');

        const name = document.createElement('h2');
        name.textContent = repository.name;

        const description = document.createElement('p');
        description.textContent =
            repository.description ?? 'No description available.';

        const owner = document.createElement('p');
        owner.textContent = `Owner: ${repository.ownerLogin}`;

        const stars = document.createElement('p');
        stars.textContent = `Stars: ${repository.stars}`;

        const language = document.createElement('p');
        language.textContent =
            `Language: ${repository.language ?? 'Not specified'}`;

        const link = document.createElement('a');
        link.textContent = 'View on GitHub';
        link.href = repository.htmlUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(owner);
        card.appendChild(stars);
        card.appendChild(language);
        card.appendChild(link);

        repositoriesContainer.appendChild(card);
    }
}

function renderPagination(): void {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalRepositories / pageSize);

    if (totalPages <= 1) return;

    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.disabled = currentPage === 1;
    previousButton.dataset.page = String(currentPage - 1);

    const pageLabel = document.createElement('span');
    pageLabel.textContent = `Page ${currentPage} of ${totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.dataset.page = String(currentPage + 1);

    paginationContainer.appendChild(previousButton);
    paginationContainer.appendChild(pageLabel);
    paginationContainer.appendChild(nextButton);
}

async function loadRepositories(
    query: string,
    page: number
): Promise<void> {
    showLoading();

    try {
        const result = await apiService.searchRepositories(
            query,
            page,
            pageSize
        );

        if (!result.success) {
            console.error('Repository search failed:', result.error);

            if (statusMessage) {
                statusMessage.textContent =
                    `Could not load repositories: ${result.error}`;
            }

            return;
        }
        totalRepositories = result.data.total_count;
        const repositories = transformRepositories(result.data.items);

        if (repositories.length === 0) {
            if (statusMessage) {
                statusMessage.textContent = 'No repositories found.';
            }

            return;
        }

        if (statusMessage) {
            statusMessage.textContent = '';
        }

        renderRepositories(repositories);
        renderPagination();
    } catch (error) {
        console.error('Unexpected repository search error:', error);

        if (statusMessage) {
            const message = error instanceof Error
                ? error.message
                : 'An unexpected error occurred.';

            statusMessage.textContent =
                `Could not load repositories: ${message}`;
        }
    } finally {
        console.log('Repository request completed.');
    }
}


function handleSearchSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (query === '') {
        if (validationMessage) {
            validationMessage.textContent =
                'Please enter a repository search term.';
        }

        if (statusMessage) {
            statusMessage.textContent = '';
        }

        if (repositoriesContainer) {
            repositoriesContainer.innerHTML = '';
        }

        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        return;
    }

    if (validationMessage) {
        validationMessage.textContent = '';
    }

    currentQuery = query;
    currentPage = 1;

    loadRepositories(currentQuery, currentPage);
}

if (searchForm) {
    searchForm.addEventListener('submit', handleSearchSubmit);
}

function showLoading(): void {
    if (statusMessage) {
        statusMessage.textContent = 'Loading repositories...';
    }

    if (repositoriesContainer) {
        repositoriesContainer.innerHTML = '';
    }

    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
}

function clearLoading(): void {
    if (statusMessage) {
        statusMessage.textContent = '';
    }
}

function handlePaginationClick(event: Event): void {
    const target = event.target as HTMLElement | null;

    if (!target) return;

    const page = target.dataset.page;

    if (!page) return;

    const requestedPage = Number(page);

    if (requestedPage < 1) return;

    currentPage = requestedPage;

    loadRepositories(currentQuery, currentPage);
}

if (paginationContainer) {
    paginationContainer.addEventListener(
        'click',
        handlePaginationClick
    );
}