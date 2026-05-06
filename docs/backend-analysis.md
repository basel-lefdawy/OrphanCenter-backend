# Backend Analysis Documentation

## Overview

This frontend is an orphan sponsorship platform. Public users can learn about the organization, browse orphans, view orphan details, submit donations, request help, and fill out a sponsorship form. Admin users can view dashboard statistics and manage orphans, donations, sponsors, and help requests.

### Public Pages

| Route                  | Page              | Purpose                                                                                               |
| ---------------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                    | Home              | Shows the hero section, featured orphan cards, and static statistics.                                 |
| `/about`               | About             | Shows static organization information, mission, values, and achievement stats.                        |
| `/orphans`             | Orphans List      | Fetches public orphan data and displays orphan cards.                                                 |
| `/orphans/details/:id` | Orphan Details    | Shows one orphan's details and lets the user start sponsorship.                                       |
| `/help`                | Help Request Form | Collects orphan, guardian, payment, bank, and family details for a help request.                      |
| `/donate`              | Donation Form     | Collects donation amount, donor details, payment method, and optional card fields.                    |
| `/sponsor-form`        | Sponsorship Form  | Collects sponsor, sponsorship, and authorized person details. Currently saves to `localStorage` only. |

### Admin Pages

| Route                     | Page                     | Purpose                                                                                    |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `/admin`                  | Admin Dashboard          | Loads orphans, donations, help requests, and sponsors, then computes dashboard statistics. |
| `/admin/orphans`          | Orphans Management       | Lists, searches, edits, and deletes orphans.                                               |
| `/admin/orphans/add`      | Add Orphan               | Creates a new orphan record.                                                               |
| `/admin/orphans/edit/:id` | Edit Orphan              | Updates an existing orphan record.                                                         |
| `/admin/donations`        | Donations Management     | Lists, searches, and deletes donations. Edit is currently only an alert placeholder.       |
| `/admin/sponsors`         | Sponsors Management      | Lists, searches, and deletes sponsors. Edit is currently only an alert placeholder.        |
| `/admin/help-requests`    | Help Requests Management | Lists, searches, and deletes help requests. Edit is currently only an alert placeholder.   |

### Important Observations

- The project currently uses mock services and external MockAPI URLs.
- There is no frontend login page or route protection for admin pages.
- Public orphan data and admin orphan data use different shapes.
- The sponsorship form does not submit to an API yet.
- Donation form data does not match the admin donation list shape exactly.
- Help request form data does not match the admin help request list shape exactly.

## API

Base path proposal: `/api`

Admin endpoints should require authentication, even though the current frontend does not implement admin auth yet.

### Auth -> basel

| Method | Route              | Auth   | Purpose                | Request               | Response                    |
| ------ | ------------------ | ------ | ---------------------- | --------------------- | --------------------------- |
| `POST` | `/api/auth/login`  | Public | Admin login            | `email`, `password`   | `token`, `user`             |
| `POST` | `/api/auth/logout` | Admin  | Logout admin user      | none or refresh token | `{ success: true }`         |
| `GET`  | `/api/auth/me`     | Admin  | Get current admin user | none                  | `{ id, name, email, role }` |

Auth is not directly supported by the current frontend, but it is required before the admin backend can be considered safe.

### Orphans -> zaina

| Method   | Route                    | Auth         | Purpose                          | Request Fields                                                                                                                          | Response Fields     |
| -------- | ------------------------ | ------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `GET`    | `/api/orphans`           | Public/Admin | List orphans                     | optional query: `status`, `sponsored`, `limit`, `page`, `search`                                                                        | orphan summaries    |
| `GET`    | `/api/orphans/:id`       | Public/Admin | Get orphan details               | none                                                                                                                                    | full orphan object  |
| `POST`   | `/api/admin/orphans`     | Admin        | Add orphan                       | `name`, `age`, `gender`, `dateOfBirth`, `status?`, `healthStatus?`, `educationLevel?`, `notes?`, `sponsorId?`, public fields if unified | created orphan      |
| `PATCH`  | `/api/admin/orphans/:id` | Admin        | Update orphan                    | partial orphan fields                                                                                                                   | updated orphan      |
| `DELETE` | `/api/admin/orphans/:id` | Admin        | Delete orphan and unlink sponsor | none                                                                                                                                    | `{ success: true }` |

