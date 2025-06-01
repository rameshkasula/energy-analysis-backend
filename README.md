# Energy Analysis Backend

A backend service for managing building designs, electricity rates, and solar radiation data for energy analysis.

## Features

### Building Designs
- Create, read, update, and delete building designs
- Track design status (DRAFT, REVIEW, FINALIZED)
- City-wise design management
- Soft delete functionality
- Design statistics by city and status

### Electricity Rates
- Manage city-specific electricity rates
- Track rate status (DRAFT, REVIEW, FINALIZED)
- Soft delete functionality
- Rate history tracking

### Solar Radiation
- City-specific solar radiation data
- Track radiation status (DRAFT, REVIEW, FINALIZED)
- Soft delete functionality

## API Endpoints

### Building Designs

#### Get All Designs
```http
GET /designs
Query Parameters:
- skip: number (optional)
- limit: number (optional)
```

#### Get Design Statistics
```http
GET /designs/stats
Query Parameters:
- city: string (optional, comma-separated for multiple cities)
Response:
{
  "success": true,
  "data": {
    "totalDesigns": number,
    "cityStats": [
      {
        "city": string,
        "totalCityDesigns": number,
        "statusCounts": [
          {
            "status": string,
            "count": number
          }
        ]
      }
    ]
  }
}
```

#### Create Design
```http
POST /designs
Body:
{
  "name": string,
  "city": string,
  "facades": {
    "north": number,
    "south": number,
    "east": number,
    "west": number
  },
  "shgc": number,
  "exposureHours": number,
  "skylight": number (optional),
  "status": "DRAFT" | "REVIEW" | "FINALIZED" | "REJECTED",
  "notes": string (optional)
}
```

#### Get Design by ID
```http
GET /designs/:id
```

#### Update Design
```http
PUT /designs/:id
Body: Same as Create Design
```

#### Update Design Status
```http
PATCH /designs/:id/status
Body:
{
  "status": "DRAFT" | "REVIEW" | "FINALIZED" | "REJECTED"
}
```

#### Soft Delete Design
```http
DELETE /designs/:id
```

### Electricity Rates

#### Get All Rates
```http
GET /rates
Query Parameters:
- skip: number (optional)
- limit: number (optional)
```

#### Create Rate
```http
POST /rates
Body:
{
  "city": string,
  "rate": number,
  "status": "DRAFT" | "REVIEW" | "FINALIZED",
  "notes": string (optional)
}
```

#### Get Rate by ID
```http
GET /rates/:id
```

#### Update Rate
```http
PUT /rates/:id
Body: Same as Create Rate
```

#### Update Rate Status
```http
PATCH /rates/:id/status
Body:
{
  "status": "DRAFT" | "REVIEW" | "FINALIZED"
}
```

#### Soft Delete Rate
```http
DELETE /rates/:id
```

#### Get Deleted Rates
```http
GET /rates/deleted
```

#### Restore Rate
```http
PATCH /rates/:id/restore
```

### Solar Radiation

#### Get All Radiation Data
```http
GET /radiation
Query Parameters:
- skip: number (optional)
- limit: number (optional)
```

#### Create Radiation Data
```http
POST /radiation
Body:
{
  "city": string,
  "radiation": {
    "north": number,
    "south": number,
    "east": number,
    "west": number
  },
  "status": "DRAFT" | "REVIEW" | "FINALIZED",
  "notes": string (optional)
}
```

#### Get Radiation by ID
```http
GET /radiation/:id
```

#### Update Radiation
```http
PUT /radiation/:id
Body: Same as Create Radiation
```

#### Update Radiation Status
```http
PATCH /radiation/:id/status
Body:
{
  "status": "DRAFT" | "REVIEW" | "FINALIZED"
}
```

#### Soft Delete Radiation
```http
DELETE /radiation/:id
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string
  }
}
```

Common error codes:
- `DUPLICATE_RECORD`: When trying to create a duplicate record
- `NOT_FOUND`: When the requested resource is not found
- `VALIDATION_ERROR`: When input data is invalid
- `UNAUTHORIZED`: When authentication is required
- `FORBIDDEN`: When access is forbidden
- `INTERNAL_ERROR`: For unexpected server errors

## Status Management

All resources (Designs, Rates, Radiation) support the following statuses:
- `DRAFT`: Initial state, when the record is first created
- `REVIEW`: Under review by authorized personnel
- `FINALIZED`: Approved and finalized, ready for use
- `REJECTED`: Rejected during review, requires revision

Status Flow:
```
DRAFT → REVIEW → FINALIZED
        ↓
     REJECTED → DRAFT
```

Status Rules:
- New records are created with `DRAFT` status
- Only `DRAFT` records can be moved to `REVIEW`
- `REVIEW` records can be moved to either `FINALIZED` or `REJECTED`
- `REJECTED` records must be updated and moved back to `DRAFT`
- `FINALIZED` records cannot be modified

## Soft Delete

All resources support soft delete functionality:
- Records are marked as deleted but not removed from the database
- Deleted records can be restored
- Only non-deleted records are returned in regular queries

