import { Reader } from "protobufjs";
import { FieldWithNumber, SizedRawMessage } from "./types";
import { WireType } from "./types/WireType";
import { Fixed32, Fixed64, RawField, VarInt } from "./types/field";

export function decodeBytes(bytes: Uint8Array): SizedRawMessage {
  if (!bytes || bytes.length === 0)
    return { offset: 0, dataSize: 0, fields: [] };

  const message = readMessage(new Reader(bytes), bytes.length);
  sanityCheckSizes(message);
  return message;
}

export function readMessage(reader: Reader, dataSize: number): SizedRawMessage {
  const fields: FieldWithNumber[] = [];

  const initialPos = reader.pos;
  while (reader.pos < initialPos + dataSize) {
    fields.push(readField(reader));
  }

  return {
    offset: initialPos,
    dataSize,
    fields,
  };
}

function readField(reader: Reader): FieldWithNumber {
  const offset = reader.pos;
  //todo: should this be a uint64 instead?
  const tag = reader.uint32();
  const fieldNumber = tag >>> 3;
  const wireType = tag & 7;
  let tagSize = reader.pos - offset;
  const dataBefore = reader.pos;

  switch (wireType) {
    case WireType.Varint: {
      const before = reader.pos;
      const data: VarInt = {
        int: "",
        uint: "",
        sint: "",
      };

      try {
        data.int = reader.int32().toString();
        reader.pos = before;
        data.uint = reader.uint32().toString();
        reader.pos = before;
        data.sint = reader.sint32().toString();
        reader.pos = before;
      } catch (e) {
        console.debug("Failed reading 32 bit varint, trying 64 bit varint", e);
        //try to read 32 bit varints. If it fails, it's probably a 64 bit varint
        reader.pos = before;
      }

      data.int = reader.int64().toString();
      reader.pos = before;
      data.uint = reader.uint64().toString();
      reader.pos = before;
      data.sint = reader.sint64().toString();

      const dataSize = reader.pos - dataBefore;

      return {
        fieldNumber,
        type: "varint",
        data,
        offset,
        tagSize,
        dataSize,
      };
    }
    case WireType.Bit32: {
      const before = reader.pos;
      const data: Fixed32 = {
        int32Representation: 0,
        uint32Representation: 0,
      };
      data.uint32Representation = reader.fixed32();
      reader.pos = before;
      data.int32Representation = reader.int32();

      const dataSize = reader.pos - dataBefore;

      return {
        fieldNumber,
        type: "fixed32",
        offset,
        tagSize,
        dataSize,
        data,
      };
    }
    case WireType.Bit64: {
      const before = reader.pos;
      const data: Fixed64 = {
        uint64Representation: "",
        int64Representation: "",
      };
      data.uint64Representation = reader.fixed64().toString();
      reader.pos = before;
      data.int64Representation = reader.sfixed64().toString();

      const dataSize = reader.pos - dataBefore;

      return {
        fieldNumber,
        type: "fixed64",
        offset,
        tagSize,
        dataSize,
        data,
      };
    }
    case WireType.LengthDelimited: {
      const [data, varIntHeaderLength] = readLengthDelimited(reader);
      const dataBytes = reader.pos - dataBefore;
      //early return here because handling is different
      return {
        fieldNumber,
        ...data,
        offset,
        //Adjusting sizes so the varintheader
        // is included as part of the tag, not the data.
        tagSize: tagSize + varIntHeaderLength,
        dataSize: dataBytes - varIntHeaderLength,
      };
    }
    case WireType.StartGroup: {
      //   reader.skip(WireType.StartGroup);
      //   console.debug("Skipping group.");
      //   //hacky, skip the group and go next
      //   return readField(reader);
      throw new Error("groups are not supported 1");
    }
    case WireType.EndGroup: {
      throw new Error("groups are not supported 2");
    }
    default: {
      throw new Error(`unknown wire type ${wireType} ${WireType[wireType]}`);
    }
  }
}

//If the data of the field is a submessage, it will deal with its size itself?
function readLengthDelimited(reader: Reader): [RawField, number] {
  //possible data:
  // 1. submessage
  // 2. repeated field
  // 3. string
  // 4. bytes

  // We should try to parse this as the data types described above, in order. If all else fails, just assume bytes.
  const before = reader.pos;
  //read how long the data is first.
  const length = reader.uint32();
  //then, we measure how long this varint header is
  const varIntHeaderLength = reader.pos - before;
  //we do not rewind here, if it *is* a submessage, it assumes we've already read the len varint.

  //if try read tag works, we need to then figure out whether it's a submessage or a repeated field. It's safe to exhaust the buffer, we'll never read past where we should.
  try {
    //TODO: need to deal with packed repeated fields here.
    // as far as i understand, they're a length delimited field, that contains a single tag at the start,
    //  then the actual data of the field repeated until we finish the payload (with no more tags).
    // Checking for its existence without type information is a bit of a pain. Probably force read a tag,
    //  then be more permissive reading following tags within that length delimited payload.
    const subMessage = readMessage(reader, length);
    return [
      {
        data: subMessage,
        type: "message",
      },
      varIntHeaderLength,
    ];
  } catch (e) {
    reader.pos = before;
    console.debug(
      "Failed parsing message from length delimited field. This is probably not an error. Falling back to string or bytes.",
      e
    );
    //let the other parsers try to parse this.
  }

  //the other two parsers don't really care about a Reader, so we can just pass the bytes.
  const bytes = reader.bytes();

  //if try read tag fails, we need to try to parse it as a string.
  const possibleString = tryReadString(bytes);
  if (possibleString) {
    return [
      {
        data: possibleString,
        type: "string",
      },
      varIntHeaderLength,
    ];
  }

  //if that fails, just assume it's bytes.
  return [
    {
      data: bytes,
      type: "bytes",
    },
    varIntHeaderLength,
  ];
}

function tryReadString(bytes: Uint8Array): string | null {
  try {
    const string = new TextDecoder("utf-8").decode(bytes);
    //if more than 50% of the bytes are valid ASCII, assume it's a string.
    if (
      string.length > 0 &&
      (string.match(/[ -~]/g)?.length ?? 0) / string.length > 0.5
    ) {
      return string;
    }
    return null;
  } catch (e) {
    console.debug(
      "Failed parsing string from length delimited field. This is probably not an error.",
      e
    );
    return null;
  }
}

function sanityCheckSizes(message: SizedRawMessage, pointer = 0) {
  for (const field of message.fields) {
    if (field.offset !== pointer) {
      throw new Error(
        `Field offset ${field.offset} does not match pointer ${pointer}`
      );
    }

    pointer += field.tagSize;

    if (field.type === "message") {
      sanityCheckSizes(field.data, pointer);
    }

    pointer += field.dataSize;
  }
}
