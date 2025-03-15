import { RawField } from "./field";

export type Size = {
  offset: number;
  tagSize: number;
  dataSize: number;
};

export type RawMessage = {
  fields: FieldWithNumber[];
};

export type FieldWithNumber = {
  fieldNumber: number;
  field: SizedRawField;
};

export type SizedRawMessage = RawMessage & Size;

export type SizedRawField = RawField & Size;
