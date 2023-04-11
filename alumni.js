// Search Functionality
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const alumniCards = document.querySelectorAll('.alumni-card');

searchButton.addEventListener('click', () => {
  const searchText = searchInput.value.toLowerCase();
  
  alumniCards.forEach((card) => {
    const name = card.querySelector('.alumni-name').textContent.toLowerCase();
    const batch = card.querySelector('.alumni-batch').textContent.toLowerCase();
    
    if (name.includes(searchText) || batch.includes(searchText)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
});

// Modal Functionality
const modalButton = document.querySelector('#modal-button');
const modalOverlay = document.querySelector('#modal-overlay');
const modalCloseButton = document.querySelector('#modal-close-button');

modalButton.addEventListener('click', () => {
  modalOverlay.classList.add('show');
});

modalCloseButton.addEventListener('click', () => {
  modalOverlay.classList.remove('show');
});

// Form Submission
const form = document.querySelector('#contact-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const nameInput = document.querySelector('#name-input');
  const emailInput = document.querySelector('#email-input');
  const messageInput = document.querySelector('#message-input');
  
  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    message: messageInput.value
  };
  
  // Send form data to server using AJAX
  // Display success or error message based on server response
});
