# Tasks: Refactor to JSON-Only Format

## Phase 1: Data Structure Enhancement
- [ ] Update JSON schema with optional fields (id, explanation, metadata)
- [ ] Create enhanced example-quiz.json with all new fields demonstrated
- [ ] Document JSON schema in README or separate schema file
- [ ] Add JSON schema validation helper function

## Phase 2: Remove CSV Support
- [ ] Remove PapaParse from package.json dependencies
- [ ] Remove CSV parsing logic from FileUpload.jsx
- [ ] Remove parseCSV function and all CSV-specific validation
- [ ] Remove example-quiz.csv from public folder
- [ ] Update file type filter to accept only .json files

## Phase 3: Enhance JSON Parsing
- [ ] Simplify parseJSON function with cleaner validation
- [ ] Add validation for new optional fields (id, explanation, metadata)
- [ ] Improve error messages to be more specific to JSON format
- [ ] Add schema-level validation (if implementing JSON schema)

## Phase 4: Update QuizContext
- [ ] Update question data structure to include optional fields
- [ ] Ensure explanation and metadata are preserved through quiz flow
- [ ] Update any type definitions or prop-types if used

## Phase 5: Update UI Components
- [ ] Update FileUpload drag-drop zone text to "Drop JSON file here"
- [ ] Update file picker filter to .json only
- [ ] Remove CSV-related UI hints and instructions
- [ ] Add "Download Example JSON" button/link
- [ ] Update all toast messages to reference JSON format

## Phase 6: Add Explanation Display (Optional Enhancement)
- [ ] Update ExamInterface to optionally show explanations after answering
- [ ] Update ResultsDashboard to show explanations in question review
- [ ] Add UI toggle to show/hide explanations
- [ ] Style explanation section appropriately

## Phase 7: Migration Tools
- [ ] Create CSV to JSON converter script/tool
- [ ] Test converter with existing example-quiz.csv
- [ ] Add converter to project (as separate utility or web tool)

## Phase 8: Documentation
- [ ] Update README with JSON-only instructions
- [ ] Add JSON format specification section
- [ ] Create migration guide for CSV users
- [ ] Add examples for different question types
- [ ] Update any screenshots or demos

## Phase 9: Testing
- [ ] Test single-choice questions with JSON
- [ ] Test multi-select questions with JSON
- [ ] Test fill-in-blank questions with JSON
- [ ] Test validation errors with malformed JSON
- [ ] Test with minimal JSON (no optional fields)
- [ ] Test with full JSON (all optional fields)
- [ ] Test file upload rejection of non-JSON files

## Phase 10: Cleanup
- [ ] Remove unused imports (PapaParse)
- [ ] Remove dead code and commented sections
- [ ] Run linter and fix any issues
- [ ] Verify no CSV references remain in codebase
- [ ] Update .gitignore if needed

## Validation
- [ ] Run `openspec validate refactor-to-json-only-format --strict`
- [ ] Verify all tests pass
- [ ] Verify application builds without errors
- [ ] Verify example JSON loads correctly
- [ ] Verify all question types work end-to-end
