import { RawField } from "./field";

export type RawMessage = {
  fields: FieldWithNumber[];
};

export type FieldWithNumber = {
  fieldNumber: number;
  field: SizedRawField;
};

export type SizedRawMessage = RawMessage & {
  offset: number;
  dataSize: number;
  //Messages don't have a tag size really. Initially it felt to me like they should,
  // but in essence the root of the buffer starts off with the tag of the first field (meaning no tag for the message itself)
  // and any submessages are decoded from lenght delimited fields. I used to have the dagSize here mean the size of the varint
  // referring to the length delimited bytes, but that's more the tag size of the field, no of the contained message.
};

export type SizedRawField = RawField & {
  offset: number;
  tagSize: number;
  dataSize: number;
};
