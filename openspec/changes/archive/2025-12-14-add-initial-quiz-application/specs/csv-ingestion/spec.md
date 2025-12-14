# Capability: CSV Ingestion

## Overview
The CSV Ingestion capability allows users to upload CSV files containing quiz questions through a drag-and-drop interface. It validates and parses CSV data using PapaParse, providing clear error feedback for invalid formats.

## ADDED Requirements

### Requirement: Drag-and-Drop File Upload
The system SHALL provide a drag-and-drop zone for CSV file upload with visual feedback.

#### Scenario: User drags file over drop zone
- **GIVEN** user has a CSV file selected
- **WHEN** user drags file over the drop zone
- **THEN** drop zone displays highlighted state
- **AND** visual indicator shows file can be dropped

#### Scenario: User drops valid CSV file
- **GIVEN** user drags CSV file over drop zone
- **WHEN** user releases mouse to drop file
- **THEN** system accepts the file
- **AND** parsing begins immediately
- **AND** loading indicator appears

#### Scenario: User drops non-CSV file
- **GIVEN** user drags non-CSV file over drop zone
- **WHEN** user releases mouse to drop file
- **THEN** system rejects the file
- **AND** error toast displays "Please upload a CSV file"

### Requirement: Manual File Selection
The system SHALL provide a clickable upload button as alternative to drag-and-drop.

#### Scenario: User clicks upload area
- **GIVEN** user is in Ingestion phase
- **WHEN** user clicks the upload zone
- **THEN** system opens file picker dialog
- **AND** file picker filters to .csv files only

#### Scenario: User selects file from picker
- **GIVEN** file picker is open
- **WHEN** user selects a CSV file
- **THEN** system accepts the file
- **AND** parsing begins immediately

### Requirement: CSV Parsing and Validation
The system SHALL parse CSV files using PapaParse and validate structure.

#### Scenario: Valid CSV format parsed successfully
- **GIVEN** user uploads valid CSV file with 6 columns
- **WHEN** parsing completes
- **THEN** system extracts all questions
- **AND** stores questions in QuizContext
- **AND** transitions to Configuration phase
- **AND** success toast displays "X questions loaded successfully"

#### Scenario: Invalid CSV structure detected
- **GIVEN** user uploads CSV with incorrect number of columns
- **WHEN** parsing completes
- **THEN** system displays error toast
- **AND** error message indicates "Invalid CSV format: Expected 6 columns"
- **AND** user remains in Ingestion phase

#### Scenario: CSV with invalid correct answers
- **GIVEN** user uploads CSV with correct answers not in [A, B, C, D]
- **WHEN** validation runs
- **THEN** system displays error toast
- **AND** error message indicates "Invalid correct answer in row X: must be A, B, C, or D"
- **AND** user remains in Ingestion phase

#### Scenario: Empty CSV file
- **GIVEN** user uploads empty CSV file
- **WHEN** parsing completes
- **THEN** system displays error toast "CSV file is empty"
- **AND** user remains in Ingestion phase

### Requirement: Toast Notifications
The system SHALL display toast notifications for upload feedback (success/error).

#### Scenario: Success toast appears and auto-dismisses
- **GIVEN** CSV parsing succeeds
- **WHEN** success toast displays
- **THEN** toast shows green background with success icon
- **AND** toast displays for 3 seconds
- **AND** toast automatically dismisses

#### Scenario: Error toast appears and persists
- **GIVEN** CSV parsing fails
- **WHEN** error toast displays
- **THEN** toast shows red background with error icon
- **AND** toast remains visible until user dismisses
- **AND** toast includes close button

### Requirement: Upload Zone Visual States
The system SHALL provide distinct visual states for idle, hover, drag-over, and processing.

#### Scenario: Idle state appearance
- **GIVEN** no file is being uploaded
- **WHEN** user views upload zone
- **THEN** zone displays dashed border
- **AND** upload icon is visible
- **AND** instructional text reads "Drag and drop CSV file here, or click to browse"

#### Scenario: Processing state appearance
- **GIVEN** file is being parsed
- **WHEN** user views upload zone
- **THEN** zone displays loading spinner
- **AND** text reads "Processing CSV file..."
- **AND** drag-drop is disabled during processing

### Requirement: CSV Format Specification
The system SHALL accept CSV files with exactly 6 columns in the following order: Question Text, Option A, Option B, Option C, Option D, Correct Answer.

#### Scenario: Standard CSV format accepted
- **GIVEN** CSV has header row: "Question Text,Option A,Option B,Option C,Option D,Correct Answer"
- **WHEN** file is parsed
- **THEN** system skips header row
- **AND** parses all subsequent rows as questions

#### Scenario: CSV without headers accepted
- **GIVEN** CSV has no header row but 6 columns
- **WHEN** file is parsed
- **THEN** system treats first row as question
- **AND** parses all rows successfully

### Requirement: Error Recovery
The system SHALL allow users to retry upload after errors without page refresh.

#### Scenario: Upload new file after error
- **GIVEN** previous upload failed with error
- **WHEN** user uploads a new valid CSV
- **THEN** error state clears
- **AND** new file is parsed successfully
- **AND** system transitions to Configuration

## Data Model

### Expected CSV Columns
1. **Question Text** (string): The question to be asked
2. **Option A** (string): First answer choice
3. **Option B** (string): Second answer choice
4. **Option C** (string): Third answer choice
5. **Option D** (string): Fourth answer choice
6. **Correct Answer** (string): Must be "A", "B", "C", or "D"

### Example CSV Row
```csv
"What is the capital of France?","London","Berlin","Paris","Madrid","C"
```

## Non-Functional Requirements

- **Performance**: Parse 1000 questions in < 500ms
- **File Size**: Support CSV files up to 5MB
- **Accessibility**: Upload zone keyboard accessible (Enter/Space to trigger file picker)
- **Visual Feedback**: All state changes visible within 100ms
