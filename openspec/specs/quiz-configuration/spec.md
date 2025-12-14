# quiz-configuration Specification

## Purpose
TBD - created by archiving change add-initial-quiz-application. Update Purpose after archive.
## Requirements
### Requirement: Question Count Selection
The system SHALL allow users to select how many questions to include in the quiz session.

#### Scenario: User adjusts question count slider
- **GIVEN** user has uploaded CSV with 50 questions
- **WHEN** user moves question count slider
- **THEN** selected value updates in real-time
- **AND** value displays next to slider (e.g., "25 questions")
- **AND** minimum value is 1
- **AND** maximum value is total available questions (50)

#### Scenario: Default question count set to all questions
- **GIVEN** user enters Configuration phase
- **WHEN** configuration interface loads
- **THEN** question count defaults to all available questions
- **AND** slider is at maximum position

### Requirement: Timer Configuration
The system SHALL allow users to enable/disable a countdown timer and set duration in minutes.

#### Scenario: User enables timer
- **GIVEN** timer is disabled
- **WHEN** user toggles timer switch to ON
- **THEN** timer duration input becomes enabled
- **AND** default timer value is 30 minutes

#### Scenario: User sets custom timer duration
- **GIVEN** timer is enabled
- **WHEN** user enters "45" in timer input
- **THEN** quiz will run with 45-minute countdown
- **AND** input validates minimum of 1 minute
- **AND** input validates maximum of 999 minutes

#### Scenario: User disables timer
- **GIVEN** timer is enabled
- **WHEN** user toggles timer switch to OFF
- **THEN** timer duration input becomes disabled
- **AND** quiz will run without time limit

### Requirement: Passing Score Configuration
The system SHALL allow users to set a passing score percentage for the quiz.

#### Scenario: User sets passing score
- **GIVEN** user is configuring quiz
- **WHEN** user enters "70" in passing score input
- **THEN** passing score is set to 70%
- **AND** results will indicate pass/fail based on this threshold

#### Scenario: Passing score validation
- **GIVEN** user is entering passing score
- **WHEN** user enters value outside 0-100 range
- **THEN** input displays validation error
- **AND** "Start Quiz" button is disabled
- **AND** error message reads "Passing score must be between 0 and 100"

#### Scenario: Default passing score
- **GIVEN** user enters Configuration phase
- **WHEN** configuration interface loads
- **THEN** passing score defaults to 70%

### Requirement: Question Randomization
The system SHALL allow users to shuffle the order of questions.

#### Scenario: User enables question shuffling
- **GIVEN** shuffle questions toggle is OFF
- **WHEN** user toggles shuffle questions to ON
- **THEN** questions will be randomized when exam starts
- **AND** toggle displays enabled state

#### Scenario: Question order preserved when shuffle disabled
- **GIVEN** shuffle questions toggle is OFF
- **WHEN** exam starts
- **THEN** questions appear in original CSV order

### Requirement: Answer Option Randomization
The system SHALL allow users to shuffle the order of answer options (A, B, C, D).

#### Scenario: User enables option shuffling
- **GIVEN** shuffle options toggle is OFF
- **WHEN** user toggles shuffle options to ON
- **THEN** answer options will be randomized for each question
- **AND** correct answer mapping is preserved

#### Scenario: Options order preserved when shuffle disabled
- **GIVEN** shuffle options toggle is OFF
- **WHEN** exam starts
- **THEN** options appear in order: A, B, C, D

### Requirement: Configuration Summary Display
The system SHALL display a summary of selected configuration before starting quiz.

#### Scenario: Configuration summary shows all settings
- **GIVEN** user has configured quiz settings
- **WHEN** user views configuration screen
- **THEN** summary panel displays:
  - Number of questions selected
  - Timer status and duration (if enabled)
  - Passing score percentage
  - Randomization settings (questions and/or options)

### Requirement: Start Quiz Action
The system SHALL validate configuration and transition to Exam phase when user starts quiz.

#### Scenario: Valid configuration allows quiz start
- **GIVEN** all configuration inputs are valid
- **WHEN** user clicks "Start Quiz" button
- **THEN** quiz data is prepared per configuration
- **AND** randomization is applied if enabled
- **AND** system transitions to Exam phase with animation

#### Scenario: Invalid configuration prevents quiz start
- **GIVEN** passing score is invalid (e.g., 150)
- **WHEN** user attempts to click "Start Quiz"
- **THEN** button is disabled
- **AND** validation errors are displayed
- **AND** user remains in Configuration phase

### Requirement: Back Navigation
The system SHALL allow users to return to Ingestion phase to upload different CSV.

#### Scenario: User goes back to upload new file
- **GIVEN** user is in Configuration phase
- **WHEN** user clicks "Back" or "Upload Different File" button
- **THEN** system confirms navigation (warns about losing configuration)
- **AND** on confirmation, returns to Ingestion phase
- **AND** clears current quiz data

