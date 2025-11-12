# Tech Nation Application Tool - Implementation Plan

## Architecture Overview

**Frontend**: Next.js 14+ with TypeScript, App Router, Tailwind CSS
**Backend**: Python FastAPI for API endpoints, PDF generation, and AI processing
**AI Service**: Onerouter API integration for document classification
**PDF Generation**: WeasyPrint (HTML/CSS to PDF) with reportlab for advanced features
**Storage**: AWS S3 or compatible cloud storage for user files
**Database**: PostgreSQL for user data, application state, and metadata
**Deployment**: Vercel (frontend) + Railway/Render (backend) or full-stack on single platform

## Project Structure

```
/
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── dashboard/      # Main application flow
│   │   │   ├── stage1/    # Criteria matching
│   │   │   ├── stage2/    # Evidence collection
│   │   │   ├── stage3/    # Evidence assembly
│   │   │   ├── stage4/    # Quality check
│   │   │   └── stage5/    # Submission tracking
│   │   └── api/           # Next.js API routes (proxy to backend)
│   ├── components/        # React components
│   │   ├── questionnaire/ # Stage 1 components
│   │   ├── upload/        # Stage 2 components
│   │   ├── assembly/      # Stage 3 drag-drop components
│   │   └── shared/        # Shared UI components
│   ├── lib/               # Utilities, API clients
│   └── types/             # TypeScript definitions
│
├── backend/                # Python FastAPI application
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── documents.py
│   │   │   ├── classification.py
│   │   │   ├── assembly.py
│   │   │   └── export.py
│   │   ├── services/      # Business logic
│   │   │   ├── onerouter.py    # Onerouter integration
│   │   │   ├── pdf_generator.py
│   │   │   ├── criteria_matcher.py
│   │   │   ├── achievement_templates.py  # Achievement-specific material requirements
│   │   │   └── quality_checker.py
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── templates/     # PDF templates (HTML/CSS)
│   ├── requirements.txt
│   └── main.py
│
├── shared/                 # Shared types/utilities
└── README.md
```

## Implementation Phases

### Phase 1: Project Setup & Foundation

1. **Initialize Next.js project** with TypeScript, Tailwind CSS, and App Router
2. **Set up Python FastAPI backend** with project structure
3. **Configure database** (PostgreSQL) with initial schema:
   - Users table
   - Applications table (stores selected standards, recommendation path)
   - Materials table (uploaded files metadata)
   - Evidence table (assembled evidence files)
   - EvidenceMaterials junction table (many-to-many)
4. **Set up cloud storage** integration (AWS S3 or compatible)
5. **Configure environment variables** for API keys, database, storage
6. **Set up authentication** (NextAuth.js or similar)

### Phase 2: Stage 1 - Criteria Matching & Path Planning

#### 2.1 Welcome & Quick Assessment Page

1. **Build welcome page** (`/dashboard/stage1`):
   - Welcome title: "Let's Match Your Tech Nation Criteria"
   - Subtitle: "Answer a few questions, and we'll help you find the strongest application path"
   - Progress indicator

2. **Build interactive questionnaire component** with exact questions:
   - **Q1: Years of experience in tech field**
     - Options: `< 5 years` → Recommend Exceptional Promise, `≥ 5 years` → Recommend Exceptional Talent
     - Note: Professionals with >5 years cannot apply for Exceptional Promise
   - **Q2: Role type**
     - Options: Technical (Engineer, Architect, Tech Lead), Business (PM, Founder, Executive), Both
   - **Q3: Leadership roles in past 5 years** (multi-select)
     - Options: Founder/Co-founder, C-level Executive, Tech Lead/Principal Engineer, Product Lead
   - **Q4: Achievements** (multi-select)
     - Options: Salary/Equity/Bonus, Media Coverage/Interviews, Conference Speaking, Open Source Contributions, Tech Blog/Articles, Patents, Mentor/Reviewer Role, Product Launch with Users/Revenue, Technical Innovation, Industry Awards
   - **Q5: Financial proof availability**
     - Options: Yes/No
     - Note: Tech Nation wants to see financial success, not just industry influence

