import { apiService } from './api.js';
import { renderRepositories, renderRepositoryPagination, renderRepositoryLoading } from './ui.js';
const searchForm = document.querySelector('#repository-search-form');
const searchInput = document.querySelector('#repository-search');
const validationMessage = document.querySelector('#repository-validation');
const statusMessage = document.querySelector('#repository-status');
const repositoriesContainer = document.querySelector('#repositories-container');
const paginationContainer = document.querySelector('#repository-pagination');
const searchButton = document.querySelector('#repository-search-form button[type="submit"]');
let currentQuery = '';
let currentPage = 1;
let totalRepositories = 0;
const pageSize = 10;
let repositoryStatus = 'idle';
function transformRepositories(repositories) {
    return repositories.map(repository => ({
        name: repository.name,
        description: repository.description,
        ownerLogin: repository.owner.login,
        stars: repository.stargazers_count,
        language: repository.language,
        htmlUrl: repository.html_url
    }));
}
async function loadRepositories(query, page) {
    repositoryStatus = 'loading';
    renderRepositoryLoading();
    try {
        const result = await apiService.searchRepositories(query, page, pageSize);
        if (!result.success) {
            repositoryStatus = 'error';
            if (statusMessage) {
                statusMessage.textContent = `Could not load repositories: ${result.error}`;
            }
            return;
        }
        totalRepositories = result.data.total_count;
        const repositories = transformRepositories(result.data.items);
        // Handle the case where no repositories are found
        if (repositories.length === 0) {
            repositoryStatus = 'empty';
            if (statusMessage) {
                statusMessage.textContent = 'No repositories found.';
            }
            return;
        }
        // If we reach here, it means we have successfully fetched repositories
        repositoryStatus = 'success';
        if (statusMessage) {
            statusMessage.textContent = '';
        }
        renderRepositories(repositories);
        renderRepositoryPagination(page, totalRepositories, pageSize);
    }
    catch (error) {
        repositoryStatus = 'error';
        console.error('Unexpected repository search error:', error);
        if (statusMessage) {
            statusMessage.textContent = 'Something went wrong while loading repositories. Please try again.';
        }
    }
    finally {
        console.log(`Repository request completed with status: ${repositoryStatus}`);
        if (searchButton) {
            searchButton.disabled = false;
        }
    }
}
// Handle form submission for repository search when the user presses Enter or clicks the search button
function handleSearchSubmit(event) {
    event.preventDefault();
    if (!searchInput)
        return;
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
// Add event listener for form submission
if (searchForm) {
    searchForm.addEventListener('submit', handleSearchSubmit);
}
function handlePaginationClick(event) {
    const target = event.target;
    if (!target)
        return;
    const page = target.dataset.page;
    if (!page)
        return;
    const requestedPage = Number(page);
    if (requestedPage < 1)
        return;
    currentPage = requestedPage;
    loadRepositories(currentQuery, currentPage);
}
if (paginationContainer) {
    paginationContainer.addEventListener('click', handlePaginationClick);
}
