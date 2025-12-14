# Spec Delta: CSV Ingestion - Multiple-Choice Support

## MODIFIED Requirements

### Requirement: CSV Format Parsing
The CSV ingestion capability SHALL support parsing both single-choice and multiple-choice question formats.

#### Scenario: Parse multi-select question
- **GIVEN** a CSV file with multi-select questions
- **AND** the CSV has columns: question,options,correct_answers,type
- **AND** a row contains type="multiple"
- **AND** correct_answers contains "A|C"
- **WHEN** the file is uploaded and parsed
- **THEN** the question is marked as multi-select
- **AND** the correct answers are stored as an array ["A", "C"]
- **AND** the question is available for quiz configuration

#### Scenario: Backward compatibility with single-select
- **GIVEN** a CSV file without a type column
- **AND** correct_answers contains single values
- **WHEN** the file is uploaded and parsed
- **THEN** all questions are treated as single-select
- **AND** the existing quiz functionality works unchanged

### Requirement: Multi-Answer Validation
The CSV parser SHALL validate multi-select question data integrity.

#### Scenario: Invalid correct answer reference
- **GIVEN** a CSV with a multi-select question
- **AND** the question has options A, B, C, D
- **AND** correct_answers contains "A|E"
- **WHEN** the file is uploaded and parsed
- **THEN** an error is displayed
- **AND** the error message indicates "Option E does not exist"
- **AND** the file upload is rejected