3. **Build question flow component**:
   - One question at a time with smooth transitions
   - Back/Next navigation
   - Progress bar
   - Save progress functionality

#### 2.2 Standard Recommendation Results Page

1. **Build recommendation results page** (`/dashboard/stage1/results`):
   - Display recommended path: "Exceptional Talent" or "Exceptional Promise"
   - Visual standard breakdown with sections:
     - **Mandatory Criterion (MC)**: Recognition as Leading Talent in Digital Technology
       - Recommended evidence types: High salary proof + Performance review, Recommendation letters (3), Position promotion records
     - **Optional Criterion 1 (OC1)**: Significant Contribution to Digital Technology
       - Recommended evidence types: Product metrics (users, revenue), Technical architecture docs, Project impact proof
     - **Optional Criterion 2 (OC3)**: Commercial Success or Product Leadership
       - Recommended evidence types: Financial data (revenue, funding), Product market position proof, Business contracts
   - Evidence quota allocation suggestion:
     - MC: 3-4 files
     - OC1: 3-4 files
     - OC3: 3 files
     - Total: 10 files
   - Success probability estimate (e.g., 85%)
   - Important note box: "Each criterion must have at least 2 unique evidence files"
   - CTA buttons:
     - "This combination works for me, start uploading materials"
     - "I want to choose a different standard combination"

2. **Implement criteria matching logic** in backend (`criteria_matcher.py`):
   - Rules engine for Exceptional Talent vs Exceptional Promise
   - Standard combination recommendation (MC + 2 OCs)
   - Evidence type suggestions based on questionnaire answers
   - Success probability calculation algorithm

3. **Build alternative standard selector** (if user chooses different combination):
   - Allow manual selection of MC + 2 OCs from available options
   - Show evidence type suggestions for selected standards

### Phase 3: Stage 2 - Evidence Collection & Classification

#### 3.1 Achievement-Based Material Collection

1. **Build achievement-driven upload page** (`/dashboard/stage2`):
   - **Top section**: List of user's selected achievements from Stage 1
     - Each achievement shows completion status (e.g., "2/3 materials uploaded")
     - Progress indicator per achievement
     - Click to expand/collapse achievement details
   
   - **Main content area**: Achievement-specific material collection form
     - When user clicks an achievement, show:
       - Achievement name and description
       - **Required materials checklist** (based on Tech Nation requirements for that achievement type)
       - **Upload sections** for each required material type:
         - File upload (drag-and-drop or click)
         - Text input fields (where applicable)
         - Date pickers
         - Link inputs (for online content)
       - **Optional materials** section
       - Save/Complete button for that achievement
   
   - **Right sidebar**: Material library summary
     - Total materials uploaded
     - Materials by achievement
     - Quick access to edit/delete materials

2. **Create achievement material templates** (based on Tech Nation requirements):
   - Each achievement type has specific required materials:
     - **Salary/Equity/Bonus**: Salary slips, equity grant letters, bonus statements, compensation summary
     - **Media Coverage/Interviews**: Article PDFs/screenshots, publication details, reach metrics, relevance statement
     - **Conference Speaking**: Event agenda, presentation slides, photos, audience size, event credibility proof
     - **Open Source Contributions**: Repository screenshots, contribution statistics, impact metrics, community recognition
     - **Tech Blog/Articles**: Article PDFs, publication details, readership metrics, impact statement
     - **Mentor/Reviewer Role**: Confirmation letters, scope documentation, mentee/testimonial statements
     - **Product Launch with Users/Revenue**: Dashboard screenshots, analytics reports, launch announcements, metrics summary
     - **Technical Innovation**: Architecture diagrams, design documents, technical specifications, impact analysis
     - **Industry Awards**: Award certificates, announcement letters, selection criteria, recognition details
     - **Leading a Project**: Project charter, team documentation, OKRs, release notes, impact metrics
     - **Innovative Product/Concept**: Prototypes, concept documentation, validation studies, market research
     - **Industry Community Leadership**: Community documentation, event materials, member testimonials, impact reports
     - **Generated Substantial Profits**: Revenue reports, financial statements, contracts (redacted), profit analysis
     - **Other achievements**: Custom fields based on user input
   
   - Templates stored in backend service (`achievement_templates.py`)
   - Each template defines:
     - Required material types (file uploads, text fields, dates, links)
     - Field labels and descriptions
     - Validation rules
     - Help text/guidance