Public orphan fields currently expected by the frontend:

```json
{
  "id": 1,
  "name": "string",
  "image": "string",
  "age": 8,
  "gender": "string",
  "place": "string",
  "type": "string",
  "description": "string",
  "sponsoringType": "string"
}
```

Admin orphan fields currently expected by the frontend:

```json
{
  "id": 1,
  "name": "string",
  "age": 8,
  "gender": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "enrollmentDate": "YYYY-MM-DD",
  "sponsorId": 1,
  "sponsor": "string",
  "status": "string",
  "healthStatus": "string",
  "educationLevel": "string",
  "notes": "string"
}
```

Risk: these two shapes should be unified or deliberately separated before backend implementation.

### Sponsors and Sponsorships -> ali

| Method   | Route                       | Auth   | Purpose                          | Request Fields                   | Response Fields     |
| -------- | --------------------------- | ------ | -------------------------------- | -------------------------------- | ------------------- |
| `GET`    | `/api/admin/sponsors`       | Admin  | List sponsors                    | optional query: `search`, `page` | sponsor summaries   |
| `GET`    | `/api/admin/sponsors/:id`   | Admin  | Get sponsor details              | none                             | full sponsor        |
| `POST`   | `/api/sponsorship-requests` | Public | Submit sponsorship form          | `sponsor`, `sponsoring`, `agent` | created request     |
| `POST`   | `/api/admin/sponsors`       | Admin  | Create sponsor directly          | sponsor fields                   | created sponsor     |
| `PATCH`  | `/api/admin/sponsors/:id`   | Admin  | Update sponsor                   | partial sponsor fields           | updated sponsor     |
| `DELETE` | `/api/admin/sponsors/:id`   | Admin  | Delete sponsor and unlink orphan | none                             | `{ success: true }` |

The current admin sponsor table expects:

```json
{
  "id": 1,
  "name": "string",
  "phone": "string",
  "email": "string",
  "orphanId": 1,
  "orphanName": "string",
  "monthlyAmount": 1500,
  "startDate": "YYYY-MM-DD",
  "status": "string"
}
```

The public sponsorship form sends a nested structure:

```json
{
  "sponsor": {
    "id": "string",
    "name": "string",
    "gender": "string",
    "father": "string",
    "grandfather": "string",
    "family": "string",
    "birthDate": "YYYY-MM-DD",
    "workType": "string",
    "country": "string",
    "cityName": "string",
    "streetName": "string",
    "MobilePhone": "string",
    "LandlinePhone": "string",
    "email": "string"
  },
  "sponsoring": {
    "orphanId": 1,
    "sponsoringType": "string",
    "monthlyAmount": 1500,
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "paymentMethod": "cash",
    "bankName": "string",
    "accountNumber": "string"
  },
  "agent": {
    "id": "string",
    "name": "string",
    "father": "string",
    "grandfather": "string",
    "family": "string",
    "workType": "string",
    "gender": "string",
    "kinship": "string",
    "MobilePhone": "string",
    "country": "string",
    "cityName": "string",
    "streetName": "string"
  }
}
```

### Donations -> Nora

| Method   | Route                      | Auth   | Purpose                         | Request Fields                                                                     | Response Fields     |
| -------- | -------------------------- | ------ | ------------------------------- | ---------------------------------------------------------------------------------- | ------------------- |
| `POST`   | `/api/donations`           | Public | Submit donation                 | `amount`, `method`, `firstName`, `lastName`, `email`, `date`, optional card fields | created donation    |
| `GET`    | `/api/admin/donations`     | Admin  | List donations                  | optional query: `status`, `search`, `page`                                         | donation summaries  |
| `GET`    | `/api/admin/donations/:id` | Admin  | Get donation details            | none                                                                               | full donation       |
| `PATCH`  | `/api/admin/donations/:id` | Admin  | Update donation status or notes | `status?`, `notes?`                                                                | updated donation    |
| `DELETE` | `/api/admin/donations/:id` | Admin  | Delete donation                 | none                                                                               | `{ success: true }` |

Public donation form sends:

```json
{
  "amount": 100,
  "method": "paypal",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "cardNumber": "string",
  "cvc": "string",
  "expiry": "MM/YY",
  "cardName": "string",
  "date": "ISO date"
}
```

