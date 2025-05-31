# Energy Analysis Backend

A backend service for analyzing building designs and managing energy-related data.

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

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
    "error": "Error message",
    "status": 400
}
```

Common status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

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