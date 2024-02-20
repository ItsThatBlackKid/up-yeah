import {ResourceType} from "../types";

export interface IResource {
  type: ResourceType;
  id: string;
}

export default abstract class Resource implements IResource {
  protected constructor(id: string, type: ResourceType) {
    this.id = id;
    this.type = type;
  }
  type: ResourceType;
  id: string;

}

