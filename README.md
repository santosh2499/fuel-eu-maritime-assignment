Fuel-EU Dashboard
Project Overview

The Fuel-EU Dashboard is a React-based frontend application for managing carbon budgets of ships. It allows users to:

Visualize current carbon budgets.

Pool carbon budgets among multiple ships.

Bank and apply carbon budgets individually.

Track aggregated carbon budget totals per year.

Features

Year selection for CB records.

Pooling of CB among ships.

Banking and applying CB.

Real-time updates and table visualization.

Error-safe operations with fallback values.



Setup & Installation
# Clone repository
git clone https://github.com/<your-repo>/fuel-eu-dashboard.git

# Navigate to project
cd fuel-eu-dashboard

# Install dependencies
npm install

# Run project
npm start

# Run tests
npm test




Project Structure
frontend/fuel-eu-dashboard/
├── src/
│   ├── adapters/ui/
│   │   ├── PoolingTab.tsx
│   │   ├── BankingTab.tsx
│   │   └── __tests__/
│   ├── infrastructure/
│   │   └── api.ts
│   └── App.tsx
├── package.json
├── README.md
└── AGENT_WORKFLOW.md



Testing

Jest + React Testing Library used.

Mocks ensure API calls return consistent data.

.toFixed() errors handled in component with fallback.

Table and buttons tested for render and click behavior.