import { LengthDelimited } from "./length_delimited";
import { VarInt, Fixed64, Fixed32 } from "./primitives";
import { Tag } from "./tag";

export type FieldBody =
  | {
      fieldType: "lengthDelimited";
      fieldData: LengthDelimited;
    }
  | {
      fieldType: "varint";
      fieldData: VarInt;
    }
  | {
      fieldType: "fixed64";
      fieldData: Fixed64;
    }
  | {
      fieldType: "fixed32";
      fieldData: Fixed32;
    };

export type Field = {
  /* The header is the tag that indicates the field number and wire type */
  fieldHeader: Tag;

  /* The data is the actual content of the field */
  fieldBody: FieldBody;
};
