import UpClient from '../lib/client/UpClient';

export const client = new UpClient({
	personalAccessToken: process.env.UP_TOKEN as string
});