3. **Build achievement material form component**:
   - Dynamic form generation based on achievement template
   - File upload zones (multiple per achievement)
   - Rich text editors for descriptions/narratives
   - Date pickers for timeline documentation
   - Link inputs for online content
   - Progress tracking (X/Y materials completed)
   - Validation and error handling

4. **Implement achievement-specific upload functionality**:
   - Multi-file selection per material type
   - File type validation (varies by material requirement)
   - Size validation (5MB limit per file)
   - Upload progress indicators per file
   - Error handling with achievement-specific guidance
   - Link materials to specific achievement type

5. **Implement file storage with achievement association**:
   - Upload to cloud storage (S3) with achievement folder structure
   - Generate thumbnails for images
   - Store metadata in database with achievement_type field
   - Create database records linking materials to achievements
   - Support text-based materials (stored as JSON/text in database)

#### 3.2 AI Material Classifier

1. **Integrate Onerouter API** (`onerouter.py`):
   - Document analysis endpoint
   - Classification service with analysis dimensions:
     - Content type identification
     - Related standard matching (MC/OC1/OC2/OC3)
     - Evidence strength rating (1-5 stars)
     - Time range check (within 5 years)
     - Merge suggestions (which materials can be combined)

2. **Build AI classification modal** (triggers after each upload):
   - Loading state: "Analyzing 'Salary_Slip_2024.pdf'..."
   - Results display:
     - File type: e.g., "Salary Proof"
     - Recommended standard: e.g., "MC - Recognition as Leading Talent"
     - Strength rating: ⭐⭐⭐⭐⭐ (High Salary)
     - Suggestion: e.g., "Merge with performance review into 1 evidence file"
     - Action buttons: "Accept Suggestion" / "Manual Classification"

3. **Implement classification logic**:
   - Call Onerouter API with document content
   - Parse response and map to Tech Nation standards
   - Calculate strength rating based on content quality
   - Generate merge suggestions based on document types

#### 3.3 Material Detail Editor

1. **Build material editor modal** (opens when clicking any material):
   - **Basic Information section**:
     - Title input (e.g., "Forbes Interview: My AI Product")
     - Date picker (e.g., "2024-03-15")
     - Type dropdown (Media Coverage, Salary Proof, etc.)
   
   - **Standard Assignment section**:
     - Checkboxes for standards:
       - [x] MC - Recognition as Leading Talent
       - [ ] OC1 - Significant Contribution
       - [ ] OC2 - Innovation
       - [ ] OC3 - Commercial Success
   
   - **Evidence Description section** (appears in final file):
     - Rich text editor
     - AI-assisted generation button
     - Example: "This Forbes article reports on the AI product I developed, which gained 100K users within 6 months of launch and was recognized by industry experts as..."
   
   - **Additional Links section**:
     - Add online link button
     - Link list with remove option
   
   - Action buttons: "Save" / "Cancel"

2. **Implement material update API**:
   - Update material metadata
   - Save standard assignments
   - Store evidence descriptions
   - Save additional links

### Phase 4: Stage 3 - Evidence Assembly & Optimization

#### 4.1 Evidence Assembly Workbench

1. **Build assembly workbench page** (`/dashboard/stage3`):
   - **Top status bar**:
     - Evidence file quota: "6/10 Generated | MC: 3 | OC1: 2 | OC3: 1"
     - Action buttons: "Smart Optimization Suggestions" / "Preview All" / "Export"
   
   - **Left panel: Material Pool**:
     - Title: "Unused Materials (12)"
     - Subtitle: "Drag to right side to assemble"
     - Material cards showing:
       - File name (e.g., "Salary_Slip_2024_Q4.pdf")
       - Classification: "Salary Proof | MC"
       - Strength rating: ⭐⭐⭐⭐⭐
       - Drag handle
     - Filter dropdown: "Filter by Type ▼"
     - Sort dropdown: "Sort by Strength ▼"
   
   - **Right panel: Evidence Slots** (organized by standard):
     - **MC: Recognition as Leading Talent section**:
       - Evidence #1 ✅ (completed)
         - Card showing: "💰 High Salary Proof"
         - Material list: "• Salary_2024.pdf • Bonus_Letter.pdf"
         - Page count: "2 pages"
         - Actions: Preview, Edit, Split
       - Evidence #2 ✅
       - Evidence #3 🔄 (generating...)
     
     - **OC1: Significant Contribution section**:
       - Warning: "⚠️ Need at least 2 evidence files"
       - "+ Add Evidence" button
     
     - **OC3: Commercial Success section**:
       - Similar structure

