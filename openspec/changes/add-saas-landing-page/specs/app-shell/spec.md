# Spec Delta: App Shell

## MODIFIED Requirements

### Requirement: Application Phase Management
The application SHALL add 'landing' as a new phase in the application lifecycle.

#### Scenario: Initial Application State
- **GIVEN** the application is loaded for the first time
- **WHEN** the application initializes
- **THEN** the phase is set to 'landing'
- **AND** the landing page component is displayed

#### Scenario: Existing Phases Remain Unchanged
- **GIVEN** the application supports ingestion, configuration, exam, and analytics phases
- **WHEN** the landing phase is added
- **THEN** all existing phase transitions continue to work as before
- **AND** the new phases are: landing, ingestion, configuration, exam, analytics

### Requirement: Phase Navigation
The application SHALL add navigation functions to support landing page transitions.

#### Scenario: Navigate from Landing to Upload
- **GIVEN** a user is on the landing page
- **WHEN** the user clicks a "Get Started" or "See Quote" button
- **THEN** navigation function is called
- **AND** the phase changes from 'landing' to 'ingestion'
- **AND** the file upload page is displayed with transition animation

#### Scenario: Optional Return to Landing
- **GIVEN** a user is on the file upload page
- **WHEN** the user clicks a "Back to Home" button (if implemented)
- **THEN** navigation to landing is triggered
- **AND** the phase changes to 'landing'
- **AND** the landing page is displayed

### Requirement: Phase Rendering
The application SHALL update App.jsx to handle landing phase rendering.

#### Scenario: Render Landing Phase
- **GIVEN** the application phase is 'landing'
- **WHEN** the App component renders
- **THEN** the LandingPage component is displayed
- **AND** other phase components are not mounted
- **AND** theme toggle is visible

#### Scenario: Transition Animations
- **GIVEN** the phase changes from 'landing' to any other phase
- **WHEN** the transition occurs
- **THEN** the exit animation plays for LandingPage
- **AND** the enter animation plays for the next phase component
- **AND** AnimatePresence handles the transition smoothly

## Integration Notes

### Context Updates Required
The QuizContext must be updated to:
1. Add 'landing' to phase type/enum
2. Add navigation function for landing page (e.g., `goToLanding()` or `goToUpload()`)
3. Set initial phase to 'landing' instead of 'ingestion'

### Component Updates Required
App.jsx must be updated to:
1. Import LandingPage component
2. Add conditional render for `phase === 'landing'`
3. Ensure theme toggle is visible on landing page

### Backward Compatibility
- Users who land directly on the upload page via deep link should still work
- Existing phase transitions (ingestion → configuration → exam → analytics) remain unchanged
