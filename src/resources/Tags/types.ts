import {IResource} from "../Resource";
import {TagRelationships} from "../types";

export interface ITagResource extends IResource {
	relationships: TagRelationships;
}