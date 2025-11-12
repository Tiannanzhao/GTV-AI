# Tech Nation Application Tool

A comprehensive web application to help users prepare Tech Nation Global Talent Visa applications by intelligently organizing and formatting evidence documents according to Tech Nation standards.

## Features

- **Stage 1: Criteria Matching** - Interactive questionnaire to determine the best application path (Exceptional Talent vs Exceptional Promise)
- **Stage 2: Evidence Collection** - Upload and AI-powered classification of supporting documents
- **Stage 3: Evidence Assembly** - Drag-and-drop interface to combine materials into formatted evidence files
- **Stage 4: Quality Check & Export** - Comprehensive validation and PDF export with proper formatting
- **Stage 5: Submission Tracking** - Track application status and access submitted materials

## Tech Stack

### Frontend
- Next.js 14+ with TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Zustand for state management
- @dnd-kit for drag-and-drop

### Backend
- Python FastAPI
- PostgreSQL database
- AWS S3 for file storage
- Onerouter API for AI document classification
- WeasyPrint for PDF generation

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL database
- AWS S3 bucket (or compatible storage)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Create `.env` files in both `frontend` and `backend` directories:

**Frontend (.env.local)**:
```
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**Backend (.env)**:
```
ONEROUTER_API_KEY=your-onerouter-api-key
DATABASE_URL=postgresql://user:password@localhost:5432/tech_nation_db
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=your-bucket-name
S3_REGION=us-east-1
SECRET_KEY=your-jwt-secret
CORS_ORIGINS=http://localhost:3000
```

## Project Structure

```
/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── shared/            # Shared types/utilities
└── README.md
```

## Development

The application follows a 5-stage workflow:
1. Criteria matching and path planning
2. Evidence collection and classification
3. Evidence assembly and optimization
4. Quality check and export
5. Submission tracking

## License

Proprietary - All rights reserved

