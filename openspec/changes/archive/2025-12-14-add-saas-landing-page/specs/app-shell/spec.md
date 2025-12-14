# Spec Delta: App Shell

## MODIFIED Requirements

### Requirement: Phase-Based Navigation
The system SHALL implement a five-phase navigation flow with landing page as entry point: Landing → Ingestion → Configuration → Exam → Analytics.

#### Scenario: Initial Application Load
- **GIVEN** the application is loaded for the first time
- **WHEN** the application initializes
- **THEN** the phase is set to 'landing'
- **AND** the landing page component is displayed

#### Scenario: Navigate from Landing to Upload
- **GIVEN** a user is on the landing page
- **WHEN** the user clicks a "Get Started" or "See Quote" button
- **THEN** navigation function is called
- **AND** the phase changes from 'landing' to 'ingestion'
- **AND** the file upload page is displayed with transition animation

#### Scenario: User progresses through quiz flow
- **GIVEN** the application is loaded
- **WHEN** user completes file upload
- **THEN** system transitions to Configuration phase
- **AND WHEN** user configures settings and starts quiz
- **THEN** system transitions to Exam phase
- **AND WHEN** user completes and submits quiz
- **THEN** system transitions to Analytics phase

#### Scenario: User restarts from Analytics
- **GIVEN** user is viewing results in Analytics phase
- **WHEN** user clicks "Upload New CSV"
- **THEN** system resets state and returns to Landing phase
