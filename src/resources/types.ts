
export enum OwnershipTypeEnum {
  INDIVIDUAL = "INDIVIDUAL",
  JOINT = "JOINT",
}

export type MoneyObject = {
  currencyCode: string;
  value: string;
  valueInBaseUnits: number;
};

export type AccountAttributes = {
  displayName: string;
  accountType: string;
  ownershipType: OwnershipTypeEnum;
  balance: MoneyObject;
  createdAt: Date;
};
