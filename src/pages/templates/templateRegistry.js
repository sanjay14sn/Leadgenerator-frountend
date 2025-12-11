// src/pages/templates/templateRegistry.js

/* ------------------------------------------------------
   IMPORT ALL TEMPLATE FILES
------------------------------------------------------- */
import TemplateA from "./TemplateA";                       // Default Template
import TemplateB_CarWash from "./TemplateB_CarWash";       // Car Wash Template
import TemplateC_Salon from "./TemplateC_Salon";           // Salon Template
import TemplateD_Jewels from "./TemplateD_Jewels";         // Jewelry Template

/* ------------------------------------------------------
   CATEGORY → TEMPLATE MAPPING
   The key is matched using string includes()
------------------------------------------------------- */
export const TEMPLATE_MAP = {
  /* ------------ Car Wash Businesses ------------ */
  "car wash": TemplateB_CarWash,
  "detailing": TemplateB_CarWash,
  "car detailing": TemplateB_CarWash,
  "car care": TemplateB_CarWash,

  /* ------------ Beauty / Salon Businesses ------------ */
  "salon": TemplateC_Salon,
  "beauty salon": TemplateC_Salon,
  "spa": TemplateC_Salon,
  "makeup": TemplateC_Salon,
  "hair salon": TemplateC_Salon,

  /* ------------ Jewelry Stores ------------ */
  "jewelry": TemplateD_Jewels,
  "jeweller": TemplateD_Jewels,
  "jeweler": TemplateD_Jewels,
  "jewelry store": TemplateD_Jewels,
  "gold": TemplateD_Jewels,
  "silver": TemplateD_Jewels,
  "diamond": TemplateD_Jewels,
  "ornaments": TemplateD_Jewels,
  "bridal jewelry": TemplateD_Jewels,
  "wholesale jeweler": TemplateD_Jewels,
};

/* ------------------------------------------------------
   DEFAULT TEMPLATE
------------------------------------------------------- */
export const DEFAULT_TEMPLATE = TemplateA;

/* ------------------------------------------------------
   FUNCTION: getTemplateByCategory(category)
   This will:
   1. Convert category → lowercase
   2. Search through TEMPLATE_MAP keys
   3. Find if category contains any keyword
   4. Return the corresponding template
   5. Otherwise return TemplateA
------------------------------------------------------- */
export function getTemplateByCategory(category) {
  if (!category || typeof category !== "string") {
    return DEFAULT_TEMPLATE;
  }

  const cat = category.toLowerCase();

  // Search all keys (e.g., "jewelry", "car wash", etc.)
  for (const key in TEMPLATE_MAP) {
    if (cat.includes(key)) {
      return TEMPLATE_MAP[key];
    }
  }

  return DEFAULT_TEMPLATE; // fallback
}
