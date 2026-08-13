
export function renderUsers(users) {
    const container = document.querySelector('#users-container');
    const template = document.querySelector('#user-card-template');

    container.innerHTML = ''; // Clear existing cards

    if (users.length === 0) {
        container.textContent = 'No users match your filter criteria.';
        return;
    }

    users.forEach(user => {
        const clone = template.content.cloneNode(true);

        const img = clone.querySelector('.avatar');
        img.src = user.avatar || user.avatar_url;
        img.alt = `${user.login}'s avatar`;

        const loginHeading = clone.querySelector('.login');
        loginHeading.textContent = user.login;

        const idBadge = clone.querySelector('.id-badge');
        idBadge.textContent = `${user.id}`;

        const detailsLink = clone.querySelector('.details-link');
        detailsLink.href = `details.html?username=${user.login}`;

        container.appendChild(clone);
    });
}

export function renderStatus(message = '') {
    const statusEl = document.querySelector('#status');
    statusEl.textContent = message;
}


export function renderUserCount(count) {
    const countEl = document.querySelector('#user-count');
    countEl.textContent = `Showing ${count} users`;
}


export function renderPagination(totalPages, currentPage) {
    const nav = document.querySelector('#pagination');
    nav.innerHTML = ''; // Clear old buttons
    if (totalPages <= 1) return; // Don't show pagination if only 1 page
    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.dataset.page = currentPage - 1;
    nav.appendChild(prevBtn);
    // Page Number Buttons
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) {
            btn.classList.add('primary'); // Styled as active page
        }
        btn.dataset.page = i;
        nav.appendChild(btn);
    }
    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.dataset.page = currentPage + 1;
    nav.appendChild(nextBtn);
}


export function renderSkeletons(count = 9) {
    const container = document.querySelector('#users-container');
    container.innerHTML = ''; // Clear container

    for (let i = 0; i < count; i++) {
        const card = document.createElement('article');
        card.className = 'skeleton-card';
        card.innerHTML = `
            <div class="skeleton-avatar"></div>
            <div class="skeleton-text">
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
            </div>
        `;
        container.appendChild(card);
    }
}



export function renderProfile(profile) {
    const profileCard = document.querySelector('#profile-card');
    const template = document.querySelector('#profile-template');

    const clone = template.content.cloneNode(true);

    const img = clone.querySelector('.profile-avatar');
    img.src = profile.avatar_url;
    img.alt = `${profile.login}'s avatar`;

    clone.querySelector('.profile-name').textContent = profile.name || profile.login;
    clone.querySelector('.profile-handle').textContent = `@${profile.login} • ID: ${profile.id}`;
    clone.querySelector('.profile-bio').textContent = profile.bio || 'No bio available';
    clone.querySelector('.profile-repos-count').textContent = profile.public_repos;
    clone.querySelector('.profile-followers-count').textContent = profile.followers;
    clone.querySelector('.profile-following-count').textContent = profile.following;

    profileCard.innerHTML = ''; // Clears skeleton HTML
    profileCard.appendChild(clone);
}



export function renderFollowers(followers) {
    const container = document.querySelector('#followers-list');
    const template = document.querySelector('#follower-item-template');
    container.innerHTML = '';
    if (followers.length === 0) {
        container.textContent = 'No followers found.';
        return;
    }
    followers.forEach(follower => {
        const clone = template.content.cloneNode(true);
        const img = clone.querySelector('.follower-avatar');
        img.src = follower.avatar_url;
        img.alt = `${follower.login}'s avatar`;
        const link = clone.querySelector('.follower-link');
        link.href = `details.html?username=${follower.login}`;
        link.textContent = follower.login;
        container.appendChild(clone);
    });
}

export function renderRepos(repos) {
    const container = document.querySelector('#repos-list');
    const template = document.querySelector('#repo-item-template');
    container.innerHTML = '';
    if (repos.length === 0) {
        container.textContent = 'No public repositories found.';
        return;
    }
    repos.forEach(repo => {
        const clone = template.content.cloneNode(true);
        const link = clone.querySelector('.repo-link');
        link.href = repo.html_url;
        link.textContent = repo.name;
        const stars = clone.querySelector('.repo-stars');
        stars.textContent = `⭐ ${repo.stargazers_count}`;
        const desc = clone.querySelector('.repo-desc');
        desc.textContent = repo.description || 'No description provided';
        container.appendChild(clone);
    });
}


export function renderDetailSkeletons() {

    const profileCard = document.querySelector('#profile-card');
    profileCard.innerHTML = `
        <div class="profile-header">
            <div class="skeleton-avatar" style="width: 80px; height: 80px;"></div>
            <div class="skeleton-text" style="flex: 1;">
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line short"></div>
            </div>
        </div>
    `;


    const followersList = document.querySelector('#followers-list');
    followersList.innerHTML = Array(5).fill(`
        <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0;">
            <div class="skeleton-avatar" style="width: 32px; height: 32px;"></div>
            <div class="skeleton-line short" style="margin: 0; width: 120px;"></div>
        </div>
    `).join('');


    const reposList = document.querySelector('#repos-list');
    reposList.innerHTML = Array(5).fill(`
        <div style="padding: 10px 0; border-bottom: 1px solid var(--border-color);">
            <div class="skeleton-line medium" style="margin-bottom: 6px;"></div>
            <div class="skeleton-line short" style="margin: 0;"></div>
        </div>
    `).join('');
}
