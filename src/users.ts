import { apiService } from './api.js';
import { renderUsers, renderStatus, renderUserCount, renderPagination, renderSkeletons } from './ui.js';
import type { GitHubUser, TransformedUser , SortDirection} from './types.js';


let currentPageUsers: TransformedUser[] = [];
let currentPage: number = 1;
const pageSize: number = 9;
let searchTerm: string = '';
let sortDirection: SortDirection = 'asc';

const pageCursors: (number | undefined)[] = [undefined];

export function transformUsers(rawUsers: GitHubUser[]): TransformedUser[] {
    return rawUsers.map(({ login, id, avatar_url }) => ({
        login,
        id,
        avatar: avatar_url
    }));
}


function clearUserGrid(): void {
    const container = document.querySelector('#users-container');

    if (container) {
        container.innerHTML = '';
    }

    renderUserCount(0);
    renderPagination(1, false);
}

function getVisibleUsers(): TransformedUser[] {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredUsers = normalizedSearch === ''
        ? [...currentPageUsers]
        : currentPageUsers.filter(user =>
            user.login.toLowerCase().includes(normalizedSearch)
        );

    return filteredUsers.sort((a, b) => {
        const comparison = a.login.localeCompare(b.login);

        return sortDirection === 'asc'
            ? comparison
            : -comparison;
    });
}

export async function loadUsers(): Promise<void> {
    try {
        renderSkeletons(pageSize);
        console.log('Current page:', currentPage);  
        const since = pageCursors[currentPage - 1];
        console.log('Since cursor:', since);
        const result = await apiService.getUsers(since);

        // Check if API returned an error
        if (!result.success) {
            console.error('getUsers API failure:', result.error);
            clearUserGrid();
            renderStatus(`Could not load users: ${result.error}`);
            return;
        }

        currentPageUsers = transformUsers(result.data);

        // Store the last user ID as the cursor for the next page
        if (result.data.length === pageSize) {
            const lastUser = result.data[result.data.length - 1];
            pageCursors[currentPage] = lastUser.id;
        } else {
            // No full page means there is no next page
            pageCursors[currentPage] = undefined;
        }

        renderCurrentPage();

    } catch (error) {
        console.error('Unexpected error in loadUsers:', error);
        clearUserGrid();

        const message = error instanceof Error
            ? error.message
            : 'Unknown error';

        renderStatus(`Could not load users: ${message}`);
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);

window.addEventListener('popstate', () => {
    loadUsers();
});


function renderCurrentPage(): void {
    const visibleUsers = getVisibleUsers();

    renderUserCount(visibleUsers.length);
    renderUsers(visibleUsers);

    const hasNextPage = pageCursors[currentPage] !== undefined;

    renderPagination(currentPage, hasNextPage);
}


function handlePaginationClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const targetPage = target.dataset.page;
    if (!targetPage) return;

    const requestedPage = Number(targetPage);

    if (requestedPage < 1) return;

    currentPage = requestedPage;

    loadUsers();

}

//used only to update the searchTerm and re-render the current page 
// actual search happens in getVisibleUsers() which is called from renderCurrentPage()
function handleSearch(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;

    searchTerm = input.value;
    renderCurrentPage();
}
//used only to update the sortDirection and re-render the current page
// actual sorting happens in getVisibleUsers() which is called from renderCurrentPage()
function handleSort(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement;

    sortDirection = select.value as SortDirection;

    renderCurrentPage();
}

const paginationNav = document.querySelector('#pagination');
if (paginationNav) {
    paginationNav.addEventListener('click', handlePaginationClick);
}

const searchInput = document.querySelector('#user-search');

if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

const sortSelect = document.querySelector('#sort-users');

if (sortSelect) {
    sortSelect.addEventListener('change', handleSort);
}