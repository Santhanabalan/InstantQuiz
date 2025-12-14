# InstantQuiz

InstantQuiz is a modern, client-side quiz application that allows you to upload CSV files containing questions and generate interactive practice exams instantly. Built with React, Vite, and Tailwind CSS.

## 🚀 Live Demo

**[Try InstantQuiz](https://santhanabalan.github.io/InstantQuiz/)**

The application is automatically deployed to GitHub Pages on every push to the main branch.

## Features

- **CSV Upload**: Drag-and-drop CSV file upload with auto-detection of various formats
- **Quiz Configuration**: Customize question count, timer, passing score, and randomization options
- **Interactive Exam**: Distraction-free quiz-taking experience with progress tracking
- **Analytics Dashboard**: Detailed results with score visualization and question review
- **Responsive Design**: Mobile-first design that works on all devices
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

## CSV Format

Your CSV file should contain questions with the following structure:

```csv
Question Text,Option A,Option B,Option C,Option D,Correct Answer
What is the capital of France?,London,Berlin,Paris,Madrid,C
Which planet is known as the Red Planet?,Venus,Mars,Jupiter,Saturn,B
```

### CSV Requirements

- **6 columns**: Question Text, Option A, Option B, Option C, Option D, Correct Answer
- **Header row** (optional): The app auto-detects headers
- **Correct Answer**: Use A, B, C, or D (case-insensitive)
- **Format**: Standard CSV with comma separators

### Example CSV

An example CSV file is provided at `/public/example-quiz.csv` with 20 sample questions.

## How to Use

1. **Upload CSV**: Drag and drop your CSV file or click to browse
2. **Configure Quiz**: Set your preferences:
   - Number of questions
   - Enable/disable timer
   - Set passing score percentage
   - Toggle question/option randomization
3. **Take Quiz**: Answer questions with a distraction-free interface
   - Mark questions for review
   - Navigate between questions
   - Track your progress
4. **View Results**: See your score and review all questions
   - Filter by correct/incorrect/marked
   - See correct answers for wrong questions
   - Retake quiz or upload new file

## Technologies

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **PapaParse** - CSV parsing
- **Lucide React** - Icons

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
