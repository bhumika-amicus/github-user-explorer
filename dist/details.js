import { apiService } from './api.js';
import { renderProfile, renderFollowers, renderRepos, renderDetailSkeletons } from './ui.js';
async function initDetails() {
    const statusEl = document.querySelector('#detail-status');
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    if (!username) {
        if (statusEl)
            statusEl.textContent = 'No username specified in URL.';
        return;
    }
    try {
        if (statusEl)
            statusEl.textContent = 'Loading user details...';
        renderDetailSkeletons();
        // Parallel fetch returning ApiResult objects via ApiService instance
        const [profileRes, followersRes, reposRes] = await Promise.all([
            apiService.getUserProfile(username),
            apiService.getUserFollowers(username),
            apiService.getUserRepos(username)
        ]);
        if (statusEl)
            statusEl.textContent = ''; // Clear status message
        // Handle profile result
        if (profileRes.success) {
            renderProfile(profileRes.data);
        }
        else {
            const profileCard = document.querySelector('#profile-card');
            if (profileCard)
                profileCard.innerHTML = `<p class="error">Could not load profile: ${profileRes.error}</p>`;
        }
        // Handle followers result
        if (followersRes.success) {
            renderFollowers(followersRes.data);
        }
        else {
            renderFollowers([]);
        }
        // Handle repositories result
        if (reposRes.success) {
            renderRepos(reposRes.data);
        }
        else {
            renderRepos([]);
        }
    }
    catch (error) {
        const profileCard = document.querySelector('#profile-card');
        const followersList = document.querySelector('#followers-list');
        const reposList = document.querySelector('#repos-list');
        if (profileCard)
            profileCard.innerHTML = '';
        if (followersList)
            followersList.innerHTML = '';
        if (reposList)
            reposList.innerHTML = '';
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (statusEl)
            statusEl.textContent = `Could not load details: ${message}`;
    }
}
document.addEventListener('DOMContentLoaded', initDetails);
