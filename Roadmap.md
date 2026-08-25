# Roadmap

## 1. POC

First version will be an app that visualizes the five closest features surrounding the user.

## 2. Personal datastructure

Implement a personal geospatial datastructure and evaluate its effect on speed.

### Focus

- Measure lookup speed for nearby features
- Compare performance with the current approach
- Keep the implementation simple and only optimize where it matters

## 3. User object

Implement a user object that stores the user's location and data.

### Focus

- Persist the relevant user data safely
- Keep the structure small and clear
- Prepare for future profile and preference fields

## 4. Production readiness

The first code version is ready, so the next phase is preparing the app for a production-grade release.

### 4.1 Product quality

- Review loading, empty, and error states
- Review offline behavior
- Improve accessibility where needed
- Make sure the UX is consistent and clear

### 4.2 Performance

- Measure startup time
- Measure rendering performance on key screens
- Reduce unnecessary re-renders
- Optimize expensive location and geospatial calculations
- Test performance on a slower physical device

### 4.3 Release setup

- Create a stable production app name
- Define the iOS bundle identifier
- Define the Android package name
- Set up EAS Build
- Set up EAS Submit
- Define a versioning strategy for app version and build numbers

### 4.4 Environment setup

- Separate development, staging, and production environments
- Configure API endpoints per environment
- Store secrets safely
- Prevent development configuration from leaking into production

### 4.5 Monitoring and analytics

- Add crash reporting
- Add runtime error tracking
- Add lightweight product analytics
- Track the most important user flows only

### 4.6 QA process

- Create a manual smoke test checklist
- Test on real iOS and Android devices
- Test permissions, location usage, and error flows
- Test poor network conditions and offline cases
- Test upgrading from an older build when relevant

### 4.7 Store readiness

- Prepare app icon
- Prepare splash screen
- Prepare store screenshots
- Write App Store and Play Store descriptions
- Choose category, keywords, and age rating

### 4.8 Privacy and security

- Write a privacy policy
- Review which data is collected and stored
- Review which permissions are requested and why
- Ensure no secrets are hardcoded in the app
- Define secure token and session handling

### 4.9 Operations

- Create a support email address
- Define a simple bug reporting process
- Write release notes for each release
- Document the release process and rollback steps

## 5. Before first app store submission

### Must be complete

- Production build works successfully
- App metadata and screenshots are ready
- Privacy policy is published
- Crash reporting is enabled
- Manual QA checklist is completed
- Version numbers are set correctly
- Production environment is configured correctly

## 6. After first launch

### Improve iteratively

- Add broader analytics where useful
- Add automated tests for critical flows
- Improve onboarding based on user feedback
- Monitor crashes and performance regressions
- Refine the geospatial implementation using real usage data