2. **Implement drag-and-drop functionality**:
   - Use @dnd-kit/core and @dnd-kit/sortable
   - Allow dragging multiple materials from left to right
   - Visual feedback during drag
   - Auto-merge materials into evidence file
   - Real-time page count calculation and warnings (max 3 pages)

3. **Build smart merge suggestions**:
   - Bubble tooltip: "💡 Suggestion: 'Salary_2024.pdf' and 'Bonus_Letter.pdf' can be merged into 1 strong salary recognition evidence"
   - "One-click Merge" button

4. **Implement page management**:
   - Auto-warning when evidence exceeds 3 pages
   - Smart cropping suggestions
   - Key information page highlighting

#### 4.2 Evidence File Auto-Formatting Engine

1. **Create PDF template system** (`pdf_generator.py`):
   - HTML/CSS templates using Jinja2
   - Template structure for each evidence file:
     - **Page 1: Cover Page**
       - Evidence number (e.g., "Evidence #1")
       - Criterion type (MANDATORY CRITERION / OPTIONAL CRITERION)
       - Criterion name (e.g., "Recognition as Leading Talent")
       - Evidence type (e.g., "Salary & Compensation")
       - Supporting documents list
       - Footer: "Prepared for Tech Nation Global Talent Visa Application"
     
     - **Page 2: Evidence Summary + Key Information**
       - Evidence summary section with bullet points
       - Key information highlights (salary amounts, role details, etc.)
       - Original document key pages with highlighted important info
     
     - **Page 3: Supplementary Documents** (if needed)
       - Additional document pages
       - Additional links section with QR codes for URLs

2. **Implement auto-formatting features**:
   - Unified font and format (clear and readable, per Tech Nation requirements)
   - Key information highlighting
   - Header showing evidence number and standard
   - Footer showing page numbers
   - Automatic table of contents
   - Online links converted to QR codes (for reviewer scanning)

3. **Build evidence preview component**:
   - Real-time preview of assembled evidence
   - Page-by-page navigation
   - Edit/Delete/Split actions
   - Page count display

#### 4.3 Smart Optimization Assistant

1. **Build optimization suggestions panel**:
   - Continuous scanning for issues
   - Three priority levels:
     - **⚠️ High Priority**: Critical issues (e.g., "OC1 only has 1 evidence, needs at least 2")
     - **💡 Optimization Suggestion**: Improvements (e.g., "Evidence #5 has 4 pages, exceeds 3-page limit")
     - **✨ Enhancement Suggestion**: Optional improvements (e.g., "Unused 'Conference Speaking' material can strengthen OC2 Innovation")
   
   - Each suggestion includes:
     - Description
     - Action buttons (e.g., "View Suggestion" / "Ignore", "Auto-optimize" / "Manual Edit", "Add to OC2" / "Keep Current")

2. **Implement optimization logic** (`quality_checker.py`):
   - Scan evidence distribution
   - Check page limits
   - Detect unused strong materials
   - Suggest evidence reallocation

### Phase 5: Stage 4 - Quality Check & Export

#### 5.1 Final Checklist

1. **Build quality checker service** (`quality_checker.py`):
   - Validate evidence count (exactly 10)
   - Check standard coverage (MC + 2 OCs, minimum 2 each)
   - Verify date ranges (all within 5 years)
   - Check page limits (max 3 per evidence)
   - Detect duplicate material usage
   - File clarity checks
   - Calculate overall score (0-100)
   - Estimate success probability

