# Proposal: Fix Post-Test Navigation Buttons

## Problem Statement

After completing a quiz and viewing the results, both the "Retake Quiz" and "Upload New CSV" buttons fail to navigate users to the expected screens. Instead, clicking these buttons does nothing or redirects to a blank page, leaving users unable to:
- Start a new quiz session with the same questions
- Upload a different CSV file to begin a new quiz

This creates a dead-end in the user flow after quiz completion.

## Root Cause Analysis

The issue stems from the `reset()` and `retakeQuiz()` functions in the QuizContext:

1. **retakeQuiz()**: Sets `phase` to `'configuration'` but doesn't properly reset the exam state when questions have been shuffled
2. **reset()**: Sets `phase` to `'ingestion'` but may not be properly cleaning up all state, especially when dealing with shuffled questions and modified question sets

The phase changes are occurring, but the component rendering logic in App.jsx may not be properly handling the transition from the analytics phase back to previous phases.

## Proposed Solution

### 1. Fix retakeQuiz() Function
- Ensure proper state reset for exam attempts
- Preserve original questions but clear all user responses
- Reset timer and review markers
- Verify phase transition to configuration works correctly

### 2. Fix reset() Function  
- Complete cleanup of all quiz-related state
- Clear questions, answers, and configuration
- Reset to initial ingestion phase
- Ensure FileUpload component renders properly

### 3. Verify Phase Transitions
- Test that phase changes trigger proper component rendering in App.jsx
- Ensure AnimatePresence properly handles phase transitions
- Verify no state conflicts between phases

## Acceptance Criteria

1. **Retake Quiz Button**:
   - Clicking "Retake Quiz" navigates user to QuizConfiguration screen
   - Previous quiz configuration is preserved (question count, timer settings, etc.)
   - All user answers are cleared
   - Marked questions are reset
   - User can reconfigure and start a fresh attempt

2. **Upload New CSV Button**:
   - Clicking "Upload New CSV" navigates user to FileUpload screen
   - All previous quiz data is completely cleared
   - User can upload a new CSV file
   - System behaves as if starting fresh

3. **No Blank Pages**:
   - No blank or broken screens appear during navigation
   - Smooth transitions between phases
   - All UI elements render correctly after navigation

## Impact Assessment

- **Severity**: High - Blocks users from continuing to use the application after completing a quiz
- **User Experience**: Critical - Core user flow is broken
- **Workaround**: User must refresh the page to restart
- **Scope**: Limited to ResultsDashboard and QuizContext

## Testing Requirements

1. Complete a quiz and click "Retake Quiz"
2. Complete a quiz and click "Upload New CSV"
3. Test with shuffled questions enabled
4. Test with shuffled options enabled
5. Test with timer enabled/disabled
6. Verify state is properly cleared in all scenarios

## Technical Debt

None introduced. This is a bug fix to restore intended functionality.

## Implementation Summary

**Status**: ✅ Completed

### Changes Made

1. **QuizContext.jsx**:
   - Added `originalQuestions` state to preserve unmodified questions
   - Modified `startQuiz()` to store original questions before shuffling/slicing
   - Updated `retakeQuiz()` to restore original questions when retaking
   - Updated `reset()` to clear originalQuestions

2. **ResultsDashboard.jsx**:
   - Added null check for `results` to prevent accessing properties on null during phase transitions
   - This prevents "Cannot read properties of null" error when navigating away from results

### Root Cause
The bug occurred because:
1. The original questions were being overwritten with shuffled/sliced versions in `startQuiz()`
2. When `retakeQuiz()` or `reset()` set `results` to null, the ResultsDashboard component tried to access `results.questionResults` before unmounting, causing a crash

### Solution
- Preserved original questions in a separate state variable
- Added defensive null check in ResultsDashboard component
- Properly reset all state when navigating between phases

### Testing Verified
- ✅ Both buttons navigate correctly
- ✅ No blank pages or errors
- ✅ Smooth transitions between all phases
- ✅ Works with shuffled questions and options
- ✅ Timer state properly reset
