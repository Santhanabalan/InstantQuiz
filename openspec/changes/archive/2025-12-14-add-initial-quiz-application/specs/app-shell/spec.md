# Capability: Application Shell

## Overview
The application shell provides the core structure, state management, and phase routing for the InstantQuiz application. It manages the four-phase quiz flow and maintains centralized application state using React Context.

## ADDED Requirements

### Requirement: Phase-Based Navigation
The system SHALL implement a four-phase linear navigation flow: Ingestion → Configuration → Exam → Analytics.

#### Scenario: User progresses through quiz flow
- **GIVEN** the application is loaded
- **WHEN** user completes CSV upload
- **THEN** system transitions to Configuration phase
- **AND WHEN** user configures settings and starts quiz
- **THEN** system transitions to Exam phase
- **AND WHEN** user completes and submits quiz
- **THEN** system transitions to Analytics phase

#### Scenario: User restarts from Analytics
- **GIVEN** user is viewing results in Analytics phase
- **WHEN** user clicks "Upload New CSV"
- **THEN** system resets state and returns to Ingestion phase

### Requirement: Centralized State Management
The system SHALL maintain all quiz data in a centralized QuizContext accessible to all components.

#### Scenario: State persists across phase transitions
- **GIVEN** user has uploaded CSV and configured settings
- **WHEN** user transitions to Exam phase
- **THEN** quiz questions and configuration remain accessible
- **AND** user answers are tracked throughout the exam

#### Scenario: State resets on new quiz
- **GIVEN** user is viewing results
- **WHEN** user chooses to upload new CSV
- **THEN** all state (questions, config, answers, results) is cleared

### Requirement: Smooth Phase Transitions
The system SHALL provide animated transitions between phases using Framer Motion.

#### Scenario: Phase transition animation
- **GIVEN** user triggers phase change
- **WHEN** transition begins
- **THEN** current phase fades out with slide animation
- **AND** new phase fades in with slide animation
- **AND** total transition duration is less than 300ms

### Requirement: Application Layout
The system SHALL provide a clean, centered layout with Inter font family and Slate/Indigo color scheme.

#### Scenario: Application renders with consistent styling
- **GIVEN** application loads
- **WHEN** user views any phase
- **THEN** content is centered on page
- **AND** Inter font is applied to all text
- **AND** background uses Slate-50 color
- **AND** primary actions use Indigo-600 color

### Requirement: Responsive Design
The system SHALL adapt layout for mobile, tablet, and desktop screen sizes.

#### Scenario: Mobile layout adaptation
- **GIVEN** viewport width is less than 640px
- **WHEN** user views any phase
- **THEN** layout adjusts to single-column mobile view
- **AND** touch-friendly spacing is applied
- **AND** all interactive elements remain accessible

#### Scenario: Desktop layout optimization
- **GIVEN** viewport width is 1024px or greater
- **WHEN** user views any phase
- **THEN** layout uses optimal width constraints
- **AND** content is centered with appropriate margins

### Requirement: Context Provider API
The system SHALL expose quiz state and actions through a QuizProvider component.

#### Scenario: Components access quiz context
- **GIVEN** component is wrapped in QuizProvider
- **WHEN** component uses useQuiz hook
- **THEN** component receives current state
- **AND** component receives action functions
- **AND** state updates trigger component re-renders

## Data Model

### Quiz Context State
```javascript
{
  phase: 'ingestion' | 'configuration' | 'exam' | 'analytics',
  questions: Question[],
  config: QuizConfig,
  examState: ExamState,
  results: QuizResults | null
}
```

### Question Structure
```javascript
{
  id: string,
  questionText: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctAnswer: 'A' | 'B' | 'C' | 'D'
}
```

### QuizConfig Structure
```javascript
{
  questionCount: number,
  timerEnabled: boolean,
  timerMinutes: number,
  passingScore: number,
  shuffleQuestions: boolean,
  shuffleOptions: boolean
}
```

### ExamState Structure
```javascript
{
  currentQuestionIndex: number,
  userAnswers: (string | null)[],
  markedForReview: Set<number>,
  startTime: number | null,
  endTime: number | null
}
```

## Non-Functional Requirements

- **Performance**: Phase transitions complete in < 300ms
- **Accessibility**: Keyboard navigation between phases supported
- **Browser Support**: Works in last 2 versions of Chrome, Firefox, Safari, Edge
