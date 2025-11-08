Fuel-EU Dashboard – Agent Workflow
Overview

This document describes the workflow of the dashboard for managing Carbon Budget (CB) pooling and banking for ships. The system allows users to:

View current CB records.

Pool carbon budgets among ships.

Bank and apply carbon budgets.

Create and track aggregated CB totals.

1. Component Structure
1.1 PoolingTab

Purpose: Visualize and manage pooled CB for a specific year.

State Variables:

year – selected year.

members – list of ships and their CB records.

poolSum – sum of CB before pooling.

API Calls:

getAdjustedCB(year) – fetches current CB records.

createPool({ year, members }) – pools CB among selected ships.

Workflow:

On load, fetch CB records for the selected year.

Display table with Ship ID, CB Before, and CB After.

Calculate poolSum dynamically.

On “Create Pool” click, call API and update table.

1.2 BankingTab

Purpose: Manage CB banking operations.

State Variables:

records – current CB records fetched from API.

API Calls:

getCB(year) – fetch current CB records.

bankCB(shipId, amount) – bank CB for a ship.

applyBankedCB(shipId) – apply banked CB to a ship.

Workflow:

On load, fetch CB records.

Display table with Ship ID, CB Before, CB After.

“Bank” button calls API to bank CB for selected ship.

“Apply” button calls API to apply banked CB.

1.3 API Adapter

Centralized file api.ts exposes functions for:

Fetching CB data.

Banking CB.

Pooling CB.

Applying banked CB.

Ensures frontend components remain decoupled from raw API responses.

1.4 User Interaction Flow

Select Year → Table updates dynamically.

View CB Records → Before and After values displayed.

Pool CB → Pool Sum calculated, CB updated.

Bank / Apply CB → Updates individual ship records.

Error Handling → Defaults and fallbacks prevent crashes (.toFixed() safe guards, empty array defaults).

1.5 State & Error Handling

Components use React state to track API responses.

Empty array fallback prevents records.map errors.

Fallbacks in table display ('-') for undefined CB values.

Jest mocks replicate API behavior for reliable testing.