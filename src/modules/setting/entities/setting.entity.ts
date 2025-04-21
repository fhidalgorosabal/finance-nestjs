import { ConceptType } from "@prisma/client";

export interface SettingInfo {
  currentMonth: string;
  currentYear: string;  
  companyCode: string;
  companyName: string;
  type: ConceptType;
}
