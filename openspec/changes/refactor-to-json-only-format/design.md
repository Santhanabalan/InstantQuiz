# Design: Refactor to JSON-Only Format

## Architecture Overview

### Current Architecture
```
User uploads CSV/JSON
    ↓
FileUpload Component
    ├→ parseCSV() - PapaParse + complex validation
    └→ parseJSON() - JSON.parse + validation
    ↓
Internal Question Format
    ↓
QuizContext.loadQuestions()
```

### New Architecture
```
User uploads JSON
    ↓
FileUpload Component
    └→ parseJSON() - JSON.parse + schema validation
    ↓
Enhanced Question Format (with optional fields)
    ↓
QuizContext.loadQuestions()
```

## Data Structure Design

### Enhanced JSON Schema

```typescript
interface QuizData {
  questions: Question[];
  metadata?: {
    title?: string;
    description?: string;
    version?: string;
  };
}

interface Question {
  // Required fields
  question: string;
  type: 'single-choice' | 'multi-select' | 'fill-in-blank';
  
  // Type-specific required fields
  options?: string[];          // Required for single-choice and multi-select
  correctAnswers: number[] | string[];  // indices for MC, strings for fill-in-blank
  
  // Optional enhancement fields
  id?: string;                 // User-provided identifier
  explanation?: string;        // Educational feedback
  metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    tags?: string[];
    points?: number;           // For weighted scoring
    timeLimit?: number;        // Per-question time limit in seconds
  };
}
```

### Example JSON Files

**Minimal Example (simple quiz):**
```json
{
  "questions": [
    {
      "question": "What is 2+2?",
      "type": "single-choice",
      "options": ["3", "4", "5"],
      "correctAnswers": [1]
    }
  ]
}
```

**Full Example (rich quiz):**
```json
{
  "metadata": {
    "title": "React Fundamentals Quiz",
    "description": "Test your knowledge of React basics",
    "version": "1.0"
  },
  "questions": [
    {
      "id": "react-001",
      "question": "What is React?",
      "type": "single-choice",
      "options": [
        "A JavaScript library",
        "A CSS framework",
        "A database"
      ],
      "correctAnswers": [0],
      "explanation": "React is a JavaScript library for building user interfaces, maintained by Meta.",
      "metadata": {
        "difficulty": "easy",
        "category": "React Basics",
        "tags": ["javascript", "react", "fundamentals"],
        "points": 10
      }
    },
    {
      "id": "react-002",
      "question": "Which hooks manage state?",
      "type": "multi-select",
      "options": ["useState", "useEffect", "useReducer", "useContext"],
      "correctAnswers": [0, 2],
      "explanation": "useState and useReducer are the primary hooks for managing component state.",
      "metadata": {
        "difficulty": "medium",
        "category": "React Hooks",
        "tags": ["hooks", "state-management"],
        "points": 20
      }
    },
    {
      "id": "react-003",
      "question": "What does JSX stand for?",
      "type": "fill-in-blank",
      "correctAnswers": [
        "JavaScript XML",
        "Javascript XML",
        "javascript xml"
      ],
      "explanation": "JSX stands for JavaScript XML, a syntax extension for JavaScript.",
      "metadata": {
        "difficulty": "easy",
        "category": "React Basics",
        "tags": ["jsx", "syntax"],
        "points": 10
      }
    }
  ]
}
```

## Implementation Details

### JSON Validation Function

