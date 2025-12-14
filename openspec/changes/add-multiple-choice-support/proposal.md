# Change: Add Multiple-Choice Questions Support

## Why
Users need the ability to create quizzes with questions that have multiple correct answers, allowing for more comprehensive assessment of knowledge. Currently, the application only supports single-answer questions where only one option is correct. Multiple-choice questions enable testing of broader understanding and recognition of multiple valid solutions.

## What Changes
- Add support for multi-select question type in CSV format
- Add checkbox UI for multiple-choice questions (instead of radio buttons)
- Add partial scoring option for multiple-choice questions
- Update CSV parsing to recognize and handle multi-select questions
- Update answer validation to check multiple selected answers
- Update results calculation to support partial credit scoring
- Add visual indicators to distinguish single-choice from multiple-choice
- Update analytics to show multi-select question performance

## Impact
- Affected specs: Modifies 3 existing capabilities
  - `csv-ingestion` - Add support for multi-select question format in CSV
  - `exam-interface` - Add checkbox UI and multi-select answer handling
  - `analytics-dashboard` - Update scoring and analytics for partial credit
- Affected code:
  - CSV parsing utility (parse multi-select format)
  - ExamInterface component (add checkbox rendering)
  - Answer validation logic (check multiple answers)
  - Scoring calculation (support partial credit)
  - ResultsDashboard (display multi-select results)

## Dependencies
- No new dependencies required
