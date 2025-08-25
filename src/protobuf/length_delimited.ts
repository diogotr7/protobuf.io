import { Message } from "./message";
import { VarInt, Fixed64, Fixed32 } from "./primitives";
import { Sized } from "./sized";

//packed fields can not be strings or bytes.
//TODO: can packed fields be messages?
export type PackedField =
  | {
      packedFieldType: "varint";
      packedBody: VarInt[];
    }
  | {
      packedFieldType: "fixed64";
      packedBody: Fixed64[];
    }
  | {
      packedFieldType: "fixed32";
      packedBody: Fixed32[];
    };

export type LengthDelimitedBody =
  | {
      lengthDelimitedType: "message";
      lengthDelimitedData: Message;
    }
  | {
      lengthDelimitedType: "packedField";
      lengthDelimitedData: PackedField;
    }
  | {
      lengthDelimitedType: "string";
      lengthDelimitedData: string;
    }
  | {
      lengthDelimitedType: "bytes";
      lengthDelimitedData: Uint8Array;
    };

//the only reason this is Sized is for ease of use. All the sized means is the sum of both components
export type LengthDelimited = Sized<{
  /* The header is the varint that indicates the length of the data */
  lengthDelimitedHeader: Sized<number>;

  /* The data is the actual content of the length delimited field */
  lengthDelimitedBody: LengthDelimitedBody;
}>;

export type RawLengthDelimited = {
  /* The header is the varint that indicates the length of the data */
  rawHeader: Sized<number>;

  /* The data is the raw bytes of the length delimited field */
  rawBody: Sized<Uint8Array>;
};
