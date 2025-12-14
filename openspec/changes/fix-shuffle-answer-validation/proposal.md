# Bug Fix: Shuffle Answer Validation

## Problem

When users enable the shuffle option for quiz questions, the answer validation incorrectly marks answers as correct. The CSV ingestion stores the correct answer by index (e.g., answer is at position 2), but when options are shuffled, the correct answer moves to a different index while the stored answer index remains unchanged, causing validation to check the wrong option.

## Solution

Keep the CSV ingestion structure unchanged (index-based to avoid duplicate options). When shuffling is enabled, track the original correct answer value, shuffle the options, then update the correct answer index to match the new position of the correct answer in the shuffled array.

## Impact

- **Type**: Bug Fix
- **Severity**: High - affects quiz scoring accuracy
- **Users Affected**: All users who enable shuffle option
- **Breaking Changes**: None

## Implementation

1. Keep CSV ingestion unchanged (answer stored by index)
2. During shuffle: capture correct answer value before shuffling
3. After shuffling options: find new index of correct answer
4. Update answer index to reflect new shuffled position
5. Validation continues to work with index-based comparison

## Affected Components

- Quiz Configuration (shuffle option handling)
- Exam Interface (shuffle logic and answer index updates)

## Testing

- Verify correct answer validation with shuffle enabled
- Verify correct answer validation with shuffle disabled
- Test with various question types and answer formats
- Ensure existing quizzes still work correctly

## Timeline

Estimated effort: 2-4 hours
Priority: High
