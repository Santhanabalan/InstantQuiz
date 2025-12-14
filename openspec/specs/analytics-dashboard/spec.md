# analytics-dashboard Specification

## Purpose
TBD - created by archiving change add-initial-quiz-application. Update Purpose after archive.
## Requirements
### Requirement: Score Visualization
The system SHALL display final score using a donut chart or progress ring with percentage.

#### Scenario: Score ring displays pass result
- **GIVEN** user scored 18 out of 20 (90%)
- **WHEN** Analytics dashboard loads
- **THEN** donut chart shows 90% filled in green
- **AND** center displays "90%" in large text
- **AND** "PASSED" badge appears (based on 70% passing threshold)
- **AND** subtitle shows "18 / 20 correct"

#### Scenario: Score ring displays fail result
- **GIVEN** user scored 12 out of 20 (60%) with 70% passing threshold
- **WHEN** Analytics dashboard loads
- **THEN** donut chart shows 60% filled in red/orange
- **AND** center displays "60%" in large text
- **AND** "FAILED" badge appears
- **AND** subtitle shows "12 / 20 correct"

#### Scenario: Score ring animation on load
- **GIVEN** Analytics dashboard is loading
- **WHEN** score ring appears
- **THEN** ring animates from 0% to final percentage
- **AND** animation duration is ~1 second with easing
- **AND** percentage counter animates in sync

### Requirement: Score Breakdown Summary
The system SHALL display detailed breakdown of correct, incorrect, and unanswered questions.

#### Scenario: Breakdown shows all categories
- **GIVEN** user answered 18 correct, 2 incorrect, 0 unanswered
- **WHEN** breakdown section renders
- **THEN** "Correct" displays 18 with green indicator
- **AND** "Incorrect" displays 2 with red indicator
- **AND** "Unanswered" displays 0 with gray indicator
- **AND** total adds up to 20 questions

### Requirement: Question Review List
The system SHALL display a list of all questions with user's answer and correct answer.

#### Scenario: Review list shows all questions
- **GIVEN** quiz had 20 questions
- **WHEN** user views review list
- **THEN** all 20 questions are listed
- **AND** each item shows question text (truncated if long)
- **AND** each item shows user's answer
- **AND** each item shows correct answer

#### Scenario: Correct answer visual feedback
- **GIVEN** user answered question 5 correctly
- **WHEN** question 5 appears in review list
- **THEN** item has green left border
- **AND** checkmark icon appears
- **AND** "Correct" badge is shown

#### Scenario: Incorrect answer visual feedback
- **GIVEN** user answered question 8 incorrectly
- **WHEN** question 8 appears in review list
- **THEN** item has red left border
- **AND** X icon appears
- **AND** "Incorrect" badge is shown
- **AND** user's answer is shown in strikethrough
- **AND** correct answer is highlighted in green

#### Scenario: Unanswered question visual feedback
- **GIVEN** user did not answer question 12
- **WHEN** question 12 appears in review list
- **THEN** item has gray left border
- **AND** "Unanswered" badge is shown
- **AND** correct answer is highlighted

### Requirement: Question Filtering
The system SHALL allow users to filter review list by All, Correct, Incorrect, or Marked for Review.

#### Scenario: Filter by incorrect answers only
- **GIVEN** user answered 2 questions incorrectly
- **WHEN** user selects "Incorrect" filter
- **THEN** only 2 incorrect questions are displayed
- **AND** filter button shows active state
- **AND** count displays "(2)"

#### Scenario: Filter by marked for review
- **GIVEN** user marked 5 questions for review during exam
- **WHEN** user selects "Marked" filter
- **THEN** only 5 marked questions are displayed
- **AND** flag/star icon appears on each

#### Scenario: Show all questions (default)
- **GIVEN** user is on Analytics dashboard
- **WHEN** no filter is selected
- **THEN** all questions are displayed
- **AND** "All" filter button shows active state
- **AND** count displays total question count

### Requirement: Question Detail Expansion
The system SHALL allow users to expand question items to see full question text and all options.

#### Scenario: User expands question for full details
- **GIVEN** question text is truncated in list view
- **WHEN** user clicks on question item
- **THEN** item expands to show:
  - Full question text
  - All four options (A, B, C, D)
  - User's selected answer highlighted
  - Correct answer marked with checkmark
- **AND** expansion animates smoothly

#### Scenario: User collapses expanded question
- **GIVEN** question 3 is expanded
- **WHEN** user clicks question 3 again
- **THEN** item collapses to compact view
- **AND** collapse animates smoothly

### Requirement: Time Spent Display
The system SHALL display total time spent on quiz if timer was enabled.

#### Scenario: Time spent shown for timed quiz
- **GIVEN** quiz was completed with timer enabled (30 minutes)
- **AND** user finished in 18 minutes 32 seconds
- **WHEN** Analytics dashboard loads
- **THEN** "Time Spent" displays "18:32"
- **AND** shows "out of 30:00 allowed"

#### Scenario: No time display for untimed quiz
- **GIVEN** quiz was completed without timer
- **WHEN** Analytics dashboard loads
- **THEN** time spent section is not displayed

### Requirement: Restart Actions
The system SHALL provide options to retake quiz or upload new CSV.

#### Scenario: User retakes quiz with same questions
- **GIVEN** user is viewing results
- **WHEN** user clicks "Retake Quiz" button
- **THEN** confirmation dialog appears "Retake this quiz? Previous results will be lost."
- **AND** on confirmation, returns to Configuration phase
- **AND** same questions remain loaded
- **AND** user can reconfigure settings

#### Scenario: User uploads new CSV
- **GIVEN** user is viewing results
- **WHEN** user clicks "Upload New CSV" button
- **THEN** confirmation dialog appears "Upload new quiz? Current data will be lost."
- **AND** on confirmation, returns to Ingestion phase
- **AND** all state is cleared

### Requirement: Results Summary Card
The system SHALL display a summary card at top of dashboard with key metrics.

#### Scenario: Summary card shows overview
- **GIVEN** user completed quiz
- **WHEN** Analytics dashboard loads
- **THEN** summary card displays:
  - Final percentage score
  - Pass/Fail status
  - Questions correct / total
  - Time spent (if timed)
  - Passing threshold percentage

