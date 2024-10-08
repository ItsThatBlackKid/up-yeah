export type ErrorSource = {
	parameter?: string;
	pointer?: string;
};

export interface IUpError {
	status: string;
	title: string;
	detail: string;
	source?: ErrorSource;
}