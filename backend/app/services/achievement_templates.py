"""
Achievement templates defining required materials for each achievement type.
Based on Tech Nation requirements for different achievement types.
"""

from typing import Dict, List, Any
from enum import Enum


class MaterialFieldType(str, Enum):
    FILE_UPLOAD = "file_upload"
    TEXT = "text"
    DATE = "date"
    NUMBER = "number"
    LINK = "link"
    TEXTAREA = "textarea"


class MaterialField:
    """Defines a single material field requirement."""
    
    def __init__(
        self,
        field_id: str,
        label: str,
        field_type: MaterialFieldType,
        required: bool = True,
        help_text: str = "",
        validation: Dict[str, Any] = None,
        multiple: bool = False
    ):
        self.field_id = field_id
        self.label = label
        self.field_type = field_type
        self.required = required
        self.help_text = help_text
        self.validation = validation or {}
        self.multiple = multiple


class AchievementTemplate:
    """Template defining material requirements for an achievement type."""
    
    def __init__(
        self,
        achievement_type: str,
        name: str,
        description: str,
        required_fields: List[MaterialField],
        optional_fields: List[MaterialField] = None,
        suggested_standard: str = None
    ):
        self.achievement_type = achievement_type
        self.name = name
        self.description = description
        self.required_fields = required_fields
        self.optional_fields = optional_fields or []
        self.suggested_standard = suggested_standard


