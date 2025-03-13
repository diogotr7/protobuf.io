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

export type Message = Map<number, Field>;

export type Field =
  | {
      tag: "message";
      data: Message;
    }
  | {
      tag: "repeatedField";
      data: Field[];
    }
  | {
      tag: "varint";
      data: VarInt;
    }
  | {
      tag: "string";
      data: string;
    }
  | {
      tag: "bytes";
      data: Uint8Array;
    }
  | {
      tag: "fixed64";
      data: Fixed64;
    }
  | {
      tag: "fixed32";
      data: Fixed32;
    };
