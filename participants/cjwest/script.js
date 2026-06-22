const button = document.getElementById('actionButton');
const message = document.getElementById('message');

const phrases = [
  'Ready to build something awesome?',
  'This is your hackathon starter. Go create!',
  'Front-end energy activated ⚡',
  'You can add more HTML, CSS, and JS here.',
];

button.addEventListener('click', () => {
  const next = phrases[Math.floor(Math.random() * phrases.length)];
  message.textContent = next;
});