class AchievementTemplates:
    """Service providing achievement templates based on Tech Nation requirements."""
    
    def __init__(self):
        self.templates = self._initialize_templates()
    
    def get_template(self, achievement_type: str) -> AchievementTemplate:
        """Get template for a specific achievement type."""
        return self.templates.get(achievement_type)
    
    def get_all_templates(self) -> Dict[str, AchievementTemplate]:
        """Get all available templates."""
        return self.templates
    
    def _initialize_templates(self) -> Dict[str, AchievementTemplate]:
        """Initialize all achievement templates."""
        templates = {}
        
        # Salary/Equity/Bonus
        templates["Salary/Equity/Bonus"] = AchievementTemplate(
            achievement_type="Salary/Equity/Bonus",
            name="Salary, Equity, Bonus",
            description="Evidence of high compensation package demonstrating recognition as leading talent",
            required_fields=[
                MaterialField("salary_slips", "Salary Slips", MaterialFieldType.FILE_UPLOAD, True, "Upload recent salary slips (last 12 months)", {"max_files": 12}, True),
                MaterialField("compensation_summary", "Compensation Summary", MaterialFieldType.TEXTAREA, True, "Summarize your total compensation package including base, bonus, equity"),
                MaterialField("equity_grants", "Equity Grant Letters", MaterialFieldType.FILE_UPLOAD, False, "Equity/RSU grant documentation", {}, True),
                MaterialField("bonus_statements", "Bonus Statements", MaterialFieldType.FILE_UPLOAD, False, "Performance bonus letters or statements", {}, True),
            ],
            suggested_standard="MC"
        )
        
        # Media Coverage/Interviews
        templates["Media Coverage/Interviews"] = AchievementTemplate(
            achievement_type="Media Coverage/Interviews",
            name="Media Coverage/Interviews",
            description="Media recognition demonstrating industry influence and expertise",
            required_fields=[
                MaterialField("article_files", "Article PDFs/Screenshots", MaterialFieldType.FILE_UPLOAD, True, "Upload article PDFs or screenshots", {}, True),
                MaterialField("publication_name", "Publication Name", MaterialFieldType.TEXT, True, "Name of the publication/media outlet"),
                MaterialField("publication_date", "Publication Date", MaterialFieldType.DATE, True, "When was this published?"),
                MaterialField("reach_metrics", "Reach Metrics", MaterialFieldType.TEXTAREA, False, "Views, shares, audience size, etc."),
                MaterialField("article_links", "Article Links", MaterialFieldType.LINK, False, "Online article URLs", {}, True),
                MaterialField("relevance_statement", "Relevance Statement", MaterialFieldType.TEXTAREA, True, "Explain how this demonstrates your recognition as a leading talent"),
            ],
            suggested_standard="MC"
        )
        
        # Conference Speaking
        templates["Conference Speaking"] = AchievementTemplate(
            achievement_type="Conference Speaking",
            name="Conference Speaking",
            description="Speaking engagements demonstrating thought leadership",
            required_fields=[
                MaterialField("event_agenda", "Event Agenda/Program", MaterialFieldType.FILE_UPLOAD, True, "Conference agenda showing your session"),
                MaterialField("presentation_slides", "Presentation Slides", MaterialFieldType.FILE_UPLOAD, False, "Your presentation slides", {}, True),
                MaterialField("event_name", "Event Name", MaterialFieldType.TEXT, True, "Name of the conference/event"),
                MaterialField("event_date", "Event Date", MaterialFieldType.DATE, True, "When did this take place?"),
                MaterialField("audience_size", "Audience Size", MaterialFieldType.NUMBER, False, "Number of attendees"),
                MaterialField("event_photos", "Event Photos", MaterialFieldType.FILE_UPLOAD, False, "Photos from the event", {}, True),
                MaterialField("event_links", "Event Links", MaterialFieldType.LINK, False, "Event website or video recording", {}, True),
            ],
            suggested_standard="OC1"
        )
        
        # Open Source Contributions
        templates["Open Source Contributions"] = AchievementTemplate(
            achievement_type="Open Source Contributions",
            name="Open Source Contributions",
            description="Significant contributions to open source projects",
            required_fields=[
                MaterialField("repository_screenshots", "Repository Screenshots", MaterialFieldType.FILE_UPLOAD, True, "Screenshots of your contributions", {}, True),
                MaterialField("repository_links", "Repository Links", MaterialFieldType.LINK, True, "GitHub/GitLab repository URLs", {}, True),
                MaterialField("contribution_stats", "Contribution Statistics", MaterialFieldType.TEXTAREA, True, "Commits, PRs, issues resolved, etc."),
                MaterialField("impact_metrics", "Impact Metrics", MaterialFieldType.TEXTAREA, False, "Downloads, stars, forks, users, etc."),
                MaterialField("community_recognition", "Community Recognition", MaterialFieldType.FILE_UPLOAD, False, "Awards, mentions, testimonials", {}, True),
            ],
            suggested_standard="OC1"
        )
        
        # Tech Blog/Articles
        templates["Tech Blog/Articles"] = AchievementTemplate(
            achievement_type="Tech Blog/Articles",
            name="Tech Blog/Articles Published",
            description="Published technical articles demonstrating expertise",
            required_fields=[
                MaterialField("article_files", "Article PDFs", MaterialFieldType.FILE_UPLOAD, True, "PDFs of your published articles", {}, True),
                MaterialField("publication_details", "Publication Details", MaterialFieldType.TEXTAREA, True, "Publication name, date, and context"),
                MaterialField("readership_metrics", "Readership Metrics", MaterialFieldType.TEXTAREA, False, "Views, shares, comments, citations"),
                MaterialField("article_links", "Article Links", MaterialFieldType.LINK, True, "Online article URLs", {}, True),
                MaterialField("impact_statement", "Impact Statement", MaterialFieldType.TEXTAREA, True, "How these articles demonstrate your contribution"),
            ],
            suggested_standard="OC1"
        )
        
        # Mentor/Reviewer Role
        templates["Mentor/Reviewer Role"] = AchievementTemplate(
            achievement_type="Mentor/Reviewer Role",
            name="Mentor/Reviewer Role",
            description="Mentoring or reviewing roles demonstrating industry recognition",
            required_fields=[
                MaterialField("confirmation_letters", "Confirmation Letters", MaterialFieldType.FILE_UPLOAD, True, "Letters confirming your role", {}, True),
                MaterialField("scope_documentation", "Scope Documentation", MaterialFieldType.TEXTAREA, True, "Describe your mentoring/reviewing scope"),
                MaterialField("mentee_testimonials", "Mentee/Testimonial Statements", MaterialFieldType.FILE_UPLOAD, False, "Testimonials from mentees or organizations", {}, True),
                MaterialField("role_dates", "Role Period", MaterialFieldType.DATE, True, "Start date of role"),
            ],
            suggested_standard="MC"
        )
        
        # Product Launch with Users/Revenue
        templates["Product Launch with Users/Revenue"] = AchievementTemplate(
            achievement_type="Product Launch with Users/Revenue",
            name="Product Launch with Users/Revenue Data",
            description="Product launches demonstrating commercial success and impact",
            required_fields=[
                MaterialField("dashboard_screenshots", "Dashboard Screenshots", MaterialFieldType.FILE_UPLOAD, True, "Analytics dashboards showing metrics", {}, True),
                MaterialField("analytics_reports", "Analytics Reports", MaterialFieldType.FILE_UPLOAD, False, "Detailed analytics reports", {}, True),
                MaterialField("launch_announcements", "Launch Announcements", MaterialFieldType.FILE_UPLOAD, False, "Product launch announcements or press releases", {}, True),
                MaterialField("metrics_summary", "Metrics Summary", MaterialFieldType.TEXTAREA, True, "User count, revenue, growth rate, retention, etc."),
                MaterialField("launch_date", "Launch Date", MaterialFieldType.DATE, True, "When was the product launched?"),
            ],
            suggested_standard="OC3"
        )
        
        # Technical Innovation
        templates["Technical Innovation"] = AchievementTemplate(
            achievement_type="Technical Innovation",
            name="Technical Innovation",
            description="Technical innovations demonstrating significant contribution",
            required_fields=[
                MaterialField("architecture_diagrams", "Architecture Diagrams", MaterialFieldType.FILE_UPLOAD, True, "Technical architecture or design diagrams", {}, True),
                MaterialField("design_documents", "Design Documents", MaterialFieldType.FILE_UPLOAD, False, "Technical design documentation", {}, True),
                MaterialField("technical_specs", "Technical Specifications", MaterialFieldType.FILE_UPLOAD, False, "Technical specifications or RFCs", {}, True),
                MaterialField("impact_analysis", "Impact Analysis", MaterialFieldType.TEXTAREA, True, "Describe the innovation and its impact"),
                MaterialField("innovation_date", "Innovation Date", MaterialFieldType.DATE, True, "When was this innovation implemented?"),
            ],
            suggested_standard="OC1"
        )
        
        # Industry Awards
        templates["Industry Awards"] = AchievementTemplate(
            achievement_type="Industry Awards",
            name="Industry Awards",
            description="Industry awards recognizing excellence",
            required_fields=[
                MaterialField("award_certificates", "Award Certificates", MaterialFieldType.FILE_UPLOAD, True, "Award certificates or documentation", {}, True),
                MaterialField("announcement_letters", "Announcement Letters", MaterialFieldType.FILE_UPLOAD, False, "Official award announcements", {}, True),
                MaterialField("selection_criteria", "Selection Criteria", MaterialFieldType.TEXTAREA, False, "Award selection criteria and process"),
                MaterialField("recognition_details", "Recognition Details", MaterialFieldType.TEXTAREA, True, "Award name, organization, and what it recognizes"),
                MaterialField("award_date", "Award Date", MaterialFieldType.DATE, True, "When was the award received?"),
            ],
            suggested_standard="MC"
        )
        
        # Leading a Project
        templates["Leading a Project"] = AchievementTemplate(
            achievement_type="Leading a Project",
            name="Leading a Project",
            description="Project leadership demonstrating impact and responsibility",
            required_fields=[
                MaterialField("project_charter", "Project Charter", MaterialFieldType.FILE_UPLOAD, True, "Project charter or documentation"),
                MaterialField("team_documentation", "Team Documentation", MaterialFieldType.FILE_UPLOAD, False, "Team structure, org charts", {}, True),
                MaterialField("okrs", "OKRs/Goals", MaterialFieldType.FILE_UPLOAD, False, "Project objectives and key results", {}, True),
                MaterialField("release_notes", "Release Notes", MaterialFieldType.FILE_UPLOAD, False, "Product release notes or announcements", {}, True),
                MaterialField("team_size", "Team Size", MaterialFieldType.NUMBER, True, "Number of people you led"),
                MaterialField("project_timeline", "Project Timeline", MaterialFieldType.TEXTAREA, True, "Project duration and key milestones"),
                MaterialField("impact_metrics", "Impact Metrics", MaterialFieldType.TEXTAREA, True, "Project outcomes and impact"),
            ],
            suggested_standard="OC1"
        )
        
        # Innovative Product/Concept
        templates["Innovative Product/Concept"] = AchievementTemplate(
            achievement_type="Innovative Product/Concept",
            name="Worked on an Innovative Product or Concept",
            description="Innovative products or concepts demonstrating creativity and impact",
            required_fields=[
                MaterialField("prototypes", "Prototypes/Demos", MaterialFieldType.FILE_UPLOAD, False, "Product prototypes or demo videos", {}, True),
                MaterialField("concept_documentation", "Concept Documentation", MaterialFieldType.FILE_UPLOAD, True, "Concept notes, pitch decks, or design docs", {}, True),
                MaterialField("validation_studies", "Validation Studies", MaterialFieldType.FILE_UPLOAD, False, "User research, validation studies", {}, True),
                MaterialField("market_research", "Market Research", MaterialFieldType.FILE_UPLOAD, False, "Market analysis or research", {}, True),
                MaterialField("innovation_description", "Innovation Description", MaterialFieldType.TEXTAREA, True, "Describe the innovation and why it's significant"),
                MaterialField("concept_date", "Concept Date", MaterialFieldType.DATE, True, "When was this concept developed?"),
            ],
            suggested_standard="OC1"
        )
        
        # Industry Community Leadership
        templates["Industry Community Leadership"] = AchievementTemplate(
            achievement_type="Industry Community Leadership",
            name="Industry Community Leadership",
            description="Leadership roles in industry communities",
            required_fields=[
                MaterialField("community_documentation", "Community Documentation", MaterialFieldType.FILE_UPLOAD, True, "Documentation of your leadership role", {}, True),
                MaterialField("event_materials", "Event Materials", MaterialFieldType.FILE_UPLOAD, False, "Materials from community events you organized", {}, True),
                MaterialField("member_testimonials", "Member Testimonials", MaterialFieldType.FILE_UPLOAD, False, "Testimonials from community members", {}, True),
                MaterialField("community_size", "Community Size", MaterialFieldType.NUMBER, False, "Number of community members"),
                MaterialField("impact_reports", "Impact Reports", MaterialFieldType.TEXTAREA, True, "Describe your leadership impact and initiatives"),
                MaterialField("leadership_period", "Leadership Period", MaterialFieldType.DATE, True, "Start date of leadership role"),
            ],
            suggested_standard="OC1"
        )
        
        # Generated Substantial Profits
        templates["Generated Substantial Profits"] = AchievementTemplate(
            achievement_type="Generated Substantial Profits",
            name="Generated Substantial Profits",
            description="Financial success demonstrating commercial impact",
            required_fields=[
                MaterialField("revenue_reports", "Revenue Reports", MaterialFieldType.FILE_UPLOAD, True, "Financial reports showing revenue", {}, True),
                MaterialField("financial_statements", "Financial Statements", MaterialFieldType.FILE_UPLOAD, False, "Financial statements or summaries", {}, True),
                MaterialField("contracts", "Contracts (Redacted)", MaterialFieldType.FILE_UPLOAD, False, "Business contracts (with sensitive info redacted)", {}, True),
                MaterialField("profit_analysis", "Profit Analysis", MaterialFieldType.TEXTAREA, True, "Profit amounts, timeframe, and your role in generating them"),
                MaterialField("profit_period", "Profit Period", MaterialFieldType.DATE, True, "Period when profits were generated"),
            ],
            suggested_standard="OC3"
        )
        
        # Other achievements - dynamic template
        templates["Other"] = AchievementTemplate(
            achievement_type="Other",
            name="Other Achievement",
            description="Custom achievement with user-specified materials",
            required_fields=[
                MaterialField("achievement_description", "Achievement Description", MaterialFieldType.TEXTAREA, True, "Describe your achievement"),
                MaterialField("supporting_files", "Supporting Files", MaterialFieldType.FILE_UPLOAD, True, "Upload relevant supporting documents", {}, True),
                MaterialField("achievement_date", "Achievement Date", MaterialFieldType.DATE, True, "When did this achievement occur?"),
            ],
            optional_fields=[
                MaterialField("additional_links", "Additional Links", MaterialFieldType.LINK, False, "Relevant online links", {}, True),
                MaterialField("impact_statement", "Impact Statement", MaterialFieldType.TEXTAREA, False, "How this achievement demonstrates your expertise"),
            ]
        )
        
        return templates