```javascript
const validateQuizJSON = (json) => {
  const errors = [];
  
  // Top-level validation
  if (!json.questions || !Array.isArray(json.questions)) {
    return { valid: false, error: 'Invalid JSON format: missing "questions" array' };
  }
  
  if (json.questions.length === 0) {
    return { valid: false, error: 'No questions found in JSON file' };
  }
  
  // Per-question validation
  const validatedQuestions = [];
  
  json.questions.forEach((q, index) => {
    const rowNum = index + 1;
    
    // Required: question text
    if (!q.question || typeof q.question !== 'string') {
      errors.push(`Question ${rowNum}: Missing or invalid question text`);
      return;
    }
    
    // Required: type
    const validTypes = ['single-choice', 'multi-select', 'fill-in-blank'];
    if (!q.type || !validTypes.includes(q.type)) {
      errors.push(`Question ${rowNum}: Invalid type "${q.type}"`);
      return;
    }
    
    // Type-specific validation
    if (q.type === 'fill-in-blank') {
      // Fill-in-blank: validate correctAnswers as string array
      if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
        errors.push(`Question ${rowNum}: Fill-in-blank must have correctAnswers array`);
        return;
      }
      
      if (!q.correctAnswers.every(ans => typeof ans === 'string')) {
        errors.push(`Question ${rowNum}: correctAnswers must be strings for fill-in-blank`);
        return;
      }
      
      validatedQuestions.push({
        id: q.id || `q-${Date.now()}-${index}`,
        questionText: q.question,
        type: 'fill-in-blank',
        acceptableAnswers: q.correctAnswers,
        explanation: q.explanation,
        metadata: q.metadata,
      });
    } else {
      // Multiple choice: validate options and correctAnswers
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) {
        errors.push(`Question ${rowNum}: Options must be array with 2-5 items`);
        return;
      }
      
      if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
        errors.push(`Question ${rowNum}: Missing correctAnswers array`);
        return;
      }
      
      // Validate indices
      const invalidIndices = q.correctAnswers.filter(idx => 
        typeof idx !== 'number' || idx < 0 || idx >= q.options.length
      );
      
      if (invalidIndices.length > 0) {
        errors.push(`Question ${rowNum}: Invalid correctAnswers indices`);
        return;
      }
      
      validatedQuestions.push({
        id: q.id || `q-${Date.now()}-${index}`,
        questionText: q.question,
        type: q.type,
        options: q.options,
        correctAnswers: q.correctAnswers.map(idx => String.fromCharCode(65 + idx)),
        explanation: q.explanation,
        metadata: q.metadata,
      });
    }
  });
  
  if (errors.length > 0) {
    return { valid: false, error: errors[0] };
  }
  
  if (validatedQuestions.length === 0) {
    return { valid: false, error: 'No valid questions found' };
  }
  
  return { valid: true, questions: validatedQuestions };
};
```

### FileUpload Component Refactor

**Before (mixed CSV/JSON):**
- ~420 lines total
- ~250 lines for parsing logic
- Two separate parser functions
- Complex CSV heuristics

**After (JSON-only):**
- ~250 lines total (40% reduction)
- ~100 lines for parsing logic
- Single JSON parser
- Clean schema validation

### Migration Strategy

#### CSV to JSON Converter Tool

Create a standalone utility that can be:
1. Embedded in the app as a "Convert CSV" feature
2. Provided as a Node.js script
3. Offered as a web tool

