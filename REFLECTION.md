Reflection
Challenges Faced

API Mocking in Tests

.map() errors occurred because mocked API responses were not arrays.

Resolved by ensuring all mocks returned arrays with complete numeric fields.

Handling Undefined Values

.toFixed() caused runtime errors when CB values were undefined.

Added fallback in JSX to render '-'.

Testing Dynamic Content

Text not found in tests due to DOM structure.

Used function matchers (content.includes()) for reliable assertions.

Component Decoupling

Needed clear separation between API layer and UI.

Created api.ts adapter to centralize API logic.

Learnings

Importance of defensive programming in React.

Value of Jest mocking for testing API-dependent components.

How to manage complex state updates across multiple components.

Future Improvements

Add pagination for large CB datasets.

Implement better error messages for API failures.

Introduce visual charts for CB pooling and banking.

Improve accessibility of tables and buttons.