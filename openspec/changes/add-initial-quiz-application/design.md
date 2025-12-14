# Technical Design

## Architecture Overview

InstantQuiz follows a client-side, single-page application architecture with a four-phase user flow managed by React Context.

### Technology Choices

**React + Vite**
- Rationale: Fast development experience, optimized builds, modern JavaScript tooling
- Alternative considered: Create React App (rejected: slower, less flexible)

**Tailwind CSS**
- Rationale: Utility-first approach, rapid prototyping, consistent design system
- Alternative considered: CSS Modules (rejected: more verbose, harder to maintain consistency)

**React Context for State**
- Rationale: Built-in, sufficient for linear quiz flow, no external dependencies
- Alternative considered: Zustand (deferred: can migrate later if needed)

**PapaParse**
- Rationale: Robust CSV parsing, handles edge cases, streaming support
- Alternative considered: Manual parsing (rejected: error-prone, reinventing wheel)

**Framer Motion**
- Rationale: Declarative animations, smooth transitions, React-first
- Alternative considered: CSS transitions (rejected: less control, harder to orchestrate)

## State Management Strategy

### QuizContext Structure
```javascript
{
  // Current phase
  phase: 'ingestion' | 'configuration' | 'exam' | 'analytics',
  
  // Raw CSV data
  questions: [],
  
  // Quiz configuration
  config: {
    questionCount: number,
    timerEnabled: boolean,
    timerMinutes: number,
    passingScore: number,
    shuffleQuestions: boolean,
    shuffleOptions: boolean
  },
  
  // Exam state
  currentQuestionIndex: number,
  userAnswers: [],
  markedForReview: Set,
  startTime: timestamp,
  
  // Results
  score: number,
  results: []
}
```

### Phase Transitions
1. **Ingestion → Configuration**: After successful CSV parse
2. **Configuration → Exam**: After user clicks "Start Quiz"
3. **Exam → Analytics**: After user submits quiz
4. **Analytics → Ingestion**: After "Upload New CSV"

## Component Architecture

### Component Hierarchy
```
App
├── QuizProvider (Context)
└── PhaseRouter
    ├── FileUpload (Ingestion)
    ├── QuizConfiguration (Configuration)
    ├── ExamInterface (Exam)
    │   ├── Timer
    │   ├── ProgressBar
    │   └── QuizCard
    └── ResultsDashboard (Analytics)
        ├── ScoreRing
        ├── ScoreBreakdown
        └── QuestionReview
```

### Component Responsibilities

**FileUpload**
- Drag-and-drop zone with visual feedback
- CSV file validation and parsing
- Error handling with toast notifications
- Transition to Configuration phase

**QuizConfiguration**
- Form controls for all quiz settings
- Settings validation
- Prepare exam data (shuffle if needed)
- Transition to Exam phase

**ExamInterface**
- Distraction-free layout
- Question navigation
- Answer selection and storage
- Timer countdown (if enabled)
- Progress tracking
- Quiz submission

**ResultsDashboard**
- Score calculation and visualization
- Question-by-question review
- Filtering and navigation
- Reset/restart options

## Data Flow Patterns

### CSV Parsing Flow
1. User drops/selects CSV file
2. PapaParse processes file
3. Validate structure (6 expected columns)
4. Transform to internal question format
5. Store in QuizContext
6. Transition to Configuration

### Quiz Session Flow
1. User configures settings
2. Apply randomization if enabled
3. Initialize exam state (answers array, start time)
4. User answers questions
5. On submit, calculate results
6. Store results in context
7. Transition to Analytics

## Styling Conventions

### Color Palette (Tailwind)
- **Primary**: Indigo (600, 700)
- **Neutral**: Slate (50-900)
- **Success**: Green (500, 600)
- **Error**: Red (500, 600)
- **Background**: Slate-50
- **Text**: Slate-900, Slate-600

### Component Patterns
- Cards: `bg-white rounded-lg shadow-md border border-slate-200`
- Buttons: `px-4 py-2 rounded-md font-medium transition-colors`
- Primary CTA: `bg-indigo-600 hover:bg-indigo-700 text-white`
- Secondary: `bg-slate-100 hover:bg-slate-200 text-slate-700`

### Responsive Breakpoints
- Mobile: default (< 640px)
- Tablet: sm (≥ 640px)
- Desktop: md (≥ 768px), lg (≥ 1024px)

## Animation Strategy

### Framer Motion Usage
- **Phase transitions**: Fade + slide combinations
- **Question navigation**: Slide left/right with staggered content
- **Toast notifications**: Slide in from top with auto-dismiss
- **Score reveal**: Animated progress ring with easing

### Performance Considerations
- Use `initial`, `animate`, `exit` variants
- Leverage `AnimatePresence` for exit animations
- Keep animations under 300ms for snappiness
- Disable animations on reduced-motion preference

## CSV Format Specification

### Expected Structure
```csv
Question Text,Option A,Option B,Option C,Option D,Correct Answer
"What is 2+2?","2","3","4","5","C"
```

### Validation Rules
1. Minimum 1 question required
2. Exactly 6 columns expected
3. Correct Answer must be A, B, C, or D
4. Empty cells handled gracefully (treat as empty string)

### Error Handling
- Invalid format: Show error toast, stay in Ingestion
- Empty file: Show error toast
- Missing columns: Show error toast with guidance
- Invalid correct answers: Show error toast with row numbers

## Browser Compatibility

### Target Support
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

### Storage Strategy
- Session state: In-memory only (QuizContext)
- No localStorage/sessionStorage (ephemeral by design)
- Future enhancement: Optional localStorage for draft sessions

## Performance Targets

- **CSV Parse**: < 500ms for 1000 questions
- **Phase Transition**: < 300ms animation duration
- **Question Navigation**: < 100ms response time
- **Initial Load**: < 2s on broadband

## Security Considerations

- **Client-Side Only**: No data leaves user's browser
- **File Upload**: Only accept .csv files
- **XSS Prevention**: React's built-in escaping
- **No External APIs**: Zero network requests after initial load
