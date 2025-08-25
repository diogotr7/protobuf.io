import { Field } from "./field";
import { Sized } from "./sized";

export type Message = Sized<{
  fields: Field[];
}>;
