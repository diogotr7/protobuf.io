import { PbLong, PbULong } from "@protobuf-ts/runtime";

export type VarInt = {
  int32Representation: number;
  uint32Representation: number;
  sint32Representation: number;

  int64Representation: PbLong;
  uint64Representation: PbULong;
  sint64Representation: PbLong;

  booleanRepresentation: boolean;
};

export type Fixed32 = {
  uint32Representation: number;
  int32Representation: number;
};

export type Fixed64 = {
  uint64Representation: PbULong;
  int64Representation: PbLong;
};

export type Message = {
  fields: Map<number, SizedField>;
  headerSize: number;
  dataSize: number;
};

export type SizedField = Field & { tagBytes: number; dataBytes: number };

export type Field =
  | {
      type: "message";
      data: Message;
    }
  | {
      type: "repeatedField";
      data: Field[];
    }
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
