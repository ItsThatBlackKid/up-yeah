import {ResourceType} from "../types";
import {Resource} from "./Resource";
import {Maybe} from "../../types";

export interface IResource {
    type: ResourceType;
    id: string;
}

export interface IResourceLink<T extends Resource> {
    prev: () => Promise<Maybe<T[]>>;
    next: () => Promise<Maybe<T[]>>;
}