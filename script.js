// State Management
let is24HourFormat = true;
let currentTheme = localStorage.getItem('theme') || 'dark';

// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const timePeriod = document.getElementById('timePeriod');
const dateDisplay = document.getElementById('dateDisplay');
const greetingText = document.getElementById('greetingText');
const greetingIcon = document.getElementById('greetingIcon');
const timezoneLabel = document.getElementById('timezoneLabel');
const cityTimezone = document.getElementById('cityTimezone');
const dayOfYear = document.getElementById('dayOfYear');
const formatToggleBtn = document.getElementById('formatToggleBtn');
const formatLabel = document.getElementById('formatLabel');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');
const currentYear = document.getElementById('currentYear');

// Initialize Theme
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  if (currentTheme === 'light') {
    themeIcon.className = 'fa-solid fa-sun';
    themeIcon.style.color = '#f59e0b';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    themeIcon.style.color = '#8b5cf6';
  }
}

themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
});

// Format Toggle
formatToggleBtn.addEventListener('click', () => {
  is24HourFormat = !is24HourFormat;
  formatLabel.textContent = is24HourFormat ? '24H' : '12H';
  updateClock();
});

// Day of Year Calculator
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Update Clock & Dynamic Content
function updateClock() {
  const now = new Date();
  
  // Hours, Minutes, Seconds
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  let period = '';
  if (!is24HourFormat) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  const formattedHours = String(hours).padStart(2, '0');
  
  timeDisplay.textContent = `${formattedHours}:${minutes}:${seconds}`;
  timePeriod.textContent = period;

  // Date String Formatting
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplay.textContent = now.toLocaleDateString(undefined, options);

  // Time-based Greeting
  const currentHour = now.getHours();
  if (currentHour >= 5 && currentHour < 12) {
    greetingText.textContent = 'Good Morning';
    greetingIcon.textContent = '🌅';
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingText.textContent = 'Good Afternoon';
    greetingIcon.textContent = '☀️';
  } else if (currentHour >= 18 && currentHour < 22) {
    greetingText.textContent = 'Good Evening';
    greetingIcon.textContent = '🌆';
  } else {
    greetingText.textContent = 'Good Night';
    greetingIcon.textContent = '🌙';
  }

  // Timezone & Meta
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -now.getTimezoneOffset() / 60;
    const offsetStr = `UTC${offset >= 0 ? '+' : ''}${offset}`;
    
    timezoneLabel.textContent = `Live Local Time`;
    cityTimezone.textContent = `${timeZone.replace(/_/g, ' ')} (${offsetStr})`;
  } catch (e) {
    timezoneLabel.textContent = 'Local Time';
    cityTimezone.textContent = 'Local';
  }

  // Day of Year
  dayOfYear.textContent = `Day ${getDayOfYear(now)} of ${now.getFullYear()}`;
  if (currentYear) {
    currentYear.textContent = now.getFullYear();
  }
}

// Toast Function
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Share Button Action
shareBtn.addEventListener('click', async () => {
  const url = window.location.href;
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      showToast('🎉 Link copied to clipboard!');
      return;
    } catch (err) {
      // Fallback
    }
  }
  showToast('Page URL: ' + url);
});

// Initialize on Load
initTheme();
updateClock();
setInterval(updateClock, 1000);
