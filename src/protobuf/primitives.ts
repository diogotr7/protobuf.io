import { Sized } from "./sized";

export type VarInt = Sized<{
  int: string;
  uint: string;
  sint: string;
}>;

export type Fixed32 = Sized<{
  uint32Representation: number;
  int32Representation: number;
  floatRepresentation: number;
}>;

export type Fixed64 = Sized<{
  uint64Representation: string;
  int64Representation: string;
  doubleRepresentation: number;
}>;