Admin donation table expects:

```json
{
  "id": 1,
  "donorName": "string",
  "amount": 5000,
  "currency": "string",
  "date": "YYYY-MM-DD",
  "type": "string",
  "status": "string",
  "notes": "string"
}
```

Important: the backend should not store raw card numbers or CVC values.

### Help Requests Nora + Basel ( Last 2 )

| Method   | Route                          | Auth   | Purpose                       | Request Fields                                        | Response Fields      |
| -------- | ------------------------------ | ------ | ----------------------------- | ----------------------------------------------------- | -------------------- |
| `POST`   | `/api/help-requests`           | Public | Submit help request           | all help request form fields                          | created help request |
| `GET`    | `/api/admin/help-requests`     | Admin  | List help requests            | optional query: `status`, `urgency`, `search`, `page` | request summaries    |
| `GET`    | `/api/admin/help-requests/:id` | Admin  | Get full request              | none                                                  | full request         |
| `PATCH`  | `/api/admin/help-requests/:id` | Admin  | Update request status/details | `status?`, `urgency?`, `notes?`                       | updated request      |
| `DELETE` | `/api/admin/help-requests/:id` | Admin  | Delete request                | none                                                  | `{ success: true }`  |

The help request form submits fields such as:

- `OrphanID`
- `OrphanName`
- `OrphanFatherName`
- `OrphanGrandfatherName`
- `OrphanFamilyName`
- `OrphanBirthDate`
- `gender`
- `GuaranteeType`
- `GuardianID`
- `GuardianName`
- `Relation`
- `country`
- `city`
- `street`
- `phoneNumber`
- `email`
- `paymentMethod`
- bank details if `paymentMethod` is `BankAccount`
- family details
- conditional death/job/salary fields based on `DeceasedPerson`

Admin help request table expects:

```json
{
  "id": 1,
  "requesterName": "string",
  "requestType": "string",
  "date": "YYYY-MM-DD",
  "urgency": "string",
  "status": "string",
  "phone": "string"
}
```

### Admin Dashboard

| Method | Route                  | Auth  | Purpose                                    | Request | Response          |
| ------ | ---------------------- | ----- | ------------------------------------------ | ------- | ----------------- |
| `GET`  | `/api/admin/dashboard` | Admin | Return dashboard stats and recent activity | none    | dashboard summary |

Suggested response:

```json
{
  "totalOrphans": 8,
  "sponsoredOrphans": 4,
  "unsponsoredOrphans": 4,
  "totalSponsors": 4,
  "totalDonations": 50000,
  "donationsCount": 6,
  "pendingRequests": 2,
  "helpRequestsCount": 5,
  "sponsorshipRate": 50,
  "recentOrphans": [],
  "recentDonations": []
}
```

## Models

### AdminUser

| Field          | Type          | Required | Notes                      |
| -------------- | ------------- | -------: | -------------------------- |
| `id`           | number/string |      yes | Primary key                |
| `name`         | string        |      yes | Display name               |
| `email`        | string        |      yes | Login identifier           |
| `passwordHash` | string        |      yes | Store hashed password only |
| `role`         | string        |      yes | Example: `admin`           |
| `createdAt`    | datetime      |      yes | Stored                     |

### Orphan

| Field            | Type               |        Required | Notes                                                              |
| ---------------- | ------------------ | --------------: | ------------------------------------------------------------------ |
| `id`             | number/string      |             yes | Primary key                                                        |
| `name`           | string             |             yes | Used everywhere                                                    |
| `age`            | number             |   currently yes | Could be computed from `dateOfBirth`, but frontend sends/stores it |
| `gender`         | string             |             yes | Values need team agreement                                         |
| `dateOfBirth`    | date               |       admin yes | Required in admin add/edit                                         |
| `enrollmentDate` | date               |             yes | Generated on admin create in frontend                              |
| `sponsorId`      | number/string/null |        optional | Links current sponsor                                              |
| `healthStatus`   | string             |        optional | Admin field                                                        |
| `educationLevel` | string             |        optional | Admin field                                                        |
| `notes`          | string             |        optional | Admin field                                                        |
| `image`          | string             | public optional | Needed by public cards/details                                     |
| `place`          | string             | public optional | Needed by public cards                                             |
| `type`           | string             | public optional | Needed by public cards                                             |
| `description`    | string             | public optional | Needed by public details                                           |
| `sponsoringType` | string             | public optional | Saved into selected orphan before sponsorship                      |

