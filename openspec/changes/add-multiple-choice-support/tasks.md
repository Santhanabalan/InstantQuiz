# Implementation Tasks

## CSV Format Design
- [ ] Define CSV format for multi-select questions (e.g., type column, pipe-separated correct answers)
- [ ] Document CSV format examples in README
- [ ] Create example multi-select quiz CSV file

## CSV Parsing
- [ ] Update CSV parser to detect question type (single/multiple)
- [ ] Parse multiple correct answers from CSV
- [ ] Validate CSV format for multi-select questions
- [ ] Add error handling for malformed multi-select data

## Exam Interface
- [ ] Add question type detection in ExamInterface
- [ ] Implement checkbox UI for multi-select questions
- [ ] Implement radio button UI for single-select questions (existing)
- [ ] Add visual indicator showing "Select all that apply"
- [ ] Update answer selection state to handle arrays
- [ ] Allow multiple answer selection for multi-select questions

## Answer Validation
- [ ] Update validation logic to compare array of selected answers
- [ ] Implement exact match scoring (all correct answers selected)
- [ ] Implement partial credit scoring option
- [ ] Add configuration option for partial credit vs all-or-nothing

## Scoring Calculation
- [ ] Update scoring algorithm to handle multi-select questions
- [ ] Calculate partial credit based on correct/incorrect selections
- [ ] Update score display to show partial credit
- [ ] Maintain backward compatibility with single-select questions

## Analytics Dashboard
- [ ] Display multi-select questions in review
- [ ] Show all correct answers for multi-select questions
- [ ] Show user's selected answers vs correct answers
- [ ] Update performance metrics for multi-select scoring
- [ ] Add visual differentiation for multi-select results

## Quiz Configuration
- [ ] Add configuration option for partial credit scoring
- [ ] Add help text explaining multi-select question format
- [ ] Update configuration UI to show scoring mode

## Testing
- [ ] Test CSV parsing with mixed single/multi-select questions
- [ ] Test checkbox selection and deselection
- [ ] Test partial credit calculation accuracy
- [ ] Test all-or-nothing scoring accuracy
- [ ] Verify backward compatibility with existing single-select quizzes
