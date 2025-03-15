import { Long } from "protobufjs";

export type VarInt = {
  int32Representation: number;
  uint32Representation: number;
  sint32Representation: number;

  int64Representation: Long;
  uint64Representation: Long;
  sint64Representation: Long;

  booleanRepresentation: boolean;
};

export type Fixed32 = {
  uint32Representation: number;
  int32Representation: number;
};

export type Fixed64 = {
  uint64Representation: Long;
  int64Representation: Long;
};

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

export type RawField =
  | {
      type: "message";
      data: SizedRawMessage;
    }
  //TODO: Implement packedField
  //   | {
  //       type: "packedField";
  //       data: RawField[];
  //     }
  | {
      type: "varint";
      data: VarInt;
    }
  | {
      type: "string";
      data: string;
    }
  | {
      type: "bytes";
      data: Uint8Array;
    }
  | {
      type: "fixed64";
      data: Fixed64;
    }
  | {
      type: "fixed32";
      data: Fixed32;
    };

export enum WireType {
  /**
   * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
   */
  Varint = 0,
  /**
   * Used for fixed64, sfixed64, double.
   * Always 8 bytes with little-endian byte order.
   */
  Bit64 = 1,
  /**
   * Used for string, bytes, embedded messages, packed repeated fields
   *
   * Only repeated numeric types (types which use the varint, 32-bit,
   * or 64-bit wire types) can be packed. In proto3, such fields are
   * packed by default.
   */
  LengthDelimited = 2,
  /**
   * Used for groups
   * @deprecated
   */
  StartGroup = 3,
  /**
   * Used for groups
   * @deprecated
   */
  EndGroup = 4,
  /**
   * Used for fixed32, sfixed32, float.
   * Always 4 bytes with little-endian byte order.
   */
  Bit32 = 5,
}
