let currentPage = 1;
const repositoriesPerPage = 10;
let userTotalRepos = 0;

function fetchRepositories() {
    const username = document.getElementById('username').value;
    fetchUserInformation(username);
}

function fetchUserRepositories(username, page) {
    const url = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${repositoriesPerPage}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayRepositories(data);
            updatePagination(username, page);
        })
        .catch(error => console.error('Error fetching repositories:', error));
}

function updatePagination(username, currentPage) {
    const totalPages = Math.ceil(userTotalRepos / repositoriesPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    if (totalPages > 1) {
        const ul = document.createElement('ul');
        ul.className = 'pagination';

        // Create "Previous" link
        const previousLi = document.createElement('li');
        previousLi.className = 'page-item';
        const previousLink = document.createElement('a');
        previousLink.className = 'page-link';
        previousLink.href = '#';
        previousLink.textContent = 'Previous';
        previousLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchUserRepositories(username, currentPage);
            }
        });
        previousLi.appendChild(previousLink);
        ul.appendChild(previousLi);

        // Create number of pages
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item';
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i;
            a.addEventListener('click', () => {
                currentPage = i;
                fetchUserRepositories(username, currentPage);
            });
            li.appendChild(a);
            ul.appendChild(li);
        }

        // Create "Next" link
        const nextLi = document.createElement('li');
        nextLi.className = 'page-item';
        const nextLink = document.createElement('a');
        nextLink.className = 'page-link';
        nextLink.href = '#';
        nextLink.textContent = 'Next';
        nextLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchUserRepositories(username, currentPage);
            }
        });
        nextLi.appendChild(nextLink);
        ul.appendChild(nextLi);

        paginationContainer.appendChild(ul);
    }
}

// Inside the displayRepositories function

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositories');
    repositoriesContainer.innerHTML = '';

    if (repositories.length === 0) {
        repositoriesContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }

    const row = document.createElement('div');
    row.className = 'row mt-3';

    for (let j = 0; j < repositories.length; j++) {
        // Create a card for each repository
        const repo = repositories[j];

        const card = document.createElement('div');
        card.className = 'card col-lg-5 col-md-4 col-sm-3'; // Adjust column sizes as needed

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Project Name
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = repo.name;

        // Project Description
        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = repo.description || 'No description available.';

        // Technologies
        const technologies = document.createElement('div');
        technologies.className = 'card-text';

        // Apply styling to the technologies as buttons
        const technologyButton = document.createElement('button');
        technologyButton.className = 'btn btn-primary';
        technologyButton.style.backgroundColor = 'blue'; // Background color
        technologyButton.style.color = 'white'; // Text color
        technologyButton.textContent = repo.language || 'Not specified';

        technologies.appendChild(technologyButton);

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(technologies);

        card.appendChild(cardBody);
        row.appendChild(card);

        if (j === Math.floor(repositories.length / 2) - 1) {
            repositoriesContainer.appendChild(row);

            // Start a new row for the second column
            const newRow = document.createElement('div');
            newRow.className = 'row mt-3';
            row.replaceWith(newRow);
        }
    }

    repositoriesContainer.appendChild(row);
}



function fetchUserInformation(username) {
    const url = `https://api.github.com/users/${username}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            userTotalRepos = data.public_repos;
            displayUserInformation(data);
            togglePaginationVisibility(true);
            fetchUserRepositories(username, currentPage);
        })
        .catch(error => console.error('Error fetching user information:', error));
}

function displayUserInformation(user) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userBio = document.getElementById('userBio');
    const userLocation = document.getElementById('userLocation');
    const userSocialLinks = document.getElementById('userSocialLinks');
    const githubLink = document.getElementById('githubLink');

    userAvatar.src = user.avatar_url;
    userName.textContent = user.name || user.login;
    userBio.textContent = user.bio || 'No bio available';
    userLocation.textContent = 'Location: ' + (user.location || 'Not specified');

    // Check if social links are available (replace these with the actual properties from the GitHub API response)
    if (user.linkedin) {
        userSocialLinks.innerHTML = 'LinkedIn: <a href="' + user.linkedin + '" target="_blank">' + user.linkedin + '</a>';
    } else if (user.twitter) {
        userSocialLinks.innerHTML = 'Twitter: <a href="' + user.twitter + '" target="_blank">' + user.twitter + '</a>';
    } else {
        userSocialLinks.innerText = '';
    }

    githubLink.href = user.html_url;
}

function togglePaginationVisibility(visible) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.style.display = visible ? 'block' : 'none';
}

// Initial state: Hide pagination
togglePaginationVisibility(false);
