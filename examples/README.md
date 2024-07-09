# `up-yeah` Examples
This folder contains example usages of `up-yeah`. 

Each file contains multiple functions with examples of how to access and updates resources using this library. 

## Pre-requisites
In order to run the examples, you must fulfill the following pre-reqs: 

* Install ts-node: `npm i ts-node -g`
* Set the UP_TOKEN in your environment:
  * Create a .env file in this folder and add `UP_TOKEN=<your-up-token>`
  * OR (Linux/macOS): `export UP_TOKEN=<your-up-token>`
  * OR (Windows): `set UP_TOKEN=<your-up-token>`

## Running examples

To run a specific function in a file, uncomment the function and run the file with `ts-node`

E.g:
```typescript
/** accounts.ts **/
//... rest of file
(async () => {
	// getTransactionsByAccount()
	// await getTransactionsWithOptions();
	// await getAccountsPagination()
	await getAccounts();
	// await getAccountsWithOptions();
})();
```
`$ ts-node accounts.ts`
