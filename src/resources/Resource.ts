import {ResourceType} from "./types";

export interface Resource {
  resourceType: ResourceType;
  id: string;
}

export default Resource;
