import { apiService } from './api.js';
import { renderUsers, renderStatus, renderUserCount, renderPagination, renderSkeletons } from './ui.js';
let allUsers = [];
let displayedUsers = [];
let currentPage = 1;
const pageSize = 9;
export function transformUsers(rawUsers) {
    return rawUsers.map(({ login, id, avatar_url }) => ({
        login,
        id,
        avatar: avatar_url
    }));
}
function updateUrlParams(minLen, page) {
    const url = new URL(window.location.href);
    url.searchParams.set('minLen', String(minLen));
    url.searchParams.set('page', String(page));
    window.history.pushState({}, '', url.toString());
}
function parseStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const minLenParam = Number(params.get('minLen'));
    const pageParam = Number(params.get('page'));
    // Default minLength to 4 as specified in assignment requirements
    const minLength = (!isNaN(minLenParam) && minLenParam >= 4) ? Math.floor(minLenParam) : 4;
    const page = (!isNaN(pageParam) && pageParam >= 1) ? Math.floor(pageParam) : 1;
    return { minLength, page };
}
function clearUserGrid() {
    const container = document.querySelector('#users-container');
    if (container)
        container.innerHTML = '';
    renderUserCount(0);
    renderPagination(0, 1);
}
export async function loadUsers() {
    try {
        renderSkeletons(9);
        const result = await apiService.getUsers();
        // Check if API returned an error
        if (!result.success) {
            console.error('getUsers API failure:', result.error);
            clearUserGrid();
            renderStatus(`Could not load users: ${result.error}`);
            return;
        }
        allUsers = transformUsers(result.data);
        // Restore filter and page from URL parameters
        const { minLength, page } = parseStateFromUrl();
        const minLengthInput = document.querySelector('#min-login-length');
        if (minLengthInput) {
            minLengthInput.value = String(minLength);
        }
        displayedUsers = allUsers.filter(user => user.login.length >= minLength);
        const totalPages = Math.ceil(displayedUsers.length / pageSize) || 1;
        currentPage = Math.min(page, totalPages);
        renderCurrentPage();
        const applyButton = document.querySelector('#apply-filter');
        if (applyButton) {
            applyButton.addEventListener('click', handleFilter);
        }
    }
    catch (error) {
        console.error('Unexpected error in loadUsers:', error);
        clearUserGrid();
        const message = error instanceof Error ? error.message : 'Unknown error';
        renderStatus(`Could not load users: ${message}`);
    }
}
document.addEventListener('DOMContentLoaded', loadUsers);
window.addEventListener('popstate', () => {
    if (allUsers.length === 0)
        return;
    const { minLength, page } = parseStateFromUrl();
    const minLengthInput = document.querySelector('#min-login-length');
    if (minLengthInput) {
        minLengthInput.value = String(minLength);
    }
    displayedUsers = allUsers.filter(user => user.login.length >= minLength);
    const totalPages = Math.ceil(displayedUsers.length / pageSize) || 1;
    currentPage = Math.min(page, totalPages);
    renderStatus('');
    renderCurrentPage();
});
function handleFilter() {
    const minLengthInput = document.querySelector('#min-login-length');
    const rawVal = minLengthInput ? minLengthInput.value.trim() : '';
    if (rawVal === '' || isNaN(Number(rawVal))) {
        clearUserGrid();
        renderStatus('Please enter a valid positive number for minimum login length.');
        return;
    }
    const minLength = Number(rawVal);
    if (minLength < 4) {
        clearUserGrid();
        renderStatus('Minimum login length must be at least 4.');
        return;
    }
    renderStatus(''); // Clear error status
    displayedUsers = allUsers.filter(user => user.login.length >= minLength);
    currentPage = 1;
    updateUrlParams(minLength, currentPage);
    renderCurrentPage();
}
function renderCurrentPage() {
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
function handlePaginationClick(event) {
    const target = event.target;
    if (!target)
        return;
    const targetPage = target.dataset.page;
    if (!targetPage)
        return; // Clicked outside a button, ignore
    currentPage = Number(targetPage);
    const minLengthInput = document.querySelector('#min-login-length');
    const minLength = minLengthInput ? Number(minLengthInput.value) || 4 : 4;
    updateUrlParams(minLength, currentPage);
    renderCurrentPage();
}
const paginationNav = document.querySelector('#pagination');
if (paginationNav) {
    paginationNav.addEventListener('click', handlePaginationClick);
}
