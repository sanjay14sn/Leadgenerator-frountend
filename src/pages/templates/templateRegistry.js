// src/pages/templates/templateRegistry.js

import TemplateA from "./TemplateA";
import TemplateB_CarWash from "./TemplateB_CarWash";
import TemplateC_Salon from "./TemplateC_Salon";
import TemplateD_Jewels from "./TemplateD_Jewels";

/* ---------------------------------------
   TEMPLATE LIST (for chooser page)
--------------------------------------- */
export const TEMPLATE_LIST = [
  {
    key: "default",
    name: "Business Classic",
    component: TemplateA,
    preview: "/previews/template-a.png",
  },
  {
    key: "carwash",
    name: "Car Wash / Auto Care",
    component: TemplateB_CarWash,
    preview: "/previews/template-carwash.png",
  },
  {
    key: "salon",
    name: "Salon / Beauty",
    component: TemplateC_Salon,
    preview: "/previews/template-salon.png",
  },
  {
    key: "jewelry",
    name: "Jewelry Store",
    component: TemplateD_Jewels,
    preview: "/previews/template-jewels.png",
  },
];

/* ---------------------------------------
   CATEGORY → TEMPLATE MAP (auto)
--------------------------------------- */
const TEMPLATE_MAP = {
  "car wash": TemplateB_CarWash,
  "detailing": TemplateB_CarWash,
  "salon": TemplateC_Salon,
  "spa": TemplateC_Salon,
  "jewelry": TemplateD_Jewels,
  "gold": TemplateD_Jewels,
};

/* ---------------------------------------
   DEFAULT
--------------------------------------- */
const DEFAULT_TEMPLATE = TemplateA;

/* ---------------------------------------
   AUTO SELECT (BY CATEGORY)
--------------------------------------- */
export function getTemplateByCategory(category) {
  if (!category) return DEFAULT_TEMPLATE;

  const cat = category.toLowerCase();

  for (const key in TEMPLATE_MAP) {
    if (cat.includes(key)) {
      return TEMPLATE_MAP[key];
    }
  }

  return DEFAULT_TEMPLATE;
}

/* ---------------------------------------
   MANUAL SELECT (BY KEY)
--------------------------------------- */
export function getTemplateByKey(key) {
  return (
    TEMPLATE_LIST.find((t) => t.key === key)?.component ||
    DEFAULT_TEMPLATE
  );
}
