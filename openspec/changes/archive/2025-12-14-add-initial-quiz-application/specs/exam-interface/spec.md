# Capability: Exam Interface

## Overview
The Exam Interface capability provides a distraction-free quiz-taking experience with question navigation, answer selection, timer countdown, progress tracking, and mark-for-review functionality.

## ADDED Requirements

### Requirement: Question Display
The system SHALL display one question at a time with four answer options (A, B, C, D).

#### Scenario: Question renders with all options
- **GIVEN** user is in Exam phase
- **WHEN** current question loads
- **THEN** question text is displayed prominently
- **AND** four answer options are shown with radio buttons
- **AND** options are labeled A, B, C, D
- **AND** no correct answer is revealed

#### Scenario: Question with long text displays properly
- **GIVEN** question or option text exceeds 200 characters
- **WHEN** question renders
- **THEN** text wraps appropriately without truncation
- **AND** content remains readable

### Requirement: Answer Selection
The system SHALL allow users to select one answer per question and change selection before submission.

#### Scenario: User selects an answer
- **GIVEN** no answer is selected for current question
- **WHEN** user clicks option B
- **THEN** option B becomes selected (radio button filled)
- **AND** answer is stored in exam state
- **AND** visual feedback confirms selection

#### Scenario: User changes answer selection
- **GIVEN** option B is selected
- **WHEN** user clicks option D
- **THEN** option B becomes unselected
- **AND** option D becomes selected
- **AND** answer is updated in exam state

### Requirement: Question Navigation
The system SHALL provide next and previous buttons to navigate between questions.

#### Scenario: User navigates to next question
- **GIVEN** user is on question 5 of 20
- **WHEN** user clicks "Next" button
- **THEN** question 6 displays with smooth transition
- **AND** previous answer for question 5 is preserved
- **AND** if question 6 was answered before, that answer is pre-selected

#### Scenario: User navigates to previous question
- **GIVEN** user is on question 10 of 20
- **WHEN** user clicks "Previous" button
- **THEN** question 9 displays with smooth transition
- **AND** previous answer for question 9 is shown

#### Scenario: First question disables previous button
- **GIVEN** user is on question 1
- **WHEN** user views navigation controls
- **THEN** "Previous" button is disabled
- **AND** "Next" button is enabled

#### Scenario: Last question shows submit button
- **GIVEN** user is on last question
- **WHEN** user views navigation controls
- **THEN** "Next" button is replaced with "Submit Quiz" button
- **AND** "Previous" button remains enabled

### Requirement: Progress Tracking
The system SHALL display a progress bar showing percentage of questions answered.

#### Scenario: Progress updates with answered questions
- **GIVEN** user has answered 8 out of 20 questions
- **WHEN** progress bar renders
- **THEN** progress shows 40% completion
- **AND** text displays "8 / 20 answered"

#### Scenario: Progress bar visual representation
- **GIVEN** progress is 40%
- **WHEN** user views progress bar
- **THEN** filled portion is 40% of bar width
- **AND** filled portion uses Indigo-600 color
- **AND** unfilled portion uses Slate-200 color

### Requirement: Countdown Timer (When Enabled)
The system SHALL display a countdown timer that updates every second when timer is enabled.

#### Scenario: Timer counts down each second
- **GIVEN** quiz starts with 30-minute timer
- **WHEN** 10 seconds elapse
- **THEN** timer displays "29:50"
- **AND** timer updates every second
- **AND** timer remains visible at all times (sticky)

#### Scenario: Timer reaches 5 minutes remaining
- **GIVEN** timer reaches 5:00 remaining
- **WHEN** user views timer
- **THEN** timer text changes to warning color (red/orange)
- **AND** subtle pulse animation appears

#### Scenario: Timer reaches zero
- **GIVEN** timer counts down to 00:00
- **WHEN** time expires
- **THEN** quiz is automatically submitted
- **AND** user transitions to Analytics phase
- **AND** warning modal appears "Time's up! Quiz submitted automatically"

