import { Reader } from "protobufjs";
import { Sized } from "./sized";
import { Tag } from "./tag";
import { VarInt, Fixed32, Fixed64 } from "./primitives";
import { RawLengthDelimited } from "./length_delimited";

export class SizedReader {
  private readonly reader: Reader;

  constructor(bytes: Uint8Array) {
    this.reader = new Reader(bytes);
  }

  get len(): number {
    return this.reader.len;
  }

  get pos(): number {
    return this.reader.pos;
  }

  set pos(value: number) {
    this.reader.pos = value;
  }

  public tag(): Tag {
    const offset = this.reader.pos;
    const varInt = this.reader.uint32();
    const size = this.reader.pos - offset;

    const fieldNumber = varInt >>> 3;
    const wireType = varInt & 7;

    return {
      data: {
        fieldNumber,
        wireType,
      },
      offset,
      size,
    };
  }

  public varint(): VarInt {
    const offset = this.reader.pos;

    const int = this.reader.int64().toString();
    this.reader.pos = offset;
    const uint = this.reader.uint64().toString();
    this.reader.pos = offset;
    const sint = this.reader.sint64().toString();

    const size = this.reader.pos - offset;

    return {
      data: {
        int,
        uint,
        sint,
      },
      offset,
      size,
    };
  }

  public lengthDelimited(): RawLengthDelimited {
    //hack: we do this so we can measure how long the varint that tells us the size of the length delimited field is
    const offset_length = this.reader.pos;
    const lengthDelimitedContent_length = this.reader.uint32();
    const size_length = this.reader.pos - offset_length;
    this.reader.pos = offset_length;

    const offset = this.reader.pos;
    const data = this.reader.bytes();
    const size = this.reader.pos - offset;

    //this Sized object represents the size of the header of the length delimited field.
    // This header is essentially a varint that tells us how long the length delimited field is.
    const sizedLength: Sized<number> = {
      data: lengthDelimitedContent_length,
      offset: offset_length,
      size: size_length,
    };

    //this one is the actual data of the length delimited field.
    const sizedData: Sized<Uint8Array> = {
      data,
      offset,
      size,
    };

    //sizedData.size should equal sizedLength.data
    return {
      rawHeader: sizedLength,
      rawBody: sizedData,
    };
  }

  public fixed32(): Fixed32 {
    const offset = this.reader.pos;

    const uint32Representation = this.reader.fixed32();
    this.reader.pos = offset;
    const int32Representation = this.reader.sfixed32();
    this.reader.pos = offset;
    const floatRepresentation = this.reader.float();

    const size = this.reader.pos - offset;

    return {
      data: {
        uint32Representation,
        int32Representation,
        floatRepresentation,
      },
      offset,
      size,
    };
  }

  public fixed64(): Fixed64 {
    const offset = this.reader.pos;

    const uint64Representation = this.reader.fixed64().toString();
    this.reader.pos = offset;
    const int64Representation = this.reader.sfixed64().toString();
    this.reader.pos = offset;
    const doubleRepresentation = this.reader.double();

    const size = this.reader.pos - offset;

    return {
      data: {
        uint64Representation,
        int64Representation,
        doubleRepresentation,
      },
      offset,
      size,
    };
  }
}