Computed fields:

- `status`: currently computed from whether `sponsorId` exists.
- `sponsor`: sponsor name, computed by joining sponsor data.

### Sponsor

| Field           | Type               | Required | Notes                                                 |
| --------------- | ------------------ | -------: | ----------------------------------------------------- |
| `id`            | number/string      |      yes | Primary key                                           |
| `name`          | string             |      yes | Admin table                                           |
| `phone`         | string             |      yes | Admin table                                           |
| `email`         | string             | optional | Admin table                                           |
| `orphanId`      | number/string/null | optional | Linked orphan                                         |
| `monthlyAmount` | number             |      yes | Admin table                                           |
| `startDate`     | date               |      yes | Admin table                                           |
| `status`        | string             |      yes | Example values in mock: active/stopped Arabic strings |

Computed fields:

- `orphanName`: computed from linked orphan.

### SponsorshipRequest

| Field        | Type          | Required | Notes                       |
| ------------ | ------------- | -------: | --------------------------- |
| `id`         | number/string |      yes | Primary key                 |
| `sponsor`    | object        |      yes | Sponsor form section        |
| `sponsoring` | object        |      yes | Sponsorship details         |
| `agent`      | object        |      yes | Authorized person details   |
| `status`     | string        |      yes | Needs team-defined workflow |
| `createdAt`  | datetime      |      yes | Stored                      |

This should probably be separate from `Sponsor` until an admin approves it, but the frontend does not define the workflow.

### Donation

| Field       | Type          |   Required | Notes                           |
| ----------- | ------------- | ---------: | ------------------------------- |
| `id`        | number/string |        yes | Primary key                     |
| `amount`    | number        |        yes | Public donation form            |
| `currency`  | string        |   optional | Admin mock uses currency        |
| `method`    | string        |        yes | `paypal` or `card` in frontend  |
| `firstName` | string        | public yes | Public form                     |
| `lastName`  | string        | public yes | Public form                     |
| `email`     | string        | public yes | Public form                     |
| `donorName` | string        |   computed | Could be `firstName + lastName` |
| `date`      | date/datetime |        yes | Sent by frontend                |
| `type`      | string        |   optional | Admin mock uses donation type   |
| `status`    | string        |        yes | Needs status workflow           |
| `notes`     | string        |   optional | Admin table                     |

Do not store:

- raw `cardNumber`
- raw `cvc`

### HelpRequest

| Field                  | Type            |    Required | Notes                                          |
| ---------------------- | --------------- | ----------: | ---------------------------------------------- |
| `id`                   | number/string   |         yes | Primary key                                    |
| orphan identity fields | strings/date    |         yes | From help request form                         |
| guardian fields        | strings         |         yes | From help request form                         |
| payment method fields  | strings         |         yes | Conditional bank fields                        |
| family fields          | strings/numbers |   partially | Required fields are defined in `formFields.js` |
| deceased parent fields | strings/dates   | conditional | Based on `DeceasedPerson`                      |
| `status`               | string          |         yes | Admin status                                   |
| `urgency`              | string          |     unclear | Admin mock has it, public form does not        |
| `createdAt`            | datetime        |         yes | Stored                                         |
| `adminNotes`           | string          |    optional | Useful but not in frontend                     |

Computed or mapped fields for admin list:

- `requesterName`: likely from guardian name.
- `requestType`: likely from `GuaranteeType`.
- `phone`: likely from `phoneNumber`.
- `date`: likely `createdAt`.

### DashboardSummary

This should be computed, not stored.

Fields:

- `totalOrphans`
- `sponsoredOrphans`
- `unsponsoredOrphans`
- `totalSponsors`
- `totalDonations`
- `donationsCount`
- `pendingRequests`
- `helpRequestsCount`
- `sponsorshipRate`
- `recentOrphans`
- `recentDonations`

## Questions

### What I still need to know from the team

