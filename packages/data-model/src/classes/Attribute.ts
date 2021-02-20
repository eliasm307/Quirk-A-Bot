import { iAttribute } from "../declarations/interfaces";
import { AttributeCategory } from "../declarations/types";

export default class Attribute implements iAttribute {
  category: AttributeCategory;
  name: string;
  readonly rating: number;

  constructor () {
    
  }
  
}