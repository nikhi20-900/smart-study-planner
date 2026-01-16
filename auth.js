/* ============================================
   SMART STUDY PLANNER - AUTHENTICATION JS
   Login and signup functionality
   ============================================ */

/**
 * Check if user is already logged in
 * Redirects to planner if logged in
 */
function checkExistingSession() {
    const loggedIn = localStorage.getItem('loggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (loggedIn === 'true' && currentUser) {
        // User is already logged in, redirect to planner
        window.location.href = 'planner.html';
    }
}

/**
 * Handle signup form submission
 * @param {Event} e - Form submit event
 */
function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const signupButton = document.getElementById('signupButton');
    const buttonText = signupButton ? signupButton.querySelector('.button-text') : null;
    const buttonLoader = signupButton ? signupButton.querySelector('.button-loader') : null;
    
    // Hide previous messages
    if (errorMessage) errorMessage.classList.remove('show');
    if (successMessage) successMessage.classList.remove('show');
    
    // Validation
    if (!username || username.length < 3) {
        showError('Username must be at least 3 characters long!');
        return;
    }
    
    if (!password || password.length < 6) {
        showError('Password must be at least 6 characters long!');
        return;
    }
    
    // Show loading state
    if (signupButton) {
        signupButton.disabled = true;
        if (buttonText) buttonText.style.display = 'none';
        if (buttonLoader) buttonLoader.style.display = 'inline-block';
    }
    
    // Get existing users
    let users = [];
    try {
        const usersStr = localStorage.getItem('studyPlannerUsers');
        if (usersStr) {
            users = JSON.parse(usersStr);
        }
    } catch (error) {
        console.error('Error parsing users:', error);
        showError('Error loading user data. Please try again.');
        if (signupButton) resetButton(signupButton, buttonText, buttonLoader);
        return;
    }
    
    // Ensure users is an array
    if (!Array.isArray(users)) {
        users = [];
    }
    
    // Check if username already exists
    if (users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
        showError('Username already exists! Please choose another one.');
        if (signupButton) resetButton(signupButton, buttonText, buttonLoader);
        return;
    }
    
    // Create new user
    const newUser = {
        username: username,
        password: password,
        createdAt: new Date().toISOString(),
        avatarColor: generateAvatarColor(),
        studyStreak: 0,
        lastStudyDate: null
    };
    
    try {
        users.push(newUser);
        localStorage.setItem('studyPlannerUsers', JSON.stringify(users));
        
        // Show success message
        if (successMessage) {
            successMessage.textContent = 'Account created successfully! Redirecting to login...';
            successMessage.classList.add('show');
        }
        
        // Redirect to login page after 1 second
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } catch (error) {
        console.error('Error saving user:', error);
        showError('Error creating account. Please try again.');
        if (signupButton) resetButton(signupButton, buttonText, buttonLoader);
    }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const buttonLoader = loginButton.querySelector('.button-loader');
    
    // Hide previous errors
    if (errorMessage) errorMessage.classList.remove('show');
    
    // Validation
    if (!username || username.length < 3) {
        showError('Please enter a valid username (at least 3 characters).');
        return;
    }
    
    if (!password || password.length < 6) {
        showError('Please enter a valid password (at least 6 characters).');
        return;
    }
    
    // Show loading state
    if (loginButton) {
        loginButton.disabled = true;
        if (buttonText) buttonText.style.display = 'none';
        if (buttonLoader) buttonLoader.style.display = 'inline-block';
    }
    
    // Get users from localStorage
    let users = [];
    try {
        const usersStr = localStorage.getItem('studyPlannerUsers');
        if (usersStr) {
            users = JSON.parse(usersStr);
        }
    } catch (error) {
        console.error('Error parsing users:', error);
        showError('Error loading user data. Please try again.');
        resetButton(loginButton, buttonText, buttonLoader);
        return;
    }
    
    // Check if users array is empty
    if (!Array.isArray(users) || users.length === 0) {
        showError('No accounts found. Please sign up first.');
        resetButton(loginButton, buttonText, buttonLoader);
        return;
    }
    
    // Find user with matching username and password
    const user = users.find(u => {
        const usernameMatch = u.username && u.username.toLowerCase() === username.toLowerCase();
        const passwordMatch = u.password === password;
        return usernameMatch && passwordMatch;
    });
    
    if (user) {
        // Save current user session
        try {
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                avatarColor: user.avatarColor || generateAvatarColor(),
                studyStreak: user.studyStreak || 0,
                lastStudyDate: user.lastStudyDate || null
            }));
            
            // Set logged in flag
            localStorage.setItem('loggedIn', 'true');
            
            // Show success message briefly
            if (errorMessage) {
                errorMessage.style.background = '#efe';
                errorMessage.style.color = '#3c3';
                errorMessage.textContent = 'Login successful! Redirecting...';
                errorMessage.classList.add('show');
            }
            
            // Redirect to planner after short delay
            setTimeout(() => {
                window.location.href = 'planner.html';
            }, 500);
        } catch (error) {
            console.error('Error saving session:', error);
            showError('Error saving session. Please try again.');
            resetButton(loginButton, buttonText, buttonLoader);
        }
    } else {
        // Show error message
        showError('Invalid username or password. Please check your credentials and try again.');
        resetButton(loginButton, buttonText, buttonLoader);
    }
}

/**
 * Reset button to normal state
 */
function resetButton(button, text, loader) {
    if (button) {
        button.disabled = false;
        if (text) text.style.display = 'inline-block';
        if (loader) loader.style.display = 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}

/**
 * Generate a random color for avatar
 * @returns {string} Hex color code
 */
function generateAvatarColor() {
    const colors = [
        '#2d5dd7', '#4caf50', '#ff6b35', '#9c27b0',
        '#f39c12', '#e74c3c', '#16a085', '#3498db'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
