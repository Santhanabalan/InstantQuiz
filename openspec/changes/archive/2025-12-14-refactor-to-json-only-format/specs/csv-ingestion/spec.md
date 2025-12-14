# csv-ingestion Specification Delta

## REMOVED Requirements

### Requirement: CSV Parsing and Validation
**Rationale**: Moving to JSON-only format removes the need for CSV parsing logic.

The system previously parsed CSV files using PapaParse and validated structure including:
- Header detection
- Variable column count (6-8)
- Fill-in-blank detection via empty options
- Pipe-separated acceptable answers
- Letter-based answer encoding (A, B, C, D, E)

This requirement is completely removed in favor of JSON parsing.

### Requirement: CSV-Specific File Upload
**Rationale**: File upload now only accepts JSON format.

The following scenarios are removed:
- User drops valid CSV file
- User drops non-CSV file (becomes non-JSON file)
- CSV with invalid correct answers
- Empty CSV file
- CSV structure validation
- CSV row-by-row parsing

## RENAMED Requirements

### Requirement: Drag-and-Drop File Upload
**Old Name**: Drag-and-Drop File Upload  
**New Name**: Drag-and-Drop JSON File Upload

The requirement remains the same but is now scoped to JSON files only.

#### Scenario: User drops valid JSON file
- **GIVEN** user drags JSON file over drop zone
- **WHEN** user releases mouse to drop file
- **THEN** system accepts the file
- **AND** parsing begins immediately
- **AND** loading indicator appears

#### Scenario: User drops non-JSON file
- **GIVEN** user drags non-JSON file over drop zone
- **WHEN** user releases mouse to drop file
- **THEN** system rejects the file
- **AND** error toast displays "Please upload a JSON file"

### Requirement: Manual File Selection
**No changes to core requirement**, but file picker now filters to .json only.

#### Scenario: User clicks upload area
- **GIVEN** user is in Ingestion phase
- **WHEN** user clicks the upload zone
- **THEN** system opens file picker dialog
- **AND** file picker filters to .json files only

## ADDED Requirements

### Requirement: JSON Schema Validation
The system SHALL validate uploaded JSON files against the quiz data schema.

#### Scenario: Valid JSON with required fields only
- **GIVEN** user uploads JSON with questions array containing valid questions
- **WHEN** each question has required fields (question, type, options/correctAnswers)
- **THEN** system accepts the file
- **AND** all questions are loaded successfully
- **AND** success toast displays "X questions loaded successfully"

#### Scenario: Valid JSON with optional fields
- **GIVEN** user uploads JSON with questions containing optional fields
- **WHEN** questions include id, explanation, or metadata fields
- **THEN** system accepts and preserves all optional fields
- **AND** optional data is available for display during quiz

#### Scenario: JSON missing required "questions" array
- **GIVEN** user uploads JSON without "questions" property
- **WHEN** parsing completes
- **THEN** system displays error toast
- **AND** error message reads "Invalid JSON format: missing 'questions' array"

#### Scenario: JSON with empty questions array
- **GIVEN** user uploads JSON with empty questions array
- **WHEN** parsing completes
- **THEN** system displays error toast
- **AND** error message reads "No questions found in JSON file"

#### Scenario: Question missing required fields
- **GIVEN** user uploads JSON with a question missing "question" text
- **WHEN** validation runs
- **THEN** system displays error toast
- **AND** error message indicates "Question X: Missing or invalid question text"

#### Scenario: Question with invalid type
- **GIVEN** user uploads JSON with question type not in [single-choice, multi-select, fill-in-blank]
- **WHEN** validation runs
- **THEN** system displays error toast
- **AND** error message indicates "Question X: Invalid type 'Y'"

#### Scenario: Single/multi-choice question validation
- **GIVEN** user uploads single-choice or multi-select question
- **WHEN** question has options array with 2-5 items
- **AND** correctAnswers contains valid indices (0-based)
- **THEN** question is accepted

#### Scenario: Fill-in-blank question validation
- **GIVEN** user uploads fill-in-blank question
- **WHEN** question has correctAnswers array with at least one string
- **THEN** question is accepted
- **AND** all acceptable answers are stored

#### Scenario: Invalid correctAnswers indices
- **GIVEN** user uploads multiple-choice question
- **WHEN** correctAnswers contains index >= options.length
- **THEN** system displays error toast
- **AND** error message indicates "Question X: Invalid correctAnswers indices"

### Requirement: JSON Data Structure Support
The system SHALL support enhanced JSON data structure with optional enrichment fields.

#### Scenario: Question ID preservation
- **GIVEN** question includes optional "id" field
- **WHEN** questions are loaded
- **THEN** system preserves the id
- **AND** id can be used for tracking and analytics

#### Scenario: Explanation storage
- **GIVEN** question includes optional "explanation" field
- **WHEN** questions are loaded
- **THEN** system preserves the explanation
- **AND** explanation is available for post-answer display

#### Scenario: Metadata storage
- **GIVEN** question includes optional "metadata" object
- **WHEN** metadata contains difficulty, category, or tags
- **THEN** system preserves all metadata fields
- **AND** metadata is available for future filtering/sorting

### Requirement: Example JSON Download
The system SHALL provide a way to download example JSON file.

#### Scenario: User requests example JSON
- **GIVEN** user is in Ingestion phase
- **WHEN** user clicks "Download Example" button/link
- **THEN** system downloads example-quiz.json
- **AND** example demonstrates all question types
- **AND** example shows optional fields

## MODIFIED Requirements

### Requirement: Upload Zone Visual States
The system SHALL update upload zone text to reflect JSON-only support while maintaining existing visual states.

**What Changed**: Instructional text now references JSON instead of CSV.

#### Scenario: Idle state appearance
- **GIVEN** no file is being uploaded
- **WHEN** user views upload zone
- **THEN** zone displays dashed border
- **AND** upload icon is visible
- **AND** instructional text reads "Drag and drop JSON file here, or click to browse"

### Requirement: File Type Filtering
The system SHALL accept only JSON files for upload, rejecting all other file types.

**What Changed**: File picker and drag-drop now only accept .json files instead of .csv and .json.

#### Scenario: File picker shows JSON only
- **GIVEN** user opens file picker
- **WHEN** file picker dialog appears
- **THEN** only .json files are selectable
- **AND** file filter shows "JSON files (*.json)"

#### Scenario: Non-JSON file rejected
- **GIVEN** user attempts to upload .csv, .txt, or other non-JSON file
- **WHEN** file is selected or dropped
- **THEN** system rejects the file
- **AND** error toast displays "Please upload a JSON file"