1. Should public orphan data and admin orphan data use the same database table?
2. Which orphan fields are safe to show publicly?
3. Should orphan `status` be stored manually or computed from `sponsorId`?
4. When a user submits `/sponsor-form`, should it create a pending sponsorship request or an active sponsor immediately?
5. Can one sponsor sponsor multiple orphans?
6. Can one orphan have multiple sponsors?
7. What are the official status values for sponsors, donations, help requests, and sponsorship requests?
8. Should the backend store English enum values and let the frontend translate them to Arabic?
9. What payment provider will be used?
10. Are we allowed to collect card data in this app?
11. Should help request submissions create orphan records, or are they separate applications?
12. What is the approval workflow for help requests?
13. What is the approval workflow for sponsorship requests?
14. Should admin deletes be hard deletes, soft deletes, or archived records?
15. Who can access admin pages?
16. Will there be one admin role or multiple roles?
17. What IDs are official: database IDs, national IDs, or both?
18. Do orphan images come from uploads, URLs, or fixed assets?
19. Should dashboard stats count all records or only approved/active records?
20. Should public stats on the home page remain static or become dynamic?

### Unclear or risky areas

- Admin authentication is missing.
- Admin route protection is missing.
- Public orphan details currently finds an orphan by array index, not true ID.
- Public orphan schema and admin orphan schema are different.
- Sponsorship form does not call an API.
- Donation form sends payment/card-like fields directly.
- Help request form shape differs from admin table shape.
- Donation form shape differs from admin table shape.
- Admin edit for donations, sponsors, and help requests is not implemented.
- Mobile header references routes that do not exist, such as `/activities` and `/sponsoring`.

## Action Plan

### What to do tomorrow

Tomorrow, prepare a short contract document for the team meeting. Focus on the mismatches that can block backend work:

1. Public orphan fields vs admin orphan fields.
2. Donation form fields vs admin donation table fields.
3. Help request form fields vs admin help request table fields.
4. Sponsor form submission behavior.
5. Required admin authentication and permissions.

### Decisions to agree on first

1. Auth strategy and admin roles.
2. Final orphan schema.
3. Whether orphan status is stored or computed.
4. Sponsorship request workflow.
5. Help request workflow.
6. Payment provider and card data policy.
7. Official enum/status values.
8. Delete vs archive behavior.
9. Image upload/storage strategy.

### Recommended backend repo structure

```txt
backend/
  src/
    modules/
      auth/
      orphans/
      sponsors/
      sponsorshipRequests/
      donations/
      helpRequests/
      dashboard/
    common/
      middleware/
      validation/
      errors/
    config/
  tests/
  .env.example
  README.md
```

### Recommended branch strategy

- `main`: stable production-ready code.
- `develop`: integration branch.
- `feature/admin-auth`: authentication work.
- `feature/orphan-crud`: orphan backend CRUD.
- `feature/sponsor-management`: sponsor backend logic.
- `feature/donations`: donation backend.
- `feature/help-requests`: help request backend.
- `feature/dashboard`: dashboard summary endpoint.

### Best module to implement first

Start with admin orphan CRUD.

Reasons:

- The frontend already has list, add, edit, and delete pages.
- Required fields are visible in the admin forms.
- The mock service already defines important behavior.
- Orphan records are central to sponsors, dashboard stats, and public pages.

After that, implement sponsor linking/unlinking because the mock services explicitly define this behavior:

- If an orphan gets a sponsor, update the sponsor's `orphanId`.
- If a sponsor gets an orphan, update the orphan's `sponsorId`.
- If an orphan is deleted, unlink the sponsor.
- If a sponsor is deleted, unlink the orphan.

### Suggested implementation order

1. Create backend repo and base project structure.
2. Add environment configuration and database connection.
3. Implement auth skeleton.
4. Implement orphan model and admin orphan CRUD.
5. Implement sponsor model and orphan-sponsor linking.
6. Implement dashboard summary.
7. Implement donation submission and admin donation list.
8. Implement help request submission and admin list.
9. Implement sponsorship request submission after workflow confirmation.
10. Update frontend service files to use the new backend endpoints.

### Edge cases to handle early

- Deleting an orphan with a sponsor.
- Deleting a sponsor linked to an orphan.
- Preventing inconsistent sponsor/orphan links.
- Handling orphan IDs correctly instead of array indexes.
- Validating conditional help request fields.
- Preventing duplicate public form submissions.
- Avoiding raw card data storage.
- Supporting empty admin tables.
- Returning consistent error responses.
- Handling Arabic display labels vs backend enum values.
- Adding pagination before datasets become large.
