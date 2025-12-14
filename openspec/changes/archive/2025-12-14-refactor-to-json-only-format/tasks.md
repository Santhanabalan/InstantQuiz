# Tasks: Refactor to JSON-Only Format

## Phase 1: Data Structure Enhancement
- [x] Update JSON schema with optional fields (id, explanation, metadata)
- [x] Create enhanced example-quiz.json with all new fields demonstrated
- [ ] Document JSON schema in README or separate schema file
- [ ] Add JSON schema validation helper function

## Phase 2: Remove CSV Support
- [x] Remove PapaParse from package.json dependencies
- [x] Remove CSV parsing logic from FileUpload.jsx
- [x] Remove parseCSV function and all CSV-specific validation
- [x] Remove example-quiz.csv from public folder
- [x] Update file type filter to accept only .json files

## Phase 3: Enhance JSON Parsing
- [x] Simplify parseJSON function with cleaner validation
- [x] Add validation for new optional fields (id, explanation, metadata)
- [x] Improve error messages to be more specific to JSON format
- [ ] Add schema-level validation (if implementing JSON schema)

## Phase 4: Update QuizContext
- [x] Update question data structure to include optional fields
- [x] Ensure explanation and metadata are preserved through quiz flow
- [ ] Update any type definitions or prop-types if used

## Phase 5: Update UI Components
- [x] Update FileUpload drag-drop zone text to "Drop JSON file here"
- [x] Update file picker filter to .json only
- [x] Remove CSV-related UI hints and instructions
- [x] Add "Download Example JSON" button/link
- [x] Update all toast messages to reference JSON format

## Phase 6: Add Explanation Display (Optional Enhancement)
- [ ] Update ExamInterface to optionally show explanations after answering
- [x] Update ResultsDashboard to show explanations in question review
- [ ] Add UI toggle to show/hide explanations
- [ ] Style explanation section appropriately

## Phase 7: Migration Tools
- [ ] Create CSV to JSON converter script/tool
- [ ] Test converter with existing example-quiz.csv
- [ ] Add converter to project (as separate utility or web tool)

## Phase 8: Documentation
- [x] Update README with JSON-only instructions
- [x] Add JSON format specification section
- [x] Create migration guide for CSV users
- [x] Add examples for different question types
- [ ] Update any screenshots or demos

## Phase 9: Testing
- [x] Test single-choice questions with JSON
- [x] Test multi-select questions with JSON
- [x] Test fill-in-blank questions with JSON
- [x] Test validation errors with malformed JSON
- [x] Test with minimal JSON (no optional fields)
- [x] Test with full JSON (all optional fields)
- [x] Test file upload rejection of non-JSON files

## Phase 10: Cleanup
- [x] Remove unused imports (PapaParse)
- [x] Remove dead code and commented sections
- [x] Run linter and fix any issues
- [x] Verify no CSV references remain in codebase
- [ ] Update .gitignore if needed

## Validation
- [x] Run `openspec validate refactor-to-json-only-format --strict`
- [x] Verify all tests pass
- [x] Verify application builds without errors
- [x] Verify example JSON loads correctly
- [x] Verify all question types work end-to-end
