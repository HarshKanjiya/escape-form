# API Documentation

This document describes the API endpoints for the EscapeForm application.

## Base URL
`/api`

## Authentication
All endpoints require user authentication via session or token.

## Endpoints

### Users

| Path | Method | Path Params | Query Params | Body Params | Response | Description |
|------|--------|-------------|--------------|-------------|----------|-------------|
| `/api/users` | GET | - | - | - | Array of users | Retrieve user information |

### Teams

| Path | Method | Path Params | Query Params | Body Params | Response | Description |
|------|--------|-------------|--------------|-------------|----------|-------------|
| `/api/teams` | GET, POST | - | limit: number, offset: number, orderBy: string, orderDirection: string, search: string | name: string (required for POST) | List of teams with pagination count | Get or create teams for the authenticated user |
| `/api/teams/all` | GET | - | - | - | List of all teams with project counts | Retrieve all teams for the authenticated user |
| `/api/teams/[teamId]` | PATCH, DELETE | teamId: string | - | name: string (required for PATCH), ownerId: string (optional) | Updated team object | Update or delete a specific team |

### Projects

| Path | Method | Path Params | Query Params | Body Params | Response | Description |
|------|--------|-------------|--------------|-------------|----------|-------------|
| `/api/projects` | GET, POST | - | teamId: string (required for GET), search: string, limit: number, offset: number, orderBy: string, orderDirection: string | name: string (required for POST), description: string (optional), teamId: string (required for POST) | List of projects with pagination count | Get or create projects within a team |
| `/api/projects/[projectId]` | GET | projectId: string | - | - | Project object | Retrieve a specific project |

### Forms

| Path | Method | Path Params | Query Params | Body Params | Response | Description |
|------|--------|-------------|--------------|-------------|----------|-------------|
| `/api/forms` | GET, POST | - | projectId: string (required for GET), limit: number, offset: number | name: string (required for POST), projectId: string (required for POST), description: string, allowAnonymous: boolean, theme: string, analyticsEnabled: boolean, logoUrl: string, requireConsent: boolean, maxResponses: number, multipleSubmissions: boolean, passwordProtected: boolean, openAt: Date, closeAt: Date | List of forms with pagination count | Get or create forms within a project |
| `/api/forms/[formId]` | GET, PUT | formId: string | - | logoUrl: string, requireConsent: boolean, maxResponses: number, formPageType: string, multipleSubmissions: boolean, customDomain: string, uniqueSubdomain: string, passwordProtected: boolean, openAt: Date, closeAt: Date, status: FormStatus, allowAnonymous: boolean, analyticsEnabled: boolean, description: string, name: string, theme: string | Form object with questions and edges | Retrieve or update a specific form |
| `/api/forms/[formId]/status` | POST, DELETE | formId: string | - | action: FormStatus (required for POST) | Updated form object | Update form status or soft delete form |
| `/api/forms/[formId]/questions` | GET, POST | formId: string | - | data: Array of Partial<Question> (required for POST) | List of questions | Get or create questions for a form |
| `/api/forms/[formId]/questions/[questionId]` | PATCH, DELETE | formId: string, questionId: string | - | title: string, description: string, placeholder: string, required: boolean, type: string, sortOrder: number, posX: number, posY: number, metadata: object | Updated question object | Update or delete a specific question |
| `/api/forms/[formId]/edges` | GET, POST | formId: string | - | sourceNodeId: string (required for POST), targetNodeId: string (required for POST) | List of edges | Get or create edges for form logic |
| `/api/forms/[formId]/edges/[edgeId]` | PATCH, DELETE | formId: string, edgeId: string | - | sourceNodeId: string, targetNodeId: string, condition: object | Updated edge object | Update or delete a specific edge |

### Dashboard

| Path | Method | Path Params | Query Params | Body Params | Response | Description |
|------|--------|-------------|--------------|-------------|----------|-------------|
| `/api/dashboard/[formId]/analytics` | GET | formId: string | - | - | Analytics object with counts, rates, and monthly data | Retrieve analytics data for a form |
| `/api/dashboard/[formId]/questions` | GET | formId: string | - | - | List of questions with options | Retrieve questions for a form |
| `/api/dashboard/[formId]/responses` | GET | formId: string | limit: number, offset: number, orderBy: string, orderDirection: string | - | List of responses with pagination count | Retrieve responses for a form |
| `/api/dashboard/[formId]/security` | PUT | formId: string | - | maxResponses: number (optional), openAt: string (optional), closeAt: string (optional), requireConsent: boolean, allowAnonymous: boolean, multipleSubmissions: boolean, passwordProtected: boolean | Updated form security settings | Update security settings for a form |
| `/api/dashboard/[formId]/security/passwords` | GET, POST | formId: string | - | name: string (required for POST), password: string (required for POST), expireAt: string (optional), usableUpto: number (required for POST), isValid: boolean (optional) | List of active passwords | Get or create passwords for form access |
| `/api/dashboard/[formId]/security/passwords/[id]` | DELETE | formId: string, id: string | - | - | Success message | Delete a specific password |
| `/api/dashboard/[formId]/settings` | PUT | formId: string | - | name: string, description: string (optional), formPageType: enum (SINGLE or STEPPER), theme: { primaryColor: string (hex), backgroundColor: string (hex), textColor: string (hex), buttonSize: enum (sm, md, lg), buttonRadius: enum (none, sm, md, lg, full) } | Updated form settings | Update general settings and theme for a form |