2. **Build final checklist page** (`/dashboard/stage4`):
   - **Checklist section**:
     - ✅ Evidence file count: 10/10
     - ✅ MC standard: 3 evidence files
     - ✅ OC1 standard: 4 evidence files
     - ✅ OC3 standard: 3 evidence files
     - ✅ All evidence within 5 years
     - ✅ Each evidence ≤ 3 pages
     - ✅ Files clear and readable
     - ✅ No duplicate material usage
   
   - **Warnings section**:
     - ⚠️ Items needing attention (e.g., "Evidence #7 date is November 2024 (close to application time, may be questioned by reviewer)")
     - "View Details" / "Adjust" buttons
   
   - **Overall score section**:
     - Score: 92/100
     - Estimated success rate: 88%
     - Action buttons: "View Full Report" / "Start Export"

#### 5.2 Export Options

1. **Build export options page**:
   - **Export format selection**:
     - Radio buttons: Single PDF (all 10 merged), 10 Individual PDFs, ZIP Archive
   
   - **File naming**:
     - Checkbox: "Use standard naming"
     - Preview: "Evidence_01_MC_Salary.pdf", "Evidence_02_MC_Recognition.pdf", etc.
   
   - **Include content**:
     - Checkboxes: 10 Evidence Files, Evidence Index, Materials Mapping Table, Original Materials Backup
   
   - Action buttons: "Download" / "Email to Me"

2. **Implement export functionality** (`export.py`):
   - Generate all evidence PDFs using WeasyPrint
   - Create Evidence Index PDF:
     - Header: "Tech Nation Evidence Index"
     - Applicant name and application date
     - Organized by criterion:
       - MANDATORY CRITERION section with evidence list
       - OPTIONAL CRITERION 1 section
       - OPTIONAL CRITERION 3 section
   
   - Generate Materials Mapping Table (shows which materials were used in which evidence)
   - Create Submission Guide PDF (`how_to_submit.pdf`):
     - Note: "From August 4, 2025, application process changed, must submit through updated Home Office Stage 1 Endorsement form"
     - Step-by-step submission guide
     - Important notes
   
   - Package files according to selected format
   - Apply standardized naming convention

3. **Implement file download/email**:
   - Generate ZIP file with all selected content
   - Download functionality
   - Email sending option (if user provides email)

### Phase 6: Stage 5 - Submission Tracking

#### 6.1 Submission Dashboard

1. **Build submission tracking page** (`/dashboard/stage5`):
   - **Current status section**:
     - Status: "Waiting for Tech Nation Review"
     - Progress timeline: "●━━━━●━━━━○━━━━○"
     - Stages: Submit → Under Review → Approved → Visa
     - Submission date: "2025-01-15"
     - Estimated decision date: "2025-03-12 (within 8 weeks)"
     - Days remaining: "42 days"
   
   - **Submitted materials section**:
     - List: "10 Evidence Files", "CV (3 pages)", "3 Recommendation Letters", "Personal Statement"
     - Action buttons: "View Submitted Files" / "Download Copy"
   
   - **Helpful resources section**:
     - "What can you do during the wait?"
     - Links: "Prepare visa stage documents", "Learn about ILR (Permanent Residence) requirements", "Join our community forum"

2. **Implement submission tracking logic**:
   - Store submission date
   - Calculate estimated decision date (8 weeks from submission)
   - Track application status
   - Store submitted file references

3. **Build file download functionality**:
   - Download submitted evidence package
   - View individual files
   - Download backup copies

### Phase 7: Polish & Optimization

1. **Add progress indicators** throughout all stages:
   - Stage progress bar at top of each page
   - Step indicators within stages
   - Completion percentages

2. **Implement keyboard shortcuts**:
   - Common actions (Save, Next, Back, etc.)
   - Shortcut help modal

3. **Add tooltips and help text**:
   - Contextual help icons
   - Tooltips for complex features
   - Help documentation links

4. **Optimize PDF generation**:
   - Caching for frequently generated PDFs
   - Background processing for large exports
   - Progress indicators during generation

5. **Add error handling**:
   - User-friendly error messages
   - Error recovery suggestions
   - Logging for debugging

