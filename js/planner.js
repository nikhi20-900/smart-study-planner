/* ============================================
   SMART STUDY PLANNER - DASHBOARD JS
   Main planner functionality
   ============================================ */

// ============================================
// GLOBAL VARIABLES
// ============================================

let currentSubjectId = null; // For mark done modal
const motivationalQuotes = [
    "The only way to do great work is to love what you do.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You don't have to be great to start, but you have to start to be great.",
    "Study hard, dream big, and never give up.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The expert in anything was once a beginner.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you."
];

// ============================================
// INITIALIZATION
// ============================================

/**
 * Check authentication and initialize app
 */
function init() {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('loggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (loggedIn !== 'true' || !currentUser) {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Load subjects
    loadSubjects();
    
    // Display motivational quote
    displayMotivationalQuote();
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Load and display user data
 */
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Update username
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.username;
    }
    
    // Update avatar
    const userAvatarEl = document.getElementById('userAvatar');
    if (userAvatarEl) {
        userAvatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
        if (currentUser.avatarColor) {
            userAvatarEl.style.background = currentUser.avatarColor;
            userAvatarEl.style.color = 'white';
        }
    }
    
    // Update study streak
    updateStudyStreak();
}

/**
 * Update study streak display
 */
function updateStudyStreak() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const streakEl = document.getElementById('studyStreak');
    if (streakEl) {
        streakEl.textContent = `🔥 Streak: ${currentUser.studyStreak || 0} days`;
    }
}

// ============================================
// SUBJECT MANAGEMENT
// ============================================

/**
 * Get all subjects for current user
 * @returns {Array} Array of subject objects
 */
function getSubjects() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return [];
    
    const key = `subjects_${currentUser.username}`;
    const subjects = localStorage.getItem(key);
    return subjects ? JSON.parse(subjects) : [];
}

/**
 * Save subjects to localStorage
 * @param {Array} subjects - Array of subject objects
 */
function saveSubjects(subjects) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const key = `subjects_${currentUser.username}`;
    localStorage.setItem(key, JSON.stringify(subjects));
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Add a new subject
 * @param {Object} subjectData - Subject data from form
 */
function addSubject(subjectData) {
    const subjects = getSubjects();
    
    const newSubject = {
        id: generateId(),
        name: subjectData.name,
        totalTopics: parseInt(subjectData.totalTopics),
        completedTopics: 0,
        deadline: subjectData.deadline,
        createdAt: new Date().toISOString()
    };
    
    subjects.push(newSubject);
    saveSubjects(subjects);
    loadSubjects();
}

/**
 * Delete a subject
 * @param {string} subjectId - ID of subject to delete
 */
