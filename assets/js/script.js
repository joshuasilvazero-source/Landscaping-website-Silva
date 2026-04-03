const API_BASE = 'http://localhost:3000';

const bookingForm = document.getElementById('bookingForm');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const formMessage = document.getElementById('formMessage');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

const ALL_TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

function applySavedTheme() {
  const savedTheme = localStorage.getItem('greenscape-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
}
function toggleDark() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('greenscape-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

function toggleMenu() {
  navMenu.classList.toggle('active');
}

function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function fillTimeSlots(bookedTimes = []) {
  timeSelect.innerHTML = '<option value="">Select a time</option>';

  ALL_TIME_SLOTS.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = bookedTimes.includes(slot) ? `${slot} — Unavailable` : slot;
    option.disabled = bookedTimes.includes(slot);
    timeSelect.appendChild(option);
  });
}
async function loadBookedSlots(selectedDate) {
  if (!selectedDate) {
    fillTimeSlots([]);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/bookings/slots/${selectedDate}`);
    const data = await response.json();
    fillTimeSlots(data.bookedTimes || []);
  } catch (error) {
    fillTimeSlots([]);
    formMessage.textContent = 'Could not load available times right now.';
  }
}

async function submitBooking(event) {
  event.preventDefault();

  const formData = {
    name: bookingForm.name.value.trim(),
    email: bookingForm.email.value.trim(),
    phone: bookingForm.phone.value.trim(),
    service: bookingForm.service.value,
    date: bookingForm.date.value,
    time: bookingForm.time.value,
    notes: bookingForm.notes.value.trim()
  };

  formMessage.textContent = 'Booking appointment...';

  try {
    const response = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      formMessage.textContent = data.message || 'Unable to book appointment.';
      return;
    }

    formMessage.textContent = 'Appointment confirmed. Check your email for confirmation.';
    bookingForm.reset();
    fillTimeSlots([]);
  } catch (error) {
    formMessage.textContent = 'Server connection failed. Please try again.';
  }
}
function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

themeToggle.addEventListener('click', toggleDark);
menuToggle.addEventListener('click', toggleMenu);
dateInput.addEventListener('change', (e) => loadBookedSlots(e.target.value));
bookingForm.addEventListener('submit', submitBooking);

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

applySavedTheme();
setMinDate();
fillTimeSlots([]);
initRevealAnimations();