```javascript
// csv-to-json-converter.js
import Papa from 'papaparse';
import fs from 'fs';

function convertCSVtoJSON(csvFilePath, jsonOutputPath) {
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  
  Papa.parse(csvContent, {
    complete: (results) => {
      const data = results.data.filter(row => 
        row.length >= 6 && row.some(cell => cell && cell.trim())
      );
      
      const hasHeader = data[0].some(cell => 
        typeof cell === 'string' && 
        (cell.toLowerCase().includes('question') || 
         cell.toLowerCase().includes('option'))
      );
      
      const questionRows = hasHeader ? data.slice(1) : data;
      const questions = [];
      
      questionRows.forEach((row) => {
        const cells = row.map(cell => 
          typeof cell === 'string' ? cell.trim() : String(cell || '')
        );
        
        const questionText = cells[0];
        const correctAnswerRaw = cells[cells.length - 1];
        const optionCells = cells.slice(1, cells.length - 1);
        
        const nonEmptyOptions = optionCells.filter(opt => {
          const normalized = (opt || '').toLowerCase().trim();
          return normalized !== '' && normalized !== 'blank';
        });
        
        if (nonEmptyOptions.length === 0) {
          // Fill-in-blank
          const acceptableAnswers = correctAnswerRaw
            .split('|')
            .map(ans => ans.trim())
            .filter(ans => ans.length > 0);
          
          questions.push({
            question: questionText,
            type: 'fill-in-blank',
            correctAnswers: acceptableAnswers
          });
        } else {
          // Multiple choice
          const correctAnswersParsed = correctAnswerRaw
            .split(',')
            .map(ans => ans.trim().toUpperCase())
            .filter(ans => ans.length > 0);
          
          const correctIndices = [...new Set(correctAnswersParsed)]
            .map(letter => letter.charCodeAt(0) - 65);
          
          const questionType = correctIndices.length > 1 ? 'multi-select' : 'single-choice';
          
          questions.push({
            question: questionText,
            type: questionType,
            options: nonEmptyOptions,
            correctAnswers: correctIndices
          });
        }
      });
      
      const output = { questions };
      fs.writeFileSync(jsonOutputPath, JSON.stringify(output, null, 2));
      console.log(`✅ Converted ${questions.length} questions to ${jsonOutputPath}`);
    }
  });
}

// Usage: node csv-to-json-converter.js input.csv output.json
const [,, csvPath, jsonPath] = process.argv;
convertCSVtoJSON(csvPath, jsonPath || 'quiz.json');
```

## Component Changes

### FileUpload.jsx
- Remove `parseCSV` function entirely
- Simplify `parseJSON` to use validation helper
- Update file type checking to `.json` only
- Update UI text references
- Remove PapaParse import

### QuizContext.jsx
- Add support for optional fields (explanation, metadata, id)
- Ensure these fields are preserved through shuffle operations
- No breaking changes to existing API

### ExamInterface.jsx (Enhancement)
- Add optional explanation display after answer submission
- Toggle to show/hide explanations
- Style explanation with distinct background

### ResultsDashboard.jsx (Enhancement)
- Display explanations in question review section
- Show question metadata if available
- Optional difficulty/category badges

## Testing Strategy

### Unit Tests
- JSON validation with valid questions
- JSON validation with missing required fields
- JSON validation with invalid types
- JSON validation with malformed indices
- Optional field preservation

### Integration Tests
- End-to-end quiz flow with JSON
- All three question types
- Minimal JSON (required fields only)
- Full JSON (all optional fields)
- File upload rejection

### Migration Tests
- CSV to JSON converter accuracy
- Converter handles all question types
- Converter preserves question count
- Converter handles edge cases

## Rollout Plan

### Phase 1: Development
1. Create branch `refactor/json-only`
2. Implement changes per tasks.md
3. Create converter tool
4. Update documentation

### Phase 2: Testing
1. Manual testing with example files
2. Automated test suite
3. Migration tool verification

### Phase 3: Documentation
1. Update README
2. Create migration guide
3. Publish examples
4. Add JSON schema file

### Phase 4: Release
1. Merge to main
2. Tag release as breaking change (0.x.0 → 0.y.0)
3. Publish release notes with migration guide
4. Archive change proposal

## Future Enhancements Enabled

With JSON metadata, future features become possible:
1. **Difficulty-based practice mode**: Filter by easy/medium/hard
2. **Category selection**: Study specific topics
3. **Tag-based quizzing**: Practice by skills/keywords
4. **Weighted scoring**: Different point values per question
5. **Question pools**: Random selection from categories
6. **Learning mode**: Show explanations immediately
7. **Spaced repetition**: Track performance per question ID
8. **Rich media**: Add image URLs to metadata
9. **Time limits**: Per-question timers
10. **Question dependencies**: Conditional questions based on previous answers

## Performance Considerations

- JSON parsing is faster than CSV parsing (native vs library)
- Validation is simpler and more direct
- Smaller bundle size without PapaParse (~40KB saved)
- Memory usage unchanged (same internal data structure)

## Backwards Compatibility

**This is a breaking change**. No backwards compatibility provided. Mitigation:
- Converter tool handles migration
- Clear documentation
- Example files provided
- Early in project lifecycle (pre-1.0)