function deleteSubject(subjectId) {
    const subjects = getSubjects();
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) {
        console.error('Subject not found:', subjectId);
        return;
    }
    
    // Confirmation dialog
    const confirmMessage = `Are you sure you want to delete "${subject.name}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        // Remove subject from array
        const filteredSubjects = subjects.filter(s => s.id !== subjectId);
        saveSubjects(filteredSubjects);
        
        // Reload subjects to update display
        loadSubjects();
        
        // Show success feedback
        console.log(`Subject "${subject.name}" deleted successfully.`);
    }
}

/**
 * Load and display all subjects
 */
function loadSubjects() {
    const subjects = getSubjects();
    const grid = document.getElementById('subjectsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (subjects.length === 0) {
        if (emptyState) emptyState.classList.add('show');
        return;
    }
    
    if (emptyState) emptyState.classList.remove('show');
    
    subjects.forEach(subject => {
        const card = createSubjectCard(subject);
        grid.appendChild(card);
    });
}

/**
 * Create a subject card element
 * @param {Object} subject - Subject object
 * @returns {HTMLElement} Card element
 */
function createSubjectCard(subject) {
    const progress = calculateProgress(subject);
    const daysLeft = calculateDaysLeft(subject.deadline);
    const dailyTarget = calculateDailyTarget(subject);
    const status = getSubjectStatus(subject, daysLeft, progress);
    
    const card = document.createElement('div');
    card.className = `subject-card status-${status}`;
    
    card.innerHTML = `
        <div class="subject-header">
            <div class="subject-name">${subject.name}</div>
            <button class="delete-subject-btn" onclick="event.stopPropagation(); deleteSubject('${subject.id}')" title="Delete Subject">
                🗑️
            </button>
        </div>
        <div class="subject-deadline">
            📅 Deadline: ${formatDate(subject.deadline)} (${daysLeft >= 0 ? daysLeft + ' days left' : 'Overdue'})
        </div>
        <div class="progress-section">
            <div class="progress-text">
                <span>${progress}% Complete</span>
                <span>${subject.completedTopics} / ${subject.totalTopics} topics</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill status-${status}" style="width: ${progress}%"></div>
            </div>
        </div>
        <div class="daily-target">
            <strong>Today's Target:</strong> ${dailyTarget} topic${dailyTarget !== 1 ? 's' : ''}
        </div>
        <div class="subject-actions">
            <button class="mark-done-btn" onclick="openMarkDoneModal('${subject.id}')">
                Mark Done
            </button>
        </div>
    `;
    
    return card;
}

// ============================================
// PROGRESS CALCULATION
// ============================================

/**
 * Calculate progress percentage
 * @param {Object} subject - Subject object
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgress(subject) {
    if (subject.totalTopics === 0) return 0;
    return Math.round((subject.completedTopics / subject.totalTopics) * 100);
}

/**
 * Calculate days left until deadline
 * @param {string} deadline - Deadline date string
 * @returns {number} Days remaining (can be negative if overdue)
 */
function calculateDaysLeft(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

/**
 * Calculate daily target
 * @param {Object} subject - Subject object
 * @returns {number} Daily target topics
 */
function calculateDailyTarget(subject) {
    const daysLeft = calculateDaysLeft(subject.deadline);
    const topicsLeft = subject.totalTopics - subject.completedTopics;
    
    if (daysLeft <= 0) {
        return topicsLeft; // Overdue, need to complete all remaining
    }
    
    if (topicsLeft <= 0) {
        return 0; // Already completed
    }
    
    return Math.ceil(topicsLeft / daysLeft);
}

/**
 * Get subject status based on deadline and progress
 * @param {Object} subject - Subject object
 * @param {number} daysLeft - Days remaining
 * @param {number} progress - Progress percentage
 * @returns {string} Status: 'green', 'orange', or 'red'
 */
function getSubjectStatus(subject, daysLeft, progress) {
    if (daysLeft < 0) {
        return 'red'; // Overdue
    }
    
    const expectedProgress = calculateExpectedProgress(subject);
    
    if (progress >= expectedProgress && daysLeft > 7) {
        return 'green'; // On track
    }
    
    if (daysLeft <= 3 || progress < expectedProgress * 0.7) {
        return 'red'; // At risk
    }
    
    if (daysLeft <= 7 || progress < expectedProgress * 0.85) {
        return 'orange'; // Near deadline
    }
    
    return 'green'; // On track
}

/**
 * Calculate expected progress based on time elapsed
 * @param {Object} subject - Subject object
 * @returns {number} Expected progress percentage
 */
function calculateExpectedProgress(subject) {
    const createdAt = new Date(subject.createdAt);
    const deadline = new Date(subject.deadline);
    const today = new Date();
    
    const totalDays = Math.ceil((deadline - createdAt) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today - createdAt) / (1000 * 60 * 60 * 24));
    
    if (totalDays <= 0) return 100;
    
    return Math.min(100, Math.round((daysPassed / totalDays) * 100));
}

// ============================================
// MARK DONE FUNCTIONALITY
// ============================================

/**
 * Open mark done modal
 * @param {string} subjectId - Subject ID
 */
function openMarkDoneModal(subjectId) {
    currentSubjectId = subjectId;
    const subject = getSubjects().find(s => s.id === subjectId);
    
    if (!subject) return;
    
    const modal = document.getElementById('markDoneModal');
    const infoEl = document.getElementById('markDoneInfo');
    const dailyTarget = calculateDailyTarget(subject);
    const topicsLeft = subject.totalTopics - subject.completedTopics;
    
    if (infoEl) {
        infoEl.textContent = `You have ${topicsLeft} topics remaining. Today's target is ${dailyTarget} topic${dailyTarget !== 1 ? 's' : ''}.`;
    }
    
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Mark topics as done
 */
