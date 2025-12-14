# Project Context

## Purpose
InstantQuiz is a production-ready, client-side quiz engine application that allows users to upload CSV files containing quiz questions and generate interactive practice exams instantly. The goal is to provide a modern, polished, and trustworthy SaaS-like experience for creating and taking customizable quizzes.

## Tech Stack
- **React** - Using Vite as the build tool
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library for smooth transitions
- **PapaParse** - CSV parsing library
- **State Management** - React Context or Zustand

## Project Conventions

### Code Style
- **Font**: Inter font family
- **Color Palette**: Slate/Indigo color scheme for a "Clean Professional" theme
- **Mobile-First**: Responsive design approach
- **Component Structure**: Separate, modular components (FileUpload, QuizCard, ResultDashboard, etc.)
- **Styling**: All styling done using Tailwind CSS utility classes

### Architecture Patterns
- **Fully Client-Side**: No backend required - all processing happens in the browser
- **State Management**: Centralized quiz flow management using React Context (QuizContext.jsx)
- **Component-Based**: Modular React components for different phases of the quiz flow
- **Four-Phase Flow**:
  1. Ingestion (CSV upload)
  2. Configuration (quiz settings)
  3. Exam (taking the quiz)
  4. Analytics (results dashboard)

### Testing Strategy
[To be defined as project develops]

### Git Workflow
[To be defined based on team preferences]

## Domain Context

### CSV Data Format
The application expects CSV files with the following columns:
- Question Text
- Option A
- Option B
- Option C
- Option D
- Correct Answer

The app should gracefully handle variations in CSV format with auto-detection or column mapping interface.

### Quiz Features
- **Drag-and-drop** file upload zone
- **Customizable sessions**:
  - Question count (slider control)
  - Timer (toggle on/off, set minutes)
  - Passing score (percentage)
  - Randomization (shuffle questions/options)
- **During Exam**:
  - Distraction-free interface
  - Sticky timer and progress bar
  - "Mark for Review" functionality
  - Smooth transitions with Framer Motion
- **Analytics Dashboard**:
  - Donut chart/progress ring for final score
  - Detailed breakdown (Correct vs Incorrect)
  - Filterable question review list

## Important Constraints
- **No Backend**: All functionality must work entirely client-side
- **Browser-Only**: All data processing and storage happens in the browser
- **CSV-Based**: Data input is limited to CSV file format
- **Performance**: Must handle CSV parsing and quiz rendering smoothly

## External Dependencies
- **PapaParse**: Robust CSV parsing library for handling various CSV formats
- **Lucide React**: Icon set for UI elements
- **Framer Motion**: Animation library for transitions and micro-interactions

## UI/UX Requirements
- **Toast Notifications**: Error feedback (e.g., "Invalid CSV format")
- **Micro-interactions**: 
  - Hover/active states on buttons
  - Visual cues for correct/incorrect answers (green/red borders during review)
- **Accessibility**: Modern, polished interface that looks trustworthy
- **Visual Feedback**: Distinct states for different quiz phases
