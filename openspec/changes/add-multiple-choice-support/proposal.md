# Change: Add Multiple-Choice Questions Support

## Why
Users need more flexible question formats to create comprehensive quizzes:
1. **Variable Options**: Not all questions need exactly 4 options - some work better with 2, 3, or 5 options
2. **Multiple Correct Answers**: Enable questions where multiple answers are correct (e.g., "Select all that apply")
3. **Single-Answer MCQ**: Support questions like "All of the above" that appear as multiple choice but have only one correct answer without revealing this in the UI

Currently, the application is rigid with exactly 4 options (A, B, C, D) and single correct answers, limiting quiz flexibility.

## What Changes

### CSV Format Enhancements
- Support variable number of options (2 to 5 options per question)
- Support multiple correct answers (e.g., "A,C,D" for questions with 3 correct answers)
- Auto-detect question type based on correct answer format:
  - Single letter (A, B, C, etc.) → Single-choice MCQ (radio buttons)
  - Multiple letters (A,C or B,D,E) → Multi-select MCQ (checkboxes)
- Backward compatible with existing 4-option CSV format

### UI Updates
- **Single-choice MCQ**: Radio buttons (one answer only)
- **Multi-select MCQ**: Checkboxes (multiple answers allowed)
- Visual indicator showing "Select one" vs "Select all that apply"
- Do not reveal number of correct answers in UI (preserve question integrity)

### Validation & Scoring
- Validate single-choice: exactly one answer selected
- Validate multi-select: one or more answers selected
- Multi-select scoring options:
  - All-or-nothing: only correct if all right answers selected
  - Partial credit: points awarded proportionally
- Support questions with single correct answer displayed as MCQ (no UI giveaway)

## Impact
- Affected specs: Modifies 3 existing capabilities
  - `csv-ingestion` - Support 2-5 options, multiple correct answers, flexible CSV parsing
  - `exam-interface` - Render radio/checkbox based on question type, multi-answer handling
  - `analytics-dashboard` - Display multi-select results, partial scoring visualization
- Affected code:
  - CSV parsing utility (detect option count, parse multi-answer format)
  - Question data model (support variable options, answer type)
  - ExamInterface component (conditional radio/checkbox rendering)
  - Answer validation logic (validate single vs multi-select)
  - Scoring calculation (all-or-nothing and partial credit modes)
  - ResultsDashboard (display multi-select question results)
