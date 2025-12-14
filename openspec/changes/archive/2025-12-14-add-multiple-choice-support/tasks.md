# Implementation Tasks

## CSV Format Design
- [x] Define flexible CSV format supporting 2-5 options per question
- [x] Support variable columns: Question, Option1, Option2, [Option3], [Option4], [Option5], Correct Answer
- [x] Define correct answer format:
  - Single letter (A, B, C) → single-choice MCQ
  - Comma-separated letters (A,C or B,D,E) → multi-select MCQ
- [x] Document CSV format examples in README
- [x] Create example CSV with variable options and multi-select questions

## CSV Parsing
- [x] Update parser to detect number of non-empty option columns (2-5)
- [x] Parse correct answer to determine question type (single vs multi-select)
- [x] Store question type, options array, and correct answers array
- [x] Validate that correct answer letters match available options
- [x] Add error handling for invalid option counts or answer formats
- [x] Maintain backward compatibility with existing 4-option format

## Data Model Updates
- [x] Update question schema to support variable options
- [x] Add `questionType` field: 'single-choice' | 'multi-select'
- [x] Store options as array instead of optionA/B/C/D
- [x] Store correct answers as array (even for single-choice)
- [x] Update all question references to use new schema

## Exam Interface - UI Rendering
- [x] Detect question type and render appropriate input
- [x] Render radio buttons for single-choice questions
- [x] Render checkboxes for multi-select questions
- [x] Add visual indicator: "Select one answer" vs "Select all that apply"
- [x] Do NOT reveal number of correct answers in UI
- [x] Support 2-5 options dynamically in layout
- [x] Update answer selection state to handle arrays

## Answer Validation
- [x] Single-choice validation: exactly one answer selected
- [x] Multi-select validation: at least one answer selected
- [x] Update answer comparison logic for array-based answers
- [x] Implement all-or-nothing scoring (default)
- [x] Implement partial credit scoring (optional)
- [x] Handle edge cases (no selection, over-selection)

## Scoring Calculation
- [x] Update scoring for single-choice (unchanged behavior)
- [x] Implement multi-select all-or-nothing scoring
- [x] Implement multi-select partial credit:
  - Calculate correct selections / total correct answers
  - Penalize incorrect selections (optional)
- [x] Add scoring mode configuration (all-or-nothing vs partial)
- [x] Maintain backward compatibility with existing questions

## Analytics Dashboard
- [x] Display variable number of options in review
- [x] Show checkbox/radio indicator based on question type
- [x] Display user's selected answers (highlight selected checkboxes/radios)
- [x] Show all correct answers for multi-select
- [x] Add partial credit score display (if applicable)
- [x] Visual differentiation for partially correct answers
- [x] Update filters to work with multi-select questions

## Quiz Configuration
- [x] Add scoring mode option: "All or Nothing" vs "Partial Credit"
- [x] Add help text explaining multi-select format
- [x] Update configuration UI with scoring mode toggle
- [x] Set sensible defaults (all-or-nothing for multi-select)

## JSON Format Support
- [x] Add JSON file parser alongside CSV
- [x] Create example-quiz.json with all question types
- [x] Update UI to accept both .json and .csv files
- [x] Document JSON format in FileUpload component

## Testing
- [x] Test CSV with 2-option questions
- [x] Test CSV with 3-option questions
- [x] Test CSV with 5-option questions
- [x] Test mixed question types in one CSV
- [x] Test single-choice MCQ with one correct answer
- [x] Test multi-select with 2, 3, 4 correct answers
- [x] Test checkbox selection and deselection
- [x] Test partial credit calculation accuracy
- [x] Test all-or-nothing scoring accuracy
- [x] Verify no UI reveals number of correct answers
- [x] Test backward compatibility with existing 4-option CSVs
