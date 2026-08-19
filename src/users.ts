import { apiService } from './api.js';
import { renderUsers, renderStatus, renderUserCount, renderPagination, renderSkeletons } from './ui.js';
import { GitHubUser, TransformedUser } from './types.js';

let allUsers: TransformedUser[] = [];
let displayedUsers: TransformedUser[] = [];
let currentPage: number = 1;
const pageSize: number = 9;

export function transformUsers(rawUsers: GitHubUser[]): TransformedUser[] {
    return rawUsers.map(({ login, id, avatar_url }) => ({
        login,
        id,
        avatar: avatar_url
    }));
}

function updateUrlParams(minLen: number, page: number): void {
    const url = new URL(window.location.href);
    url.searchParams.set('minLen', String(minLen));
    url.searchParams.set('page', String(page));
    window.history.pushState({}, '', url.toString());
}

function parseStateFromUrl(): { minLength: number; page: number } {
    const params = new URLSearchParams(window.location.search);
    const minLenParam = Number(params.get('minLen'));
    const pageParam = Number(params.get('page'));

    const minLength = (!isNaN(minLenParam) && minLenParam >= 1) ? Math.floor(minLenParam) : 4;
    const page = (!isNaN(pageParam) && pageParam >= 1) ? Math.floor(pageParam) : 1;

    return { minLength, page };
}

export async function loadUsers(): Promise<void> {
    try {
        renderSkeletons(9);
        const result = await apiService.getUsers();

        // Check if API returned an error
        if (!result.success) {
            const container = document.querySelector('#users-container');
            if (container) container.innerHTML = '';
            renderStatus(`Could not load users: ${result.error}`);
            return;
        }

        // result.success is true, so result.data is guaranteed to be GitHubUser[]!
        allUsers = transformUsers(result.data);

        // Restore filter and page from URL parameters
        const { minLength, page } = parseStateFromUrl();
        const minLengthInput = document.querySelector('#min-login-length') as HTMLInputElement | null;
        if (minLengthInput) {
            minLengthInput.value = String(minLength);
        }

        displayedUsers = allUsers.filter(user => user.login.length >= minLength);

        const totalPages = Math.ceil(displayedUsers.length / pageSize) || 1;
        currentPage = Math.min(page, totalPages);

        renderCurrentPage();
        renderStatus('');
        renderUserCount(displayedUsers.length);

        const applyButton = document.querySelector('#apply-filter');
        if (applyButton) {
            applyButton.addEventListener('click', handleFilter);
        }
    } catch (error) {
        const container = document.querySelector('#users-container');
        if (container) container.innerHTML = '';
        const message = error instanceof Error ? error.message : 'Unknown error';
        renderStatus(`Could not load users: ${message}`);
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);

window.addEventListener('popstate', () => {
    if (allUsers.length === 0) return;
    const { minLength, page } = parseStateFromUrl();
    const minLengthInput = document.querySelector('#min-login-length') as HTMLInputElement | null;
    if (minLengthInput) {
        minLengthInput.value = String(minLength);
    }
    displayedUsers = allUsers.filter(user => user.login.length >= minLength);
    const totalPages = Math.ceil(displayedUsers.length / pageSize) || 1;
    currentPage = Math.min(page, totalPages);
    renderStatus('');
    renderCurrentPage();
});

function handleFilter(): void {
    const minLengthInput = document.querySelector('#min-login-length') as HTMLInputElement | null;
    const rawVal = minLengthInput ? minLengthInput.value.trim() : '';

    if (rawVal === '' || isNaN(Number(rawVal))) {
        renderStatus('Please enter a valid positive number for minimum login length.');
        return;
    }

    const minLength = Number(rawVal);
    if (minLength < 1) {
        renderStatus('Minimum login length must be at least 1.');
        return;
    }

    renderStatus(''); // Clear error status
    displayedUsers = allUsers.filter(user => user.login.length >= minLength);
    currentPage = 1;
    updateUrlParams(minLength, currentPage);
    renderCurrentPage();
}

function renderCurrentPage(): void {
    const totalPages = Math.ceil(displayedUsers.length / pageSize) || 1;

    // Calculate start and end index for slice
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageUsers = displayedUsers.slice(startIndex, endIndex);

    // Render UI
    renderUserCount(displayedUsers.length);
    renderUsers(pageUsers);
    renderPagination(totalPages, currentPage);
}

function handlePaginationClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const targetPage = target.dataset.page;
    if (!targetPage) return; // Clicked outside a button, ignore

    currentPage = Number(targetPage);

    const minLengthInput = document.querySelector('#min-login-length') as HTMLInputElement | null;
    const minLength = minLengthInput ? Number(minLengthInput.value) || 4 : 4;

    updateUrlParams(minLength, currentPage);
    renderCurrentPage();
}

const paginationNav = document.querySelector('#pagination');
if (paginationNav) {
    paginationNav.addEventListener('click', handlePaginationClick);
}