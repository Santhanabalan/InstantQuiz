# InstantQuiz

InstantQuiz is a modern, client-side quiz application that allows you to upload JSON files containing questions and generate interactive practice exams instantly. Built with React, Vite, and Tailwind CSS.

## 🚀 Live Demo

**[Try InstantQuiz](https://santhanabalan.github.io/InstantQuiz/)**

The application is automatically deployed to GitHub Pages on every push to the main branch.

## Features

- **JSON Upload**: Drag-and-drop JSON file upload with validation
- **Rich Question Metadata**: Support for explanations, difficulty levels, categories, and tags
- **Multiple Question Types**: Single-choice, multi-select, and fill-in-the-blank questions
- **Quiz Configuration**: Customize question count, timer, passing score, and randomization options
- **Interactive Exam**: Distraction-free quiz-taking experience with progress tracking
- **Analytics Dashboard**: Detailed results with score visualization, question review, and explanations
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Automatic light/dark theme support
- **Smooth Animations**: Polished transitions using Framer Motion

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## JSON Format

InstantQuiz uses JSON format for quiz data. This provides a clean, extensible structure with support for rich metadata.

### Basic Structure

```json
{
  "questions": [
    {
      "question": "What is React?",
      "type": "single-choice",
      "options": ["A JavaScript library", "A CSS framework", "A database"],
      "correctAnswers": [0]
    }
  ]
}
```

### Question Types

#### 1. Single-Choice
One correct answer from multiple options.

```json
{
  "question": "What is the capital of France?",
  "type": "single-choice",
  "options": ["London", "Berlin", "Paris", "Madrid"],
  "correctAnswers": [0]
}
```

#### 2. Multi-Select
Multiple correct answers from options.

```json
{
  "question": "Which are programming languages?",
  "type": "multi-select",
  "options": ["Python", "HTML", "JavaScript", "CSS"],
  "correctAnswers": [0, 2]
}
```

#### 3. Fill-in-the-Blank
Text input with multiple acceptable answers.

```json
{
  "question": "What does HTML stand for?",
  "type": "fill-in-blank",
  "correctAnswers": ["HyperText Markup Language", "Hypertext Markup Language"]
}
```

### Enhanced Features (Optional)

Add rich metadata to your questions:

```json
{
  "id": "react-001",
  "question": "What is React?",
  "type": "single-choice",
  "options": ["A JavaScript library", "A CSS framework"],
  "correctAnswers": [0],
  "explanation": "React is a JavaScript library for building user interfaces, maintained by Meta.",
  "metadata": {
    "difficulty": "easy",
    "category": "React Basics",
    "tags": ["javascript", "react", "fundamentals"]
  }
}
```

#### Optional Fields:
- **`id`**: Unique identifier for the question
- **`explanation`**: Educational feedback shown after answering
- **`metadata.difficulty`**: Question difficulty (`easy`, `medium`, `hard`)
- **`metadata.category`**: Question category for organization
- **`metadata.tags`**: Array of tags for future filtering

### Complete Example

See [/public/example-quiz.json](public/example-quiz.json) for a complete example with all question types and optional fields.

### JSON Requirements

- **Required**: `questions` array
- **Each question must have**:
  - `question` (string)
  - `type` (`single-choice`, `multi-select`, or `fill-in-blank`)
  - `correctAnswers` (array of indices for MC, array of strings for fill-in-blank)
  - `options` (array with 2-5 items, required for single-choice and multi-select)

## How to Use

1. **Upload JSON**: Drag and drop your JSON file or click to browse
   - Click "Download Example" to get a sample quiz file
2. **Configure Quiz**: Set your preferences:
   - Number of questions
   - Enable/disable timer
   - Set passing score percentage
   - Toggle question/option randomization
3. **Take Quiz**: Answer questions with a distraction-free interface
   - Mark questions for review
   - Navigate between questions
   - Track your progress
   - Keyboard shortcuts (Arrow keys for navigation, A-E for answers)
4. **View Results**: See your score and review all questions
   - Filter by correct/incorrect/marked
   - See correct answers and explanations
   - Retake quiz or upload new file

## Technologies

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/         # React components
│   ├── ExamInterface.jsx        # Quiz taking interface
│   ├── FileUpload.jsx           # JSON upload with validation
│   ├── QuizConfiguration.jsx    # Quiz settings
│   ├── ResultsDashboard.jsx     # Results and review
│   ├── ProgressBar.jsx          # Question progress
│   ├── Timer.jsx                # Countdown timer
│   ├── ThemeToggle.jsx          # Light/dark mode
│   └── Toast.jsx                # Notifications
├── contexts/          # React contexts
│   ├── QuizContext.jsx          # Quiz state management
│   └── ThemeContext.jsx         # Theme state
├── utils/             # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # Entry point

public/
└── example-quiz.json  # Sample quiz with all features
```

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions.

### Deployment Process

1. Push changes to the `main` branch
2. GitHub Actions workflow automatically:
   - Builds the application
   - Deploys to GitHub Pages
3. Live site updates within a few minutes

### Manual Deployment

If needed, you can trigger a manual deployment from the Actions tab in GitHub.

## License

MIT
