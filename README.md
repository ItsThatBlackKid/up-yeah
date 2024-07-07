# Up Yeah

[![Test](https://github.com/ItsThatBlackKid/up-yeah/actions/workflows/test-action.yml/badge.svg)](https://github.com/ItsThatBlackKid/up-yeah/actions/workflows/test-action.yml)
[![Build and Release](https://github.com/ItsThatBlackKid/up-yeah/actions/workflows/release-action.yml/badge.svg)](https://github.com/ItsThatBlackKid/up-yeah/actions/workflows/release-action.yml)

A Javascript wrapper for the [Up Banking API](https://developer.up.com.au/#welcome)

## Installation

**npm**
`npm i up-yeah`

**Yarn**
`yarn add up-yeah`

## Usage

##### Using the `UpClient`

The simplest way to start is to create a client instance and export it for use elsewhere.

You can create a client object by calling the `UpClient` constructor and providing an `options` object with a personal access token:

**Typescript**

```typescript
// create a a client
import UpClient, { UpClientOptions } from 'up-yeah/client';

const options: UpClientOptions = {
	personalAccessToken: process.env.UP_TOKEN as string,
};

export const client = new UpClient(options);
```

**Javascript**

```javascript
import UpClient, { UpClientOptions } from 'up-yeah/client';

const options = {
	personalAccessToken: process.env.UP_TOKEN as string
};

export const client = new UpClient(options);
```

And here's how you'd use the `client` in another file:

**Typescript**

```typescript
import { GetAccountsQueryOptions } from 'up-yeah/client';
import AccountResource from 'up-yeah/resources/Account';
import client from './client';

const accounts: AccountResource = await client.getAccounts();
```

**Javascript**

```javascript
import client from './client';

const accounts = await client.getAccounts();
```

You can also use an `AccountResource` object to get its transactions

**Typescript**

```typescript
import {
	GetAccountsQueryOptions,
	GetTransactionsQueryOptions,
} from 'up-yeah/client';
import { OwnershipTypeEnum } from 'up-yeah';
import AccountResource from 'up-yeah/resources/Account';
import ResourceColelction from 'up-yeah/resources/Resource';
import TransactionResource from 'up-yeah/resources/Account';
import client from './client';

const options: GetAccountsQueryOptions = {
	filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
};

const accounts: ResourceCollection<AccountResource> = await client.getAccounts(
	options,
);

const transactions: ResourceCollection<TransactionResource> =
	await accounts[0].getTransactions();
```

**Javascript**

```javascript
import {
	GetAccountsQueryOptions,
	GetTransactionsQueryOptions,
} from 'up-yeah/client';
import client from './client';

const options = {
	filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
};

const accounts = await client.getAccounts(options);

const transactions = await accounts[0].getTransactions();
```

For more info, checkout [API](#api)

##### Using `ResourceCollection`

The `ResourceCollection` class holds an array of resources and allows for pagination through the use of `next` and `prev`  methods.

Example:

```typescript
import {
	GetAccountsQueryOptions,
	GetTransactionsQueryOptions,
} from 'up-yeah/client';
import { OwnershipTypeEnum } from 'up-yeah';
import AccountResource from 'up-yeah/resources/Account';
import ResourceColelction from 'up-yeah/resources/Resource';
import TransactionResource from 'up-yeah/resources/Account';
import client from './client';

const options: GetAccountsQueryOptions = {
	filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
};

const accounts: ResourceCollection<AccountResource> = await client.getAccounts(
	options,
);

console.log(accounts.resources);
const nextAccounts: AccountResource[]  = await accounts.next();
console.log(nextAccounts);
const prevAccounts: AccountResource[] = await accounts.prev();
```

#### Error handling

When an error occurs, the Up API responds with an array of one or more errors. When an UpError occurs, this package will throw an `UpErrorCollection` error with all the errors.

Example:

```typescript
import {
	GetAccountsQueryOptions,
	GetTransactionsQueryOptions,
} from 'up-yeah/client';
import client from './client';
import UpErrorCollection from 'up-yeah/erros/UpErrorCollection';

async function getAccounts() {
	const options = {
		filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
	};

	try {
		const accounts = await client.getAccounts(options);
	} catch (e: unknown) {
		if (e instanceof UpErrorCollection) {
			console.log(e.getFirstError()); //get first error
			console.log(e.errors);
		}
	}
}
```

## API

### `UpClient` `(src/client/UpClient.ts)` 
A class that exposes the Up API endpoints in its methods, using `axios` to handle requests. 

Returns: an `UpClient` object.

#### `options: UpClientOptions`
UpClient options passed to parameter
* `personalAccessToken` - Up Personal Access Token   
```typescript
interface UpClientOptions {
	personalAccessToken: string;
};
```

#### Methods


`getClientInstance(): Axios` - Getter for the clientInstance property
* Returns: `Axios` instance created by client

`getAccounts(options?)` - Get a paginated list of all accounts for the currently authenticated user.
* Ref: [List Accounts](https://developer.up.com.au/#get_accounts)
* Request: `GET /accounts`
* Returns: `Promise<ResourceCollection<AccountResource>>`
* Parameters:
  * `options?: GetAccountsQueryOptions` - Params to be provided to the endpoint.

`getAccount(id)` - Get account with matching `id`.
* Ref: [Retrieve Account](https://developer.up.com.au/#get_accounts_id)
* Request: `GET /accounts/{id}`
* Returns: `Promise<ResourceCollection<AccountResource>>`
* Parameters:
    * `id: string` - The unique idenifier of the account.

`getTransaction(transactionId)` - Get the transaction with matching `id`.
* Ref: [Retrieve Transaction](https://developer.up.com.au/#get_transactions_id)
* Request: `GET /transactions/{id}`.
* Returns: `Promise<TransactionResource>`
* Parameters: 
  * `transactionId: string` - The unique identifier of the transaction


`getTransactions(options?)` - Get a paginated list of all transactions across all accounts.

* Ref: [List Transactions](https://developer.up.com.au/#get_transactions)
* Request: `GET /transactions`
* Returns: `Promise<ResourceCollection<TransactionResource>>`
* Parameters:
  * `options?: GetTransactionsQueryOptions`

`getTransactionsByAccount(accountId: string, options?)` - Get a list of transactions based on a unique account identifier

* Ref: [List transactions by account](https://developer.up.com.au/#get_accounts_accountId_transactions)
* Request: `GET /accounts/{accountId}/transactions`
* Returns: `Promise<ResourceCollection<TransactionResource>>`
* Parameters:
  * `accountId` - the unique account identifier.
  * `options?: GetTransactionsQueryOptions` - request query params.

`getCategories()` - Get a non-paginated list of categories and their ancestry
* Ref: [List categories](https://developer.up.com.au/#get_categories)
* Request: `GET /categories`
* Returns: `Promise<ResourceCollection<CategroyResource>>`

`categorizeTransaction(transactionId,category)` - Update the category associated with a transaction
* Ref: [Categorize transaction](https://developer.up.com.au/#patch_transactions_transactionId_relationships_category)
* Request: `PATCH /transactions/{transactionId}/relationships/category`
* Returns: `Promise<boolean>`
* Parameters:
  * `transactionId: string` - the unique identifier of the transaction
  * `category` - the category to update the transaction with

`getCategory(id: string)`
* Ref: [Retrieve a category](https://developer.up.com.au/#get_categories_id)
* Request: `GET /categories/{id}`
* Returns: `Promise<CategoryResource>`
* Paramaters: 
  * `id: string` - the category to retrieve.

`getTags()` - Get a paginated list of all tags in use.
Ref: [List tags](https://developer.up.com.au/#get_tags)
* Request: `GET /tags`
* Returns: `Promise<ResourceCollection<TagResource>>`

`addTagsToTransaction(transactionId, payload)` - Associate one or more tags with a specific transaction.
* Ref: [Add tags to transaction](https://developer.up.com.au/#post_transactions_transactionId_relationships_tags)
* Request: `POST /transactions/{transactionId}/relationships/tags`
* Returns: `Promise<boolean>`
* Parameters:
  * `transactionId: string` - the unique transaction identifier 
  * `paylod:  PostTagPayload[]` - the list of tags to associate with the transaction

`removeTagsFromTransaction(transactionId)`
* Ref: [Remove tags from transaction](https://developer.up.com.au/#delete_transactions_transactionId_relationships_tags)
* Request: `DELETE /transactions/{transactionId}/relationships/tags`
* Returns: `Promise<boolean>` 
* Parameters: 
  * `transactionId: string` - the unique transaction identifier


***
### `ResourceCollection` `src/resources/Resource/ResourceCollection.ts`
A pagination wrapper for Up resources. 

The class takes a generic which must extend the `Resource` class. 

Pagination is offered through the `prev()` and `next()` methods.

#### Methods

`prev()` - Retrieve the previous list of pages if available.
  
`next()` - Retrieve the next list of page if available.

***
### Types

`GetAccountsQueryOptions` - Typescript interface for the List Accounts params.
* `pageSize` - the number of records to return in each page.
* `filterAccType` - the type of account for which to return records. This can be used to filter Savers from spending accounts.
* `filterAccOwnershipType` - the account ownership structure for which to return records. This can be used to filter 2Up accounts from Up accounts.
 ```typescript
 interface GetAccountsQueryOptions {
	pageSize?: number;
	filterAccType?: AccountTypeEnum;
	filterAccOwnershipType?: OwnershipTypeEnum;
};
 ```