6. **Implement loading states**:
   - Skeleton screens for data loading
   - Progress indicators for file uploads
   - Loading spinners for API calls

7. **Add responsive design**:
   - Mobile-friendly layouts
   - Tablet optimizations
   - Touch-friendly drag-and-drop on mobile

## Key Technical Decisions

1. **Onerouter Integration**: Create service wrapper (`onerouter.py`) for API calls, handle rate limiting, error handling, retry logic
2. **PDF Generation**: Use WeasyPrint for HTML-based templates (easier styling with CSS), reportlab for programmatic PDFs if needed for advanced features
3. **File Processing**: Use Python libraries (PyPDF2, pdf2image, Pillow) for document manipulation, page extraction, image processing on backend
4. **State Management**: React Context + Zustand for complex state management, Next.js server components where possible for data fetching
5. **API Communication**: RESTful API between frontend and backend, use Next.js API routes as proxy if needed for CORS
6. **Drag-and-Drop**: Use @dnd-kit/core and @dnd-kit/sortable for modern, accessible drag-and-drop
7. **QR Code Generation**: Use qrcode library in Python for converting URLs to QR codes in PDFs

## Database Schema

### Users Table
- id (UUID, PK)
- email (String, unique)
- name (String)
- created_at (Timestamp)
- updated_at (Timestamp)

### Applications Table
- id (UUID, PK)
- user_id (UUID, FK)
- path_type (Enum: ExceptionalTalent, ExceptionalPromise)
- mc_selected (Boolean)
- oc1_selected (Boolean)
- oc2_selected (Boolean)
- oc3_selected (Boolean)
- recommendation_data (JSON)
- current_stage (Integer: 1-5)
- created_at (Timestamp)
- updated_at (Timestamp)

### Materials Table
- id (UUID, PK)
- application_id (UUID, FK)
- achievement_type (String) # Links to specific achievement from questionnaire
- file_name (String, nullable) # Nullable for text-only materials
- file_path (String, nullable) # S3 path, nullable for text-only
- file_type (String)
- file_size (Integer, nullable)
- upload_date (Date)
- title (String)
- material_type (String) # Specific material type within achievement (e.g., "Salary Slip", "Bonus Letter")
- text_content (Text, nullable) # For text-based materials
- metadata (JSON) # Additional structured data (dates, numbers, links, etc.)
- suggested_standard (String) # MC, OC1, OC2, OC3
- strength_rating (Integer: 1-5)
- classification_data (JSON) # Onerouter response
- evidence_description (Text)
- additional_links (JSON)
- created_at (Timestamp)
- updated_at (Timestamp)

### Evidence Table
- id (UUID, PK)
- application_id (UUID, FK)
- evidence_number (Integer)
- standard_type (String) # MC, OC1, OC2, OC3
- evidence_type (String) # Salary Proof, Product Metrics, etc.
- title (String)
- page_count (Integer)
- pdf_path (String) # S3 path
- status (Enum: Draft, Generated, Exported)
- created_at (Timestamp)
- updated_at (Timestamp)

### EvidenceMaterials Table (Junction)
- evidence_id (UUID, FK)
- material_id (UUID, FK)
- page_range (String) # e.g., "1-2" if only using pages 1-2 of material
- order (Integer) # Order of materials in evidence

## Dependencies

**Frontend**:
- next@latest
- react@latest, react-dom@latest
- typescript
- tailwindcss
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- axios
- next-auth
- date-fns
- react-hook-form
- zod

**Backend**:
- fastapi
- uvicorn[standard]
- sqlalchemy
- alembic
- psycopg2-binary (PostgreSQL)
- boto3 (AWS S3)
- weasyprint
- reportlab
- jinja2
- httpx
- python-multipart
- PyPDF2
- pdf2image
- Pillow
- qrcode[pil]
- python-dotenv
- pydantic
- python-jose[cryptography] (JWT)

## Environment Variables

**Frontend (.env.local)**:
- `NEXT_PUBLIC_BACKEND_API_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

**Backend (.env)**:
- `ONEROUTER_API_KEY`
- `DATABASE_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `S3_REGION`
- `SECRET_KEY` (for JWT)
- `CORS_ORIGINS` (comma-separated)

