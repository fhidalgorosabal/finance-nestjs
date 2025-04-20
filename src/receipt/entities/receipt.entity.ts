import { ConceptType } from "@prisma/client";

export interface ReceiptInfo {
  id: number;
  amount: number;
  date: Date;
  actualAmount: number;
  concept: string;
  type: ConceptType;
  currency: string;
  account: string;
}
