# Spec Delta: Exam Interface - Fill-in-the-Blank Support

## MODIFIED Requirements

### Requirement: Question Rendering
The exam interface SHALL render different UI controls based on question type, including text inputs for fill-in-the-blank questions.

#### Scenario: Render fill-in-blank question
- **GIVEN** the quiz contains a fill-in-blank question
- **WHEN** the question is displayed
- **THEN** a text input field is shown
- **AND** a placeholder shows "Type your answer"
- **AND** instructions indicate "Fill in the blank"
- **AND** the input has appropriate styling

### Requirement: Answer Input Handling
The exam interface SHALL capture and store user answers for all question types including text input.

#### Scenario: User types fill-in-blank answer
- **GIVEN** a fill-in-blank question is displayed
- **WHEN** the user types "React" in the input field
- **THEN** the answer state is updated with "React"
- **AND** the input shows the typed text
- **AND** the answer is stored for later validation

#### Scenario: User modifies fill-in-blank answer
- **GIVEN** the user has typed "Vue" as an answer
- **WHEN** the user changes the text to "React"
- **THEN** the answer state is updated to "React"
- **AND** the previous answer is replaced
- **AND** the new answer is stored for validation

### Requirement: Answer Validation for Text Input
The exam interface SHALL validate fill-in-blank answers against acceptable answers with configurable matching modes.

#### Scenario: Exact match validation
- **GIVEN** a fill-in-blank question with acceptable answer "React"
- **AND** matching mode is "exact"
- **WHEN** the user submits answer "React"
- **THEN** the answer is marked as correct
- **WHEN** the user submits answer "react"
- **THEN** the answer is marked as incorrect

#### Scenario: Case-insensitive validation
- **GIVEN** a fill-in-blank question with acceptable answer "React"
- **AND** matching mode is "case-insensitive"
- **WHEN** the user submits answer "react"
- **THEN** the answer is marked as correct
- **WHEN** the user submits answer "REACT"
- **THEN** the answer is marked as correct

#### Scenario: Multiple acceptable answers
- **GIVEN** a fill-in-blank question with acceptable answers ["React", "ReactJS", "React.js"]
- **AND** matching mode is "case-insensitive"
- **WHEN** the user submits answer "reactjs"
- **THEN** the answer is marked as correct
- **WHEN** the user submits answer "react.js"
- **THEN** the answer is marked as correct
