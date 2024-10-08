import UpClient, {UpClientOptions} from "up-yeah";

const options: UpClientOptions = {
	personalAccessToken: process.env.UP_TOKEN as string
};

export const client = new UpClient(options);


