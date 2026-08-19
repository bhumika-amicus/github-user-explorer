import { fetchUserProfile, fetchUserFollowers, fetchUserRepos } from './api.js';
import { renderProfile, renderFollowers, renderRepos, renderDetailSkeletons } from './ui.js';
async function initDetails() {
    const statusEl = document.querySelector('#detail-status');
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    if (!username) {
        statusEl.textContent = 'No username specified in URL.';
        return;
    }
    try {
        statusEl.textContent = 'Loading user details...';
        renderDetailSkeletons();
        // Parallel fetch
        const [profile, followers, repos] = await Promise.all([
            fetchUserProfile(username),
            fetchUserFollowers(username),
            fetchUserRepos(username)
        ]);
        statusEl.textContent = ''; // Clear status message
        renderProfile(profile);
        renderFollowers(followers);
        renderRepos(repos);
    }
    catch (error) {
        document.querySelector('#profile-card').innerHTML = '';
        document.querySelector('#followers-list').innerHTML = '';
        document.querySelector('#repos-list').innerHTML = '';
        statusEl.textContent = `Could not load details: ${error.message}`;
    }
}
document.addEventListener('DOMContentLoaded', initDetails);
