import {MoneyObject, OwnershipTypeEnum} from "../resources/types";
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
  accountType: string;
  balance: MoneyObject;
  createdAt: string;
  ownershipType: string;
};

type AccountResourceResponse = {
  type: string;
  id: string;
  attributes: AccountAttributes;
  relationships: AccountRelationships;
  links?: {
    self: string;
  };
};

export type GetAccountsResponse = {
  data: [AccountResourceResponse];
  links: ResponseLinks;
};

export type GetAccountResponse = {
  data: AccountResourceResponse;
  links: ResponseLinks;
}

export type GetAccountsQueryOptions = {
  pageSize?: number,
  filterAccType?: string,
  filterAccOwnershipType?: OwnershipTypeEnum
}
export type ErrorObject = {
  status: string;
  title: string;
  detail: string;
  source?: {
    parameter?: string;
    pointer?: string;
  };
};
