import { Long } from "protobufjs";
import { SizedRawMessage } from ".";

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

export type RawField =
  | {
      type: "message";
      data: SizedRawMessage;
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
//TODO: Implement packedField
//   | {
//       type: "packedField";
//       data: RawField[];
//     }
