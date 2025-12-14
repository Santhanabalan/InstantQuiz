# quiz-configuration Specification Delta

## ADDED Requirements

### Requirement: Metadata-Based Configuration Options
The system SHALL expose configuration options based on question metadata when available.

#### Scenario: Filter by difficulty (future enhancement)
- **GIVEN** loaded questions contain metadata.difficulty field
- **WHEN** user is in Configuration phase
- **THEN** system MAY display difficulty filter option
- **AND** user can select questions by difficulty level
- **NOTE**: This is a future enhancement enabled by JSON metadata

#### Scenario: Filter by category (future enhancement)
- **GIVEN** loaded questions contain metadata.category field
- **WHEN** user is in Configuration phase  
- **THEN** system MAY display category filter option
- **AND** user can select questions by category
- **NOTE**: This is a future enhancement enabled by JSON metadata

#### Scenario: Filter by tags (future enhancement)
- **GIVEN** loaded questions contain metadata.tags array
- **WHEN** user is in Configuration phase
- **THEN** system MAY display tag-based filtering
- **AND** user can select questions matching specific tags
- **NOTE**: This is a future enhancement enabled by JSON metadata

## MODIFIED Requirements

### Requirement: Display Question Count
The system SHALL display question count configuration based on JSON-validated questions.

**What Changed**: Question count slider now works with any valid JSON questions, not tied to CSV column count. Implementation is simplified since JSON validation is clearer than CSV row parsing.

#### Scenario: Question count reflects JSON questions
- **GIVEN** user has uploaded valid JSON file with N questions
- **WHEN** user is in Configuration phase
- **THEN** question count slider shows maximum of N questions
- **AND** slider works identically to previous CSV-based behavior

## Notes
- Most quiz-configuration requirements remain unchanged
- JSON metadata fields (difficulty, category, tags) enable future filtering features
- Current configuration options (question count, timer, shuffle, passing score) work identically with JSON
- No breaking changes to Configuration phase UI or behavior
