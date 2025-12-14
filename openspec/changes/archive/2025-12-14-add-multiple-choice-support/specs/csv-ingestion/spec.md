# Spec Delta: CSV Ingestion - Multiple-Choice Support

## MODIFIED Requirements

### Requirement: Flexible Option Count Support
The CSV ingestion capability SHALL support questions with 2 to 5 options per question.

#### Scenario: Parse question with 2 options
- **GIVEN** a CSV file with a question row
- **AND** the row has: "Question text,Option A,Option B,,,A"
- **AND** options C, D, E are empty
- **WHEN** the file is uploaded and parsed
- **THEN** the question is stored with 2 options
- **AND** the question type is determined by the correct answer format
- **AND** the question is available for quiz configuration

#### Scenario: Parse question with 5 options
- **GIVEN** a CSV file with a question row
- **AND** the row has: "Question text,Opt A,Opt B,Opt C,Opt D,Opt E,B,D"
- **WHEN** the file is uploaded and parsed
- **THEN** the question is stored with 5 options
- **AND** correct answers are ["B", "D"]
- **AND** the question is marked as multi-select

#### Scenario: Backward compatibility with 4-option format
- **GIVEN** a CSV file with traditional 4-option questions
- **AND** the row has: "Question,A,B,C,D,C"
- **WHEN** the file is uploaded and parsed
- **THEN** the question is stored with 4 options
- **AND** existing functionality works unchanged

### Requirement: Multi-Select Question Detection
The CSV ingestion capability SHALL automatically detect multi-select questions based on correct answer format.

#### Scenario: Detect single-choice question
- **GIVEN** a CSV file with a question row
- **AND** the correct answer column contains "B"
- **WHEN** the file is uploaded and parsed
- **THEN** the question type is set to "single-choice"
- **AND** the question will render with radio buttons
- **AND** correct answers array contains ["B"]

#### Scenario: Detect multi-select question
- **GIVEN** a CSV file with a question row
- **AND** the correct answer column contains "A,C,D"
- **WHEN** the file is uploaded and parsed
- **THEN** the question type is set to "multi-select"
- **AND** the question will render with checkboxes
- **AND** correct answers array contains ["A", "C", "D"]

#### Scenario: Single correct answer appears as MCQ
- **GIVEN** a CSV with question "All of the above"
- **AND** the correct answer column contains "D"
- **WHEN** the file is uploaded and parsed
- **THEN** the question type is set to "single-choice"
- **AND** UI does NOT reveal there is only one correct answer
- **AND** the question appears identical to other MCQ questions

### Requirement: Multi-Answer Validation
The CSV parser SHALL validate question data integrity for variable options and multiple correct answers.

#### Scenario: Invalid correct answer reference
- **GIVEN** a CSV with a question having 3 options (A, B, C)
- **AND** correct answers contains "A,D"
- **WHEN** the file is uploaded and parsed
- **THEN** an error is displayed: "Invalid correct answer 'D' - question only has options A, B, C"
- **AND** the file upload is rejected

#### Scenario: Empty correct answer
- **GIVEN** a CSV with a question
- **AND** the correct answer column is empty
- **WHEN** the file is uploaded and parsed
- **THEN** an error is displayed: "Correct answer is required"
- **AND** the file upload is rejected

#### Scenario: Duplicate correct answers
- **GIVEN** a CSV with multi-select question
- **AND** correct answers contains "A,A,B"
- **WHEN** the file is uploaded and parsed
- **THEN** duplicates are removed
- **AND** correct answers array contains ["A", "B"]
- **AND** the question is processed successfully