## City Management

- City names are case-insensitive
- City names are automatically normalized (trimmed and title-cased)
- Multiple cities can be queried using comma-separated values
- City-specific statistics are available for all resources

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (for caching)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd energy-analysis-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/energy-analysis
REDIS_URL=redis://localhost:6379
```

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Documentation

### Designs API

#### Get All Designs
```http
GET /api/designs
```

Query Parameters:
- `skip` (optional): Number of records to skip
- `limit` (optional): Number of records to return

Response:
```json
{
    "designs": [
        {
            "_id": "string",
            "name": "string",
            "status": "string",
            "createdAt": "date",
            "updatedAt": "date"
        }
    ],
    "count": 100
}
```

#### Get Design by ID
```http
GET /api/designs/:id
```

Response:
```json
{
    "_id": "string",
    "name": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
}
```

#### Create Design
```http
POST /api/designs
```

Request Body:
```json
{
    "name": "string",
    "status": "string"
}
```

Response:
```json
{
    "_id": "string",
    "name": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
}
```

#### Update Design
```http
PUT /api/designs/:id
```

Request Body:
```json
{
    "name": "string",
    "status": "string"
}
```

Response:
```json
{
    "_id": "string",
    "name": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
}
```

#### Update Design Status
```http
PATCH /api/designs/:id/status
```

Request Body:
```json
{
    "status": "string"
}
```

Response:
```json
{
    "_id": "string",
    "name": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
}
```

#### Delete Design (Soft Delete)
```http
DELETE /api/designs/:id
```

Response: 204 No Content

### Analysis API

#### Analyze Design
```http
POST /api/analysis/:designId/analyze
```

Response:
```json
{
    "analysisId": "string",
    "results": {
        // Analysis results
    }
}
```

#### Get Cached Analysis
```http
GET /api/analysis/:designId/analyze
```

Response:
```json
{
    "analysisId": "string",
    "results": {
        // Cached analysis results
    }
}
```

#### Compare Designs
```http
GET /api/analysis/compare?ids=id1,id2,id3
```

Response:
```json
[
    {
        "designId": "string",
        "results": {
            // Analysis results for each design
        }
    }
]
```

### Electricity Rates API

#### Get All Rates
```http
GET /api/electricity-rates
```

Query Parameters:
- `skip` (optional): Number of records to skip
- `limit` (optional): Number of records to return

Response:
```json
{
    "rates": [
        {
            "_id": "string",
            "rateType": "PEAK|OFF_PEAK|BASE",
            "rate": "number",
            "unit": "string",
            "startDate": "date",
            "endDate": "date",
            "isActive": "boolean",
            "createdAt": "date",
            "updatedAt": "date"
        }
    ],
    "count": 100
}
```

#### Get Active Rates
```http
GET /api/electricity-rates/active
```

Response:
```json
[
    {
        "_id": "string",
        "rateType": "PEAK|OFF_PEAK|BASE",
        "rate": "number",
        "unit": "string",
        "startDate": "date",
        "endDate": "date",
        "isActive": "boolean"
    }
]
```

#### Get Rate by ID
```http
GET /api/electricity-rates/:id
```

#### Create Rate
```http
POST /api/electricity-rates
```

Request Body:
```json
{
    "rateType": "PEAK|OFF_PEAK|BASE",
    "rate": "number",
    "unit": "string",
    "startDate": "date",
    "endDate": "date",
    "isActive": "boolean"
}
```

#### Update Rate
```http
PUT /api/electricity-rates/:id
```

#### Delete Rate
```http
DELETE /api/electricity-rates/:id
```

### Solar Radiation API

#### Get All Solar Radiation Data
```http
GET /api/solar-radiation
```

Query Parameters:
- `skip` (optional): Number of records to skip
- `limit` (optional): Number of records to return

Response:
```json
{
    "data": [
        {
            "_id": "string",
            "location": {
                "latitude": "number",
                "longitude": "number",
                "name": "string"
            },
            "month": "number",
            "year": "number",
            "dailyAverage": "number",
            "peakHours": "number",
            "unit": "string",
            "source": "string",
            "createdAt": "date",
            "updatedAt": "date"
        }
    ],
    "count": 100
}
```

#### Get Solar Radiation by Location
```http
GET /api/solar-radiation/location?latitude=number&longitude=number&year=number
```

Query Parameters:
- `latitude` (required): Location latitude
- `longitude` (required): Location longitude
- `year` (optional): Filter by year

#### Get Solar Radiation by ID
```http
GET /api/solar-radiation/:id
```

#### Create Solar Radiation Data
```http
POST /api/solar-radiation
```

Request Body:
```json
{
    "location": {
        "latitude": "number",
        "longitude": "number",
        "name": "string"
    },
    "month": "number",
    "year": "number",
    "dailyAverage": "number",
    "peakHours": "number",
    "unit": "string",
    "source": "string"
}
```

#### Update Solar Radiation Data
```http
PUT /api/solar-radiation/:id
```

#### Delete Solar Radiation Data
```http
DELETE /api/solar-radiation/:id
```

## Development

### Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 