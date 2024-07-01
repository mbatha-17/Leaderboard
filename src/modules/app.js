const apiBase = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';
const gameId = localStorage.getItem('gameId'); 

export const initializeApp = () => {
  setupEventListeners();
  refreshScores();
};

const setupEventListeners = () => {
  document.getElementById('fresh').addEventListener('click', refreshScores);
  document.getElementById('add').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const score = document.getElementById('score').value.trim();
    if (name && !isNaN(score)) {
    await submitScore(name, score);
    document.getElementById('name').value = '';
    document.getElementById('score').value = '';
    refreshScores();
  } else {
    alert('Please enter a valid name and numeric score.');
  }
  });
};

const fetchScores = async () => {
  try {
    const response = await fetch(`${apiBase}${gameId}/scores/`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const refreshScores = async () => {
  const scores = await fetchScores();
  const validScores = scores.filter(score => score.user && !isNaN(score.score));
  const scoresList = document.getElementById('recentScores');
  scoresList.innerHTML = '';
  validScores.forEach((score) => {
    const li = document.createElement('li');
    li.textContent = `${score.user}: ${score.score}`;
    scoresList.appendChild(li);
  });
};

const submitScore = async (name, score) => {
  await fetch(`${apiBase}${gameId}/scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: name,
      score: parseInt(score, 10),
    }),
  });
};
