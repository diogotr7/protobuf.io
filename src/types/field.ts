import { SizedRawMessage } from ".";

export type VarInt = {
  int: string;
  uint: string;
  sint: string;
};

export type Fixed32 = {
  uint32Representation: number;
  int32Representation: number;
};

export type Fixed64 = {
  uint64Representation: string;
  int64Representation: string;
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
