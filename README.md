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

The `ResourceCollection` class holds an array of resources and allows for pagination through convenience methods.

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
