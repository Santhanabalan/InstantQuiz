# Spec Delta: App Shell - Dark/Light Mode

## MODIFIED Requirements

### Requirement: Theme Management
The app shell SHALL provide centralized theme state management and allow users to toggle between dark and light modes.

#### Scenario: User toggles theme
- **GIVEN** the application is loaded with light theme
- **WHEN** the user clicks the theme toggle button
- **THEN** the application switches to dark theme
- **AND** the preference is saved to localStorage
- **AND** all components update to dark mode colors

#### Scenario: Theme persistence
- **GIVEN** the user has previously selected dark mode
- **WHEN** the user reloads the application
- **THEN** the application loads with dark theme
- **AND** the theme toggle shows the current state

### Requirement: Theme Provider
The app shell SHALL provide a ThemeProvider component that wraps the application and manages theme state.

#### Scenario: Theme context initialization
- **GIVEN** the application starts for the first time
- **WHEN** the ThemeProvider initializes
- **THEN** it checks localStorage for saved preference
- **AND** falls back to system preference if not found
- **AND** applies the theme to the document root
