# Implementation Tasks

## CSV Format Design
- [ ] Define flexible CSV format supporting 2-5 options per question
- [ ] Support variable columns: Question, Option1, Option2, [Option3], [Option4], [Option5], Correct Answer
- [ ] Define correct answer format:
  - Single letter (A, B, C) → single-choice MCQ
  - Comma-separated letters (A,C or B,D,E) → multi-select MCQ
- [ ] Document CSV format examples in README
- [ ] Create example CSV with variable options and multi-select questions

## CSV Parsing
- [ ] Update parser to detect number of non-empty option columns (2-5)
- [ ] Parse correct answer to determine question type (single vs multi-select)
- [ ] Store question type, options array, and correct answers array
- [ ] Validate that correct answer letters match available options
- [ ] Add error handling for invalid option counts or answer formats
- [ ] Maintain backward compatibility with existing 4-option format

## Data Model Updates
- [ ] Update question schema to support variable options
- [ ] Add `questionType` field: 'single-choice' | 'multi-select'
- [ ] Store options as array instead of optionA/B/C/D
- [ ] Store correct answers as array (even for single-choice)
- [ ] Update all question references to use new schema

## Exam Interface - UI Rendering
- [ ] Detect question type and render appropriate input
- [ ] Render radio buttons for single-choice questions
- [ ] Render checkboxes for multi-select questions
- [ ] Add visual indicator: "Select one answer" vs "Select all that apply"
- [ ] Do NOT reveal number of correct answers in UI
- [ ] Support 2-5 options dynamically in layout
- [ ] Update answer selection state to handle arrays

## Answer Validation
- [ ] Single-choice validation: exactly one answer selected
- [ ] Multi-select validation: at least one answer selected
- [ ] Update answer comparison logic for array-based answers
- [ ] Implement all-or-nothing scoring (default)
- [ ] Implement partial credit scoring (optional)
- [ ] Handle edge cases (no selection, over-selection)

## Scoring Calculation
- [ ] Update scoring for single-choice (unchanged behavior)
- [ ] Implement multi-select all-or-nothing scoring
- [ ] Implement multi-select partial credit:
  - Calculate correct selections / total correct answers
  - Penalize incorrect selections (optional)
- [ ] Add scoring mode configuration (all-or-nothing vs partial)
- [ ] Maintain backward compatibility with existing questions

## Analytics Dashboard
- [ ] Display variable number of options in review
- [ ] Show checkbox/radio indicator based on question type
- [ ] Display user's selected answers (highlight selected checkboxes/radios)
- [ ] Show all correct answers for multi-select
- [ ] Add partial credit score display (if applicable)
- [ ] Visual differentiation for partially correct answers
- [ ] Update filters to work with multi-select questions

## Quiz Configuration
- [ ] Add scoring mode option: "All or Nothing" vs "Partial Credit"
- [ ] Add help text explaining multi-select format
- [ ] Update configuration UI with scoring mode toggle
- [ ] Set sensible defaults (all-or-nothing for multi-select)

## Testing
- [ ] Test CSV with 2-option questions
- [ ] Test CSV with 3-option questions
- [ ] Test CSV with 5-option questions
- [ ] Test mixed question types in one CSV
- [ ] Test single-choice MCQ with one correct answer
- [ ] Test multi-select with 2, 3, 4 correct answers
- [ ] Test checkbox selection and deselection
- [ ] Test partial credit calculation accuracy
- [ ] Test all-or-nothing scoring accuracy
- [ ] Verify no UI reveals number of correct answers
- [ ] Test backward compatibility with existing 4-option CSVs