#### Scenario: No timer when disabled in configuration
- **GIVEN** timer was disabled in configuration
- **WHEN** user views exam interface
- **THEN** no timer is displayed
- **AND** quiz has no time limit

### Requirement: Mark for Review
The system SHALL allow users to mark questions for later review.

#### Scenario: User marks question for review
- **GIVEN** user is on question 7
- **WHEN** user clicks "Mark for Review" checkbox
- **THEN** question 7 is flagged for review
- **AND** visual indicator shows marked state (star icon or flag)
- **AND** mark persists when navigating to other questions

#### Scenario: User unmarks question
- **GIVEN** question 7 is marked for review
- **WHEN** user unchecks "Mark for Review"
- **THEN** mark is removed from question 7
- **AND** visual indicator disappears

### Requirement: Quiz Submission
The system SHALL allow users to submit quiz with confirmation dialog.

#### Scenario: User submits quiz with all questions answered
- **GIVEN** user has answered all 20 questions
- **WHEN** user clicks "Submit Quiz" button
- **THEN** confirmation dialog appears
- **AND** dialog states "Submit your quiz? You cannot change answers after submission."
- **AND** dialog offers "Cancel" and "Submit" buttons

#### Scenario: User submits quiz with unanswered questions
- **GIVEN** user has answered 18 out of 20 questions
- **WHEN** user clicks "Submit Quiz" button
- **THEN** confirmation dialog appears
- **AND** dialog warns "You have 2 unanswered questions. Submit anyway?"
- **AND** unanswered question numbers are listed

#### Scenario: User confirms submission
- **GIVEN** confirmation dialog is open
- **WHEN** user clicks "Submit" button
- **THEN** results are calculated
- **AND** system transitions to Analytics phase
- **AND** end time is recorded

#### Scenario: User cancels submission
- **GIVEN** confirmation dialog is open
- **WHEN** user clicks "Cancel" button
- **THEN** dialog closes
- **AND** user remains in Exam phase
- **AND** can continue answering questions

### Requirement: Distraction-Free Layout
The system SHALL provide a clean, focused layout without unnecessary navigation or distractions.

#### Scenario: Minimal interface during exam
- **GIVEN** user is taking quiz
- **WHEN** user views exam interface
- **THEN** only essential elements are visible:
  - Current question and options
  - Navigation buttons
  - Progress bar
  - Timer (if enabled)
  - Mark for review option
- **AND** no external navigation links are shown
- **AND** background is clean with minimal distractions

### Requirement: Keyboard Navigation
The system SHALL support keyboard shortcuts for common actions.

#### Scenario: Keyboard navigation between questions
- **GIVEN** user is taking quiz
- **WHEN** user presses arrow keys (left/right)
- **THEN** previous/next question is displayed
- **AND** keyboard focus is maintained

#### Scenario: Keyboard answer selection
- **GIVEN** user is viewing question
- **WHEN** user presses keys A, B, C, or D
- **THEN** corresponding answer option is selected

### Requirement: Smooth Transitions
The system SHALL use Framer Motion animations for question transitions.

#### Scenario: Question change animation
- **GIVEN** user navigates to next question
- **WHEN** transition occurs
- **THEN** current question slides out to left
- **AND** new question slides in from right
- **AND** animation completes in < 300ms

## Data Model

### Exam State
```javascript
{
  currentQuestionIndex: number,           // 0-based index
  userAnswers: (string | null)[],        // Array of 'A'|'B'|'C'|'D'|null
  markedForReview: Set<number>,          // Set of question indices
  startTime: number,                      // timestamp
  endTime: number | null,                 // timestamp or null
  timeRemaining: number | null            // seconds remaining (if timer enabled)
}
```

## Non-Functional Requirements

- **Performance**: Question navigation response time < 100ms
- **Accessibility**: Full keyboard navigation support, ARIA labels for screen readers
- **Reliability**: Timer accuracy within ±1 second
- **Responsiveness**: Mobile-friendly touch targets (minimum 44x44px)
- **Visual Feedback**: All interactions provide immediate visual feedback
