const API = "https://api.github.com";

const token = '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';

const headers = new Headers({
  Authorization: `Bearer ${token}`,
  'User-Agent': 'GitHub Search App'
});

const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const resultContainer = document.getElementById('result');

searchBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  if (isValidUsername(username)) {
    getUserData(username);
    getUserRepositories(username);
    animateResultContainer();
  } else {
    usernameInput.classList.add('error-input');
    usernameError.textContent = 'Неправильний формат імені користувача'; 
  }
});

async function getUserData(username) {
  try {
    const response = await fetch(`${API}/users/${username}`, { headers });
    if (response.status > 399) {
      throw new Error("Вибачте, але такого користувача не існує.");
    }
    const userData = await response.json();
    displayUserData(userData);
  } catch (error) {
    displayError("Вибачте, але такого користувача не існує.");
  return;
  }
}

function animateResultContainer() {
  resultContainer.style.maxHeight = '100vh';
  resultContainer.classList.remove('result-container');
  setTimeout(() => {
    resultContainer.classList.add('result-container');
  }, );
}

randomBtn.addEventListener('click', async () => {
  try {
    animateResultContainer();
    const response = await fetch(`${API}/users`, { headers });
    const usersData = await response.json();
    const randomIndex = Math.floor(Math.random() * usersData.length);
    const randomUser = usersData[randomIndex];
    const username = randomUser.login;
    getUserData(username);
    getUserRepositories(username);
  } catch (error) {
    displayError("Вибачте, але такого користувача не існує.");
  return;
  }
});

function displayUserData(userData) {
  const userProfile = document.createElement('div');
  userProfile.classList.add('user-profile');

  const avatarImg = document.createElement('img');
  avatarImg.src = userData.avatar_url;
  avatarImg.alt = `${userData.name}'s avatar`;
  avatarImg.classList.add('avatar');

  const nameElem = document.createElement('h2');
  nameElem.classList.add('name');
  nameElem.textContent = userData.name;

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-container');

  const bioElem = document.createElement('div');
  bioElem.classList.add('info-item');
  const bioHeader = document.createElement('p');
  bioHeader.classList.add('info-header');
  bioHeader.textContent = 'Bio:';
  const bioText = document.createElement('p');
  bioText.classList.add('info-text');
  bioText.textContent = userData.bio || 'No bio available';
  bioElem.appendChild(bioHeader);
  bioElem.appendChild(bioText);

  const locationElem = document.createElement('div');
  locationElem.classList.add('info-item');
  const locationHeader = document.createElement('p');
  locationHeader.classList.add('info-header');
  locationHeader.textContent = 'Location:';
  const locationText = document.createElement('p');
  locationText.classList.add('info-text');
  locationText.textContent = userData.location || 'No location provided';
  locationElem.appendChild(locationHeader);
  locationElem.appendChild(locationText);

  const followersElem = document.createElement('div');
  followersElem.classList.add('info-item');
  const followersHeader = document.createElement('p');
  followersHeader.classList.add('info-header');
  followersHeader.textContent = 'Followers:';
  const followersText = document.createElement('p');
  followersText.classList.add('info-text');
  followersText.textContent = userData.followers;
  followersElem.appendChild(followersHeader);
  followersElem.appendChild(followersText);

  infoContainer.appendChild(bioElem);
  infoContainer.appendChild(locationElem);
  infoContainer.appendChild(followersElem);

  userProfile.appendChild(avatarImg);
  userProfile.appendChild(nameElem);
  userProfile.appendChild(infoContainer);

  resultContainer.innerHTML = '';
  resultContainer.appendChild(userProfile);
}

function displayError(message) {
  const errorElem = document.createElement('p');
  errorElem.classList.add('error');
  errorElem.textContent = message;

  resultContainer.innerHTML = '';
  resultContainer.appendChild(errorElem);
}

const usernameInput = document.getElementById('username');
const usernameError = document.getElementById('username-error');

usernameInput.addEventListener('input', () => {
  const username = usernameInput.value;
  if (!isValidUsername(username)) {
    usernameInput.classList.add('error-input');
    usernameError.textContent = 'Неправильний формат імені користувача';
  } else {
    usernameInput.classList.remove('error-input');
    usernameError.textContent = '';
  }
});

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
  return usernameRegex.test(username);
}

async function getUserRepositories(username) {
  try {
    const response = await fetch(`${API}/users/${username}/repos`, { headers });
    if (response.status > 399) {
      throw new Error("Вибачте, але такого користувача не існує.");
    }
    const repositoriesData = await response.json();
    displayUserRepositories(repositoriesData);
  } catch (error) {
    displayError("Вибачте, але такого користувача не існує.");
  return;
  }
}

function displayUserRepositories(repositoriesData) {
  const repositoriesContainer = document.createElement('div');
  repositoriesContainer.classList.add('repositories-container');

  const repositoriesHeader = document.createElement('h2');
  repositoriesHeader.textContent = 'Repositories';

  repositoriesContainer.appendChild(repositoriesHeader);

  for (const repo of repositoriesData) {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');

    const repoName = document.createElement('h3');
    repoName.textContent = repo.name;

    const repoDescription = document.createElement('p');
    repoDescription.textContent = repo.description || 'No description available';

    repoCard.appendChild(repoName);
    repoCard.appendChild(repoDescription);

    repositoriesContainer.appendChild(repoCard);
  }

  resultContainer.appendChild(repositoriesContainer);
}