import AccountResource from '../resources/AccountResource';
import {MoneyObject} from "../resources/types";
import {AccountRelationships} from "../types";

export type UpClientOptions = {
  personalAccessToken: string;
};

type ResponseLinks = {
  prev?: string;
  next?: string;
};

type AccountAttributes = {
  displayName: string;
  accountType: string
  balance: MoneyObject
  createdAt: string
  ownershipType: string;
}

type AccountResourceResponse = {
  type: string;
  id: string;
  attributes: AccountAttributes;
  relationships: AccountRelationships
  links?: {
    self: string
  }
}



export type AccountResponse = {
  data: [AccountResourceResponse];
  links: ResponseLinks;
};
