import { ConceptType } from "@prisma/client";

export interface MonthConcept {
  id: number;
  conceptDescription: string;
  type: ConceptType;
  totalAmount: number;
}

export interface MonthlyTotals {
  type: ConceptType;
  values: number[];
}

export interface GroupedObject {
  type: ConceptType;
  values: { [month: number]: number };
}

export interface MonthlyValues {
  [month: number]: number;
}
