export function renderUsers(users) {
    const container = document.querySelector('#users-container');
    const template = document.querySelector('#user-card-template');
    if (!container || !template)
        return;
    container.innerHTML = ''; // Clear existing cards
    if (users.length === 0) {
        container.textContent = 'No users match your filter criteria.';
        return;
    }
    users.forEach(user => {
        const clone = template.content.cloneNode(true);
        const img = clone.querySelector('.avatar');
        if (img) {
            img.src = user.avatar;
            img.alt = `${user.login}'s avatar`;
        }
        const loginHeading = clone.querySelector('.login');
        if (loginHeading) {
            loginHeading.textContent = user.login;
        }
        const idBadge = clone.querySelector('.id-badge');
        if (idBadge) {
            idBadge.textContent = `${user.id}`;
        }
        const detailsLink = clone.querySelector('.details-link');
        if (detailsLink) {
            detailsLink.href = `details.html?username=${user.login}`;
        }
        container.appendChild(clone);
    });
}
export function renderStatus(message = '') {
    const statusEl = document.querySelector('#status');
    if (statusEl) {
        statusEl.textContent = message;
    }
}
export function renderUserCount(count) {
    const countEl = document.querySelector('#user-count');
    if (!countEl)
        return;
    if (count === 0) {
        countEl.textContent = '';
    }
    else {
        countEl.textContent = `${count} users match your filter criteria`;
    }
}
export function renderPagination(currentPage, hasNextPage) {
    const nav = document.querySelector('#pagination');
    if (!nav)
        return;
    nav.innerHTML = '';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.dataset.page = String(currentPage - 1);
    nav.appendChild(prevBtn);
    const pageLabel = document.createElement('span');
    pageLabel.textContent = `Page ${currentPage}`;
    nav.appendChild(pageLabel);
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = !hasNextPage;
    nextBtn.dataset.page = String(currentPage + 1);
    nav.appendChild(nextBtn);
}
export function renderSkeletons(count = 9) {
    const container = document.querySelector('#users-container');
    if (!container)
        return;
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
    if (!profileCard || !template)
        return;
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('.profile-avatar');
    if (img) {
        img.src = profile.avatar_url;
        img.alt = `${profile.login}'s avatar`;
    }
    const nameEl = clone.querySelector('.profile-name');
    if (nameEl)
        nameEl.textContent = profile.name || profile.login;
    const handleEl = clone.querySelector('.profile-handle');
    if (handleEl)
        handleEl.textContent = `@${profile.login} • ID: ${profile.id}`;
    const bioEl = clone.querySelector('.profile-bio');
    if (bioEl)
        bioEl.textContent = profile.bio || 'No bio available';
    const reposEl = clone.querySelector('.profile-repos-count');
    if (reposEl)
        reposEl.textContent = String(profile.public_repos ?? 0);
    const followersEl = clone.querySelector('.profile-followers-count');
    if (followersEl)
        followersEl.textContent = String(profile.followers ?? 0);
    const followingEl = clone.querySelector('.profile-following-count');
    if (followingEl)
        followingEl.textContent = String(profile.following ?? 0);
    profileCard.innerHTML = ''; // Clears skeleton HTML
    profileCard.appendChild(clone);
}
export function renderFollowers(followers) {
    const container = document.querySelector('#followers-list');
    const template = document.querySelector('#follower-item-template');
    if (!container || !template)
        return;
    container.innerHTML = '';
    if (followers.length === 0) {
        container.textContent = 'No followers found.';
        return;
    }
    followers.forEach(follower => {
        const clone = template.content.cloneNode(true);
        const img = clone.querySelector('.follower-avatar');
        if (img) {
            img.src = follower.avatar_url;
            img.alt = `${follower.login}'s avatar`;
        }
        const link = clone.querySelector('.follower-link');
        if (link) {
            link.href = `details.html?username=${follower.login}`;
            link.textContent = follower.login;
        }
        container.appendChild(clone);
    });
}
export function renderRepos(repos) {
    const container = document.querySelector('#repos-list');
    const template = document.querySelector('#repo-item-template');
    if (!container || !template)
        return;
    container.innerHTML = '';
    if (repos.length === 0) {
        container.textContent = 'No public repositories found.';
        return;
    }
    repos.forEach(repo => {
        const clone = template.content.cloneNode(true);
        const link = clone.querySelector('.repo-link');
        if (link) {
            link.href = repo.html_url;
            link.textContent = repo.name;
        }
        const stars = clone.querySelector('.repo-stars');
        if (stars) {
            stars.textContent = `⭐ ${repo.stargazers_count}`;
        }
        const desc = clone.querySelector('.repo-desc');
        if (desc) {
            desc.textContent = repo.description || 'No description provided';
        }
        container.appendChild(clone);
    });
}
export function renderDetailSkeletons() {
    const profileCard = document.querySelector('#profile-card');
    if (profileCard) {
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
    }
    const followersList = document.querySelector('#followers-list');
    if (followersList) {
        followersList.innerHTML = Array(5).fill(`
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0;">
                <div class="skeleton-avatar" style="width: 32px; height: 32px;"></div>
                <div class="skeleton-line short" style="margin: 0; width: 120px;"></div>
            </div>
        `).join('');
    }
    const reposList = document.querySelector('#repos-list');
    if (reposList) {
        reposList.innerHTML = Array(5).fill(`
            <div style="padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                <div class="skeleton-line medium" style="margin-bottom: 6px;"></div>
                <div class="skeleton-line short" style="margin: 0;"></div>
            </div>
        `).join('');
    }
}
export function renderRepositories(repositories) {
    const container = document.querySelector('#repositories-container');
    if (!container)
        return;
    container.innerHTML = '';
    if (repositories.length === 0) {
        container.textContent = 'No repositories found.';
        return;
    }
    repositories.forEach(repository => {
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
        container.appendChild(card);
    });
}
export function renderRepositoryPagination(currentPage, totalRepositories, pageSize) {
    const paginationContainer = document.querySelector('#repository-pagination');
    if (!paginationContainer)
        return;
    paginationContainer.innerHTML = '';
    const calculatedPages = Math.ceil(totalRepositories / pageSize);
    const totalPages = Math.min(calculatedPages, 100);
    if (totalPages <= 1)
        return;
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.disabled = currentPage === 1;
    previousButton.dataset.page = String(currentPage - 1);
    paginationContainer.appendChild(previousButton);
    const firstPageButton = document.createElement('button');
    firstPageButton.textContent = '1';
    firstPageButton.dataset.page = '1';
    firstPageButton.disabled = currentPage === 1;
    paginationContainer.appendChild(firstPageButton);
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    if (startPage > 2) {
        const leftEllipsis = document.createElement('span');
        leftEllipsis.textContent = '...';
        paginationContainer.appendChild(leftEllipsis);
    }
    for (let page = startPage; page <= endPage; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = String(page);
        pageButton.dataset.page = String(page);
        pageButton.disabled = page === currentPage;
        paginationContainer.appendChild(pageButton);
    }
    if (endPage < totalPages - 1) {
        const rightEllipsis = document.createElement('span');
        rightEllipsis.textContent = '...';
        paginationContainer.appendChild(rightEllipsis);
    }
    const lastPageButton = document.createElement('button');
    lastPageButton.textContent = String(totalPages);
    lastPageButton.dataset.page = String(totalPages);
    lastPageButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(lastPageButton);
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.dataset.page = String(currentPage + 1);
    paginationContainer.appendChild(nextButton);
}
export function renderRepositoryLoading() {
    const statusMessage = document.querySelector('#repository-status');
    const repositoriesContainer = document.querySelector('#repositories-container');
    const paginationContainer = document.querySelector('#repository-pagination');
    const searchButton = document.querySelector('#repository-search-form button[type="submit"]');
    if (statusMessage) {
        statusMessage.textContent = 'Loading repositories...';
    }
    if (repositoriesContainer) {
        repositoriesContainer.innerHTML = '';
    }
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
    if (searchButton) {
        searchButton.disabled = true;
    }
}