function markTopicsDone() {
    if (!currentSubjectId) return;
    
    const topicsCompleted = parseInt(document.getElementById('topicsCompleted').value);
    
    if (!topicsCompleted || topicsCompleted < 1) {
        alert('Please enter a valid number of topics!');
        return;
    }
    
    const subjects = getSubjects();
    const subject = subjects.find(s => s.id === currentSubjectId);
    
    if (!subject) return;
    
    const topicsLeft = subject.totalTopics - subject.completedTopics;
    
    if (topicsCompleted > topicsLeft) {
        alert(`You can only mark ${topicsLeft} topic${topicsLeft !== 1 ? 's' : ''} as done!`);
        return;
    }
    
    // Update completed topics
    subject.completedTopics = Math.min(
        subject.completedTopics + topicsCompleted,
        subject.totalTopics
    );
    
    saveSubjects(subjects);
    
    // Check if daily target achieved and update streak
    const dailyTarget = calculateDailyTarget(subject);
    if (topicsCompleted >= dailyTarget) {
        updateStudyStreakOnCompletion();
    }
    
    // Close modal
    const modal = document.getElementById('markDoneModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('topicsCompleted').value = '';
    }
    
    // Reload subjects
    loadSubjects();
}

/**
 * Update study streak when daily target is achieved
 */
function updateStudyStreakOnCompletion() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const today = new Date().toDateString();
    const lastStudyDate = currentUser.lastStudyDate;
    
    if (lastStudyDate === today) {
        // Already studied today, don't increase streak
        return;
    }
    
    // Check if consecutive day
    if (lastStudyDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastStudyDate === yesterdayStr) {
            // Consecutive day, increase streak
            currentUser.studyStreak = (currentUser.studyStreak || 0) + 1;
        } else {
            // Not consecutive, reset streak
            currentUser.studyStreak = 1;
        }
    } else {
        // First time studying
        currentUser.studyStreak = 1;
    }
    
    currentUser.lastStudyDate = today;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update display
    updateStudyStreak();
}

// ============================================
// PROFILE SETTINGS
// ============================================

/**
 * Open profile settings modal
 */
function openProfileModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const modal = document.getElementById('profileModal');
    const usernameInput = document.getElementById('newUsername');
    const colorInput = document.getElementById('avatarColor');
    
    if (usernameInput) {
        usernameInput.value = currentUser.username;
    }
    
    if (colorInput && currentUser.avatarColor) {
        colorInput.value = currentUser.avatarColor;
    }
    
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Save profile settings
 */
function saveProfileSettings() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const avatarColor = document.getElementById('avatarColor').value;
    
    if (!newUsername || newUsername.length < 3) {
        alert('Username must be at least 3 characters long!');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Update username in all stored data if changed
    if (newUsername !== currentUser.username) {
        // Update subjects key
        const oldKey = `subjects_${currentUser.username}`;
        const newKey = `subjects_${newUsername}`;
        const subjects = localStorage.getItem(oldKey);
        
        if (subjects) {
            localStorage.setItem(newKey, subjects);
            localStorage.removeItem(oldKey);
        }
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('studyPlannerUsers') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].username = newUsername;
            localStorage.setItem('studyPlannerUsers', JSON.stringify(users));
        }
    }
    
    // Update current user
    currentUser.username = newUsername;
    currentUser.avatarColor = avatarColor;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update display
    loadUserData();
    
    // Close modal
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ============================================
// MOTIVATIONAL QUOTES
// ============================================

/**
 * Display a random motivational quote
 */
function displayMotivationalQuote() {
    const quoteEl = document.getElementById('motivationalQuote');
    if (quoteEl) {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        quoteEl.textContent = `"${randomQuote}"`;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date string
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Subject form submission
    const subjectForm = document.getElementById('subjectForm');
    if (subjectForm) {
        subjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('subjectName').value.trim(),
                totalTopics: document.getElementById('totalTopics').value,
                deadline: document.getElementById('deadline').value
            };
            
            if (!formData.name || !formData.totalTopics || !formData.deadline) {
                alert('Please fill in all fields!');
                return;
            }
            
            addSubject(formData);
            subjectForm.reset();
        });
    }
    
    // Profile click
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        userProfile.addEventListener('click', openProfileModal);
    }
    
    // Profile modal close
    const closeProfileModal = document.getElementById('closeProfileModal');
    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', () => {
            document.getElementById('profileModal').classList.remove('show');
        });
    }
    
    // Save profile
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfileSettings);
    }
    
    // Mark done modal close
    const closeMarkDoneModal = document.getElementById('closeMarkDoneModal');
    if (closeMarkDoneModal) {
        closeMarkDoneModal.addEventListener('click', () => {
            document.getElementById('markDoneModal').classList.remove('show');
            currentSubjectId = null;
        });
    }
    
    // Save mark done
    const saveMarkDoneBtn = document.getElementById('saveMarkDoneBtn');
    if (saveMarkDoneBtn) {
        saveMarkDoneBtn.addEventListener('click', markTopicsDone);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Close modals on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                currentSubjectId = null;
            }
        });
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', init);
