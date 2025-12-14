# Change: Add Fill-in-the-Blank Questions Support

## Why
Users need the ability to test recall and comprehension through fill-in-the-blank questions where respondents type answers directly instead of selecting from options. This question type is valuable for testing exact knowledge, terminology, and reduces guessing compared to multiple-choice. Currently, the application only supports option-based questions.

## What Changes
- Add support for fill-in-the-blank question type in CSV format
- Add text input UI for fill-in-the-blank questions
- Add flexible answer matching (exact, case-insensitive, partial)
- Add support for multiple acceptable answers
- Update CSV parsing to recognize and handle fill-in-blank questions
- Update answer validation to compare text inputs
- Add answer trimming and normalization for fair comparison
- Update analytics to show fill-in-blank performance
- Add option to show acceptable answers in review

## Impact
- Affected specs: Modifies 3 existing capabilities
  - `csv-ingestion` - Add support for fill-in-blank format in CSV
  - `exam-interface` - Add text input UI and answer handling
  - `analytics-dashboard` - Update review to show text answers
- Affected code:
  - CSV parsing utility (parse fill-in-blank format)
  - ExamInterface component (add text input rendering)
  - Answer validation logic (text comparison with fuzzy matching)
  - Scoring calculation (handle text answer scoring)
  - ResultsDashboard (display fill-in-blank results)

## Dependencies
- No new dependencies required (can add fuzzy matching library if advanced matching needed)
