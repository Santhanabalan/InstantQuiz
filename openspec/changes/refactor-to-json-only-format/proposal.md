# Proposal: Refactor to JSON-Only Format

## Change ID
`refactor-to-json-only-format`

## Type
Refactoring

## Status
Proposed

## Overview
Refactor the InstantQuiz application to exclusively support JSON format for quiz data ingestion, removing CSV parsing logic. This simplification will streamline the codebase, improve the data structure, and provide a more robust and maintainable foundation for future features.

## Motivation

### Current State
The application currently supports both CSV and JSON formats for quiz ingestion:
- **CSV Format**: Uses PapaParse with complex parsing logic to handle variable column counts (6-8), header detection, fill-in-blank detection via empty options, and pipe-separated acceptable answers
- **JSON Format**: Uses native JSON parsing with a cleaner, more explicit data structure supporting question types, options arrays, and correctAnswers indices
- **Dual Parsing Logic**: FileUpload component contains ~250 lines of parsing/validation code split between two formats
- **Inconsistent Internal Representation**: CSV and JSON parse to the same internal format but use different validation paths

### Problems with Current Approach
1. **Complexity**: CSV parsing requires extensive heuristics (header detection, fill-in-blank detection, variable columns)
2. **Ambiguity**: CSV format is inherently limited - question types must be inferred, multi-line text is problematic
3. **Maintenance Burden**: Two separate parsing pipelines to test, debug, and maintain
4. **Feature Limitations**: Adding new question types or metadata (difficulty, tags, explanations) requires awkward CSV column extensions
5. **Error Handling**: CSV parsing has more edge cases and error scenarios
6. **User Experience**: CSV users must remember column ordering, letter-based answer encoding (A,B,C), and format rules

### Benefits of JSON-Only
1. **Simplicity**: Single, explicit data format with clear structure
2. **Extensibility**: Easy to add new fields (difficulty, categories, explanations, images)
3. **Type Safety**: Explicit question types, no inference needed
4. **Better Validation**: JSON schema validation is more robust
5. **Modern Standard**: JSON is the web standard for data interchange
6. **Developer Experience**: Easier to generate programmatically, better tooling support
7. **Reduced Code**: Remove ~150 lines of CSV-specific parsing logic
8. **Better Error Messages**: JSON parsing errors are more precise

## Proposed Solution

### Phase 1: Update Data Structure
Enhance the JSON schema to be more intuitive and feature-rich:

**Current JSON Structure:**
```json
{
  "question": "What is React?",
  "type": "single-choice",
  "options": ["A JavaScript library", "A CSS framework"],
  "correctAnswers": [0]
}
```

**New JSON Structure:**
```json
{
  "id": "react-basics-001",
  "question": "What is React?",
  "type": "single-choice",
  "options": ["A JavaScript library", "A CSS framework"],
  "correctAnswers": [0],
  "explanation": "React is a JavaScript library for building user interfaces.",
  "metadata": {
    "difficulty": "easy",
    "category": "React Basics",
    "tags": ["javascript", "react", "fundamentals"]
  }
}
```

**Key Changes:**
- **`id`** (optional): User-provided question identifier for tracking
- **`explanation`** (optional): Shown after answering for learning purposes
- **`metadata`** (optional): Object containing difficulty, category, tags for future filtering/sorting

### Phase 2: Remove CSV Support
1. Remove PapaParse dependency from package.json
2. Remove CSV parsing logic from FileUpload component (~150 lines)
3. Remove example-quiz.csv from public folder
4. Update FileUpload to only accept .json files
5. Simplify validation logic to single JSON schema validator

### Phase 3: Update UI/UX
1. Update drag-drop zone to show "Drop JSON file here"
2. Update file picker filter to .json only
3. Add "Download Example" button that downloads example-quiz.json
4. Update error messages to reference JSON format
5. Consider adding JSON format help/documentation modal

### Phase 4: Migration Guide
Create migration documentation:
1. Provide conversion script/tool (CSV → JSON converter)
2. Update README with JSON format specification
3. Add schema documentation
4. Provide multiple example JSON files for different use cases

## Impact Analysis

### Breaking Changes
- **CSV files will no longer work**: Users with existing CSV files must convert to JSON
- **Migration Required**: Provide clear migration path and tools

### Affected Components
- `FileUpload.jsx` - Major refactor, remove CSV logic
- `QuizContext.jsx` - Update to handle new optional fields
- `ExamInterface.jsx` - Optionally display explanations after answers
- `ResultsDashboard.jsx` - Optionally display explanations in review
- `package.json` - Remove PapaParse dependency
- Public assets - Remove CSV example, enhance JSON example

### Affected Specs
- `csv-ingestion` - Rename to `json-ingestion`, completely rewrite
- `quiz-configuration` - Minor updates for new metadata fields
- `exam-interface` - Add explanation display capability
- `analytics-dashboard` - Add explanation in review mode

## Risks and Mitigation

### Risk 1: User Migration Burden
**Mitigation**: 
- Provide easy-to-use CSV → JSON conversion tool
- Keep example CSV in documentation for reference
- Add prominent migration guide in README

### Risk 2: Loss of Simplicity for Simple Quizzes
**Mitigation**:
- Make all new fields optional
- Provide minimal example for simple use cases
- JSON format is still human-readable and editable

### Risk 3: Breaking Existing User Workflows
**Mitigation**:
- This is a pre-1.0 refactor while user base is small
- Clear communication in release notes
- Version the change appropriately (0.x → 0.y breaking change)

## Success Criteria
1. ✅ CSV parsing code completely removed
2. ✅ PapaParse dependency removed
3. ✅ JSON-only upload working with validation
4. ✅ Example JSON file updated with new fields
5. ✅ All tests passing with JSON format
6. ✅ Migration guide published
7. ✅ CSV → JSON conversion tool provided
8. ✅ Code size reduced by ~150 lines
9. ✅ All question types (single-choice, multi-select, fill-in-blank) working with JSON

## Timeline
- **Spec Writing**: 1 day
- **Implementation**: 2-3 days
- **Testing**: 1 day
- **Documentation**: 1 day
- **Total**: ~1 week

## Alternatives Considered

### Alternative 1: Keep Both Formats
**Pros**: No breaking changes, maximum compatibility
**Cons**: Continued maintenance burden, complexity doesn't justify dual support for a simple app

### Alternative 2: Convert CSV to JSON Internally
**Pros**: Keep CSV interface, use JSON internally
**Cons**: Still requires maintaining CSV parsing, doesn't address extensibility issues

### Alternative 3: Use YAML
**Pros**: More human-friendly than JSON for hand-editing
**Cons**: Requires additional parser, less universal than JSON, overkill for this use case

## Decision
Proceed with JSON-only approach. The benefits of simplicity, maintainability, and extensibility far outweigh the migration cost, especially at this early stage of the project.

## Stakeholder Review
- [ ] Product/UX Review
- [ ] Engineering Review
- [ ] Documentation Review

## Related Changes
- Depends on: None (all current features are complete)
- Blocks: Future features requiring rich metadata
- Related to: All archived changes that built the current CSV support

## Notes
- This refactor sets foundation for future enhancements like difficulty-based filtering, category selection, and rich explanations
- JSON format aligns with modern web standards and API-first thinking
- Consider adding JSON schema validation file for IDE autocomplete support
