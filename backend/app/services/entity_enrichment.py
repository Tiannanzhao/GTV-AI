"""
Service for identifying entities (events, products, organizations, programs) 
in text and enriching them with background information.
"""

import re
from typing import List, Dict, Optional
import requests
from urllib.parse import quote


class EntityEnrichmentService:
    """
    Identifies entities in text and enriches them with background information.
    """
    
    # Common patterns for identifying entities
    ORGANIZATION_KEYWORDS = [
        r'\b[A-Z][a-z]+ (?:Inc|Corp|LLC|Ltd|Company|Technologies|Systems|Solutions|Group)\b',
        r'\b(?:Google|Microsoft|Apple|Amazon|Facebook|Meta|Tesla|Netflix|Uber|Airbnb)\b',
        r'\b[A-Z][A-Za-z]+ (?:University|College|Institute|Lab|Laboratory)\b',
        r'\b(?:MIT|Stanford|Harvard|Oxford|Cambridge)\b',
    ]
    
    PRODUCT_KEYWORDS = [
        r'\b[A-Z][a-z]+ (?:App|Platform|System|Software|Tool|Framework|Library)\b',
        r'\b(?:iOS|Android|Windows|Linux|macOS|React|Vue|Angular|TensorFlow|PyTorch)\b',
    ]
    
    EVENT_KEYWORDS = [
        r'\b(?:Conference|Summit|Workshop|Hackathon|Competition|Award|Festival)\s+[A-Z][a-z]+\b',
        r'\b(?:WWDC|Google I/O|F8|Build|CES|SXSW|DEF CON)\b',
    ]
    
    PROGRAM_KEYWORDS = [
        r'\b(?:Program|Initiative|Project|Campaign|Challenge)\s+[A-Z][a-z]+\b',
        r'\b(?:Y Combinator|Techstars|500 Startups|Accelerator|Incubator)\b',
    ]

    @staticmethod
    def extract_entities(text: str) -> Dict[str, List[str]]:
        """
        Extract entities from text using pattern matching.
        Returns a dictionary with entity types as keys and lists of entities as values.
        """
        entities = {
            "organizations": [],
            "products": [],
            "events": [],
            "programs": [],
        }
        
        # Extract organizations
        for pattern in EntityEnrichmentService.ORGANIZATION_KEYWORDS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities["organizations"].extend([m.strip() for m in matches if m.strip()])
        
        # Extract products
        for pattern in EntityEnrichmentService.PRODUCT_KEYWORDS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities["products"].extend([m.strip() for m in matches if m.strip()])
        
        # Extract events
        for pattern in EntityEnrichmentService.EVENT_KEYWORDS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities["events"].extend([m.strip() for m in matches if m.strip()])
        
        # Extract programs
        for pattern in EntityEnrichmentService.PROGRAM_KEYWORDS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities["programs"].extend([m.strip() for m in matches if m.strip()])
        
        # Remove duplicates while preserving order
        for key in entities:
            seen = set()
            entities[key] = [x for x in entities[key] if not (x in seen or seen.add(x))]
        
        return entities

    @staticmethod
    def search_wikipedia(entity: str) -> Optional[str]:
        """
        Search Wikipedia for background information about an entity.
        Returns a brief summary if found.
        """
        try:
            # Wikipedia API endpoint
            url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + quote(entity)
            # Use shorter timeout to avoid blocking
            response = requests.get(url, timeout=2)
            
            if response.status_code == 200:
                data = response.json()
                extract = data.get("extract", "")
                # Limit to first 200 characters for brevity
                if extract:
                    return extract[:200] + "..." if len(extract) > 200 else extract
        except requests.exceptions.Timeout:
            print(f"Wikipedia API timeout for {entity}")
        except requests.exceptions.RequestException as e:
            print(f"Error searching Wikipedia for {entity}: {e}")
        except Exception as e:
            print(f"Unexpected error searching Wikipedia for {entity}: {e}")
        
        return None

    @staticmethod
    def enrich_text(text: str) -> Dict[str, any]:
        """
        Main method to enrich text with entity background information.
        Returns enriched text and metadata about found entities.
        """
        # Extract entities
        entities = EntityEnrichmentService.extract_entities(text)
        
        # Collect all unique entities
        all_entities = []
        for entity_type, entity_list in entities.items():
            all_entities.extend([(entity_type, entity) for entity in entity_list])
        
        # Search background information for each entity (limit to 2 to avoid timeout)
        background_info = []
        enriched_sections = []
        
        # Limit to 2 entities max to ensure fast response
        for entity_type, entity_name in all_entities[:2]:
            try:
                background = EntityEnrichmentService.search_wikipedia(entity_name)
                if background:
                    background_info.append({
                        "entity": entity_name,
                        "type": entity_type,
                        "background": background,
                    })
                    # Create a small paragraph for this entity
                    enriched_sections.append(
                        f"\n\n[Background: {entity_name}] {background}"
                    )
            except Exception as e:
                print(f"Error processing entity {entity_name}: {e}")
                continue  # Skip this entity and continue - don't fail the whole request
        
        # Combine original text with enriched sections
        enriched_text = text
        if enriched_sections:
            enriched_text += "\n\n--- Contextual Background Information ---"
            enriched_text += "".join(enriched_sections)
        
        return {
            "original_text": text,
            "enriched_text": enriched_text,
            "entities_found": entities,
            "background_info": background_info,
        }

