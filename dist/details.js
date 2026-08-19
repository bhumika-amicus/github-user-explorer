import { apiService } from './api.js';
import { renderProfile, renderFollowers, renderRepos, renderDetailSkeletons } from './ui.js';
export async function initDetails() {
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
        // STAGE 1: Validate Parent Entity First (User Profile)
        const profileRes = await apiService.getUserProfile(username);
        if (!profileRes.success) {
            console.error('User profile fetch error:', profileRes.error);
            const profileCard = document.querySelector('#profile-card');
            const followersList = document.querySelector('#followers-list');
            const reposList = document.querySelector('#repos-list');
            if (profileCard)
                profileCard.innerHTML = `<p class="error">User profile for "@${username}" was not found.</p>`;
            if (followersList)
                followersList.innerHTML = '';
            if (reposList)
                reposList.innerHTML = '';
            return;
        }
        // Render Profile Header since User Profile exists
        renderProfile(profileRes.data);
        // STAGE 2: User exists! Fetch Followers and Repos concurrently using Promise.allSettled
        const [followersSettled, reposSettled] = await Promise.allSettled([
            apiService.getUserFollowers(username),
            apiService.getUserRepos(username)
        ]);
        // Handle Followers Settled Result (Isolated Failure)
        if (followersSettled.status === 'fulfilled') {
            const followersRes = followersSettled.value;
            if (followersRes.success) {
                renderFollowers(followersRes.data);
            }
            else {
                console.error('Followers fetch error:', followersRes.error);
                const followersList = document.querySelector('#followers-list');
                if (followersList)
                    followersList.textContent = 'Unable to load followers at this time.';
            }
        }
        else {
            console.error('Followers promise rejected:', followersSettled.reason);
            const followersList = document.querySelector('#followers-list');
            if (followersList)
                followersList.textContent = 'Unable to load followers at this time.';
        }
        // Handle Repositories Settled Result (Isolated Failure)
        if (reposSettled.status === 'fulfilled') {
            const reposRes = reposSettled.value;
            if (reposRes.success) {
                renderRepos(reposRes.data);
            }
            else {
                console.error('Repositories fetch error:', reposRes.error);
                const reposList = document.querySelector('#repos-list');
                if (reposList)
                    reposList.textContent = 'Unable to load repositories at this time.';
            }
        }
        else {
            console.error('Repositories promise rejected:', reposSettled.reason);
            const reposList = document.querySelector('#repos-list');
            if (reposList)
                reposList.textContent = 'Unable to load repositories at this time.';
        }
    }
    catch (error) {
        console.error('Unexpected error in initDetails:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (statusEl)
            statusEl.textContent = `Could not load details: ${message}`;
    }
    finally {
        // Guaranteed status clearing on UI completion
        if (statusEl && statusEl.textContent === 'Loading user details...') {
            statusEl.textContent = '';
        }
    }
}
document.addEventListener('DOMContentLoaded', initDetails);
