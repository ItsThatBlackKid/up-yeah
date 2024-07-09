import UpClient, { UpClientOptions } from '../lib/client';

const options: UpClientOptions = {
	personalAccessToken: process.env.UP_TOKEN as string
};


export const client = new UpClient(options);


