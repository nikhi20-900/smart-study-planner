# Smart Study Planner 📚

A complete responsive web application designed for college students to manage their study schedule, track progress, and never miss a deadline. Built with pure HTML, CSS, and JavaScript (no frameworks or backend required).

## 🎯 Features

### Landing Page
- Modern, attractive UI with smooth animations
- Hero section with call-to-action
- Features showcase
- How It Works section
- About section
- Fully responsive design

### Authentication
- **Sign Up**: Create account with username and password
- **Login**: Secure login with persistent sessions
- **Auto-redirect**: Automatically redirects if already logged in
- Data stored in browser LocalStorage

### Planner Dashboard
- **Subject Management**: Add subjects with total topics and deadlines
- **Progress Tracking**: Visual progress bars and percentage completion
- **Daily Targets**: Automatically calculates daily study targets based on deadline
- **Color-Coded Status**:
  - 🟢 Green: On track
  - 🟠 Orange: Near deadline
  - 🔴 Red: Overdue or at risk
- **Study Streak**: Tracks consecutive days of studying
- **Mark Done**: Mark completed topics and update progress
- **Motivational Quotes**: Random inspirational quotes on dashboard
- **Profile Settings**: Customize username and avatar color

## 📁 Project Structure

```
smart-study-planner/
│
├── index.html              → Landing Page
├── signup.html             → Sign Up Page
├── login.html              → Login Page
├── planner.html            → Main Dashboard
│
├── css/
│   ├── landing.css         → Styles for Landing Page
│   ├── auth.css            → Styles for Login & Signup
│   └── planner.css         → Styles for Dashboard
│
├── js/
│   ├── landing.js          → Landing Page Animations
│   ├── auth.js             → Login & Signup Logic
│   └── planner.js          → Main Planner Logic
│
└── README.md               → Project Documentation
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a web browser
3. **Sign Up** to create an account
4. **Login** with your credentials
5. **Start Planning** your studies!

No installation or setup required - just open and use!

## 💾 Data Storage

All data is stored in the browser's LocalStorage:
- **User Accounts**: `studyPlannerUsers` - Array of user objects
- **Current Session**: `currentUser` - Currently logged in user
- **Login Status**: `loggedIn` - Boolean flag
- **Subjects**: `subjects_{username}` - User's subjects array

## 🎨 Design Features

- **Modern UI**: Clean, student-friendly interface
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Color Scheme**: 
  - Primary: Blue (#2d5dd7)
  - Success: Green (#4caf50)
  - Warning: Orange (#ff9800)
  - Danger: Red (#e74c3c)

## 📊 Daily Target Calculation

The app automatically calculates your daily study target:

```
Days Left = Deadline Date - Today
Topics Left = Total Topics - Completed Topics

If Days Left > 0:
    Daily Target = ceil(Topics Left / Days Left)
Else:
    Mark as Overdue
```

## 🔥 Study Streak

- Streak increases when you complete your daily target
- Must be consecutive days (resets if you miss a day)
- Displayed in the navbar: 🔥 Streak: X days

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **LocalStorage API**: Client-side data persistence

## 📝 Usage Instructions

### For Students:

1. **Sign Up**: Create your account with a username and password
2. **Add Subjects**: Enter subject name, total topics, and deadline
3. **Track Progress**: View your progress bars and daily targets
4. **Mark Done**: Click "Mark Done" to update completed topics
5. **Stay Motivated**: Check your study streak and daily quotes!

### Features Explained:

- **Subject Cards**: Each card shows progress, deadline, and daily target
- **Color Coding**: Quickly identify which subjects need attention
- **Profile Settings**: Click on your profile to change username/avatar color
- **Logout**: Click logout to end your session

## 🎓 Perfect For

- College students managing multiple subjects
- Exam preparation and deadline tracking
- Daily study planning and progress monitoring
- Building consistent study habits

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Developer

Developed by **Nikhil**

---

**© 2026 Smart Study Planner** | Study Smarter, Not Harder! 📚
