import { WireType } from "./tag";
import { Field } from "./field";
import { Message } from "./message";
import { SizedReader } from "./reader";
import { Sized } from "./sized";
import { LengthDelimitedBody } from "./length_delimited";

export function decodeBytes(bytes: Uint8Array): Message {
  if (!bytes || bytes.length === 0)
    return { offset: 0, size: 0, data: { fields: [] } };

  const message = readMessage(bytes);
  // sanityCheckSizes(message);
  return message;
}

export function readMessage(data: Uint8Array): Message {
  const reader = new SizedReader(data);

  const fields: Field[] = [];

  while (reader.pos < reader.len) {
    fields.push(readField(reader));
  }

  return {
    offset: 0,
    size: data.length,
    data: {
      fields,
    },
  };
}

function readField(reader: SizedReader): Field {
  const tag = reader.tag();

  switch (tag.data.wireType) {
    case WireType.Varint: {
      const varint = reader.varint();

      return {
        fieldHeader: tag,
        fieldBody: {
          fieldType: "varint",
          fieldData: varint,
        },
      };
    }
    case WireType.Bit32: {
      const fixed32 = reader.fixed32();

      return {
        fieldHeader: tag,
        fieldBody: {
          fieldType: "fixed32",
          fieldData: fixed32,
        },
      };
    }
    case WireType.Bit64: {
      const fixed64 = reader.fixed64();

      return {
        fieldHeader: tag,
        fieldBody: {
          fieldType: "fixed64",
          fieldData: fixed64,
        },
      };
    }
    case WireType.LengthDelimited: {
      const { rawHeader: header, rawBody: data } = reader.lengthDelimited();

      const lengthDelimited = lengthDelimitedFromRaw(data);

      return {
        fieldHeader: tag,
        fieldBody: {
          fieldType: "lengthDelimited",
          fieldData: {
            offset: header.offset,
            // how many bytes the header varint takes + the actual byte size
            size: header.size + data.size,
            data: {
              lengthDelimitedHeader: header,
              lengthDelimitedBody: lengthDelimited,
            },
          },
        },
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
      throw new Error(
        `unknown wire type ${tag.data.wireType} ${WireType[tag.data.wireType]}`
      );
    }
  }
}

// hacky: we have read a raw byte array that is length delimited.
// we will try and read it as any of the possible things it can contain.
// Those are, in order of preference:
// 1. a submessage
// 2. a repeated field
// 3. a string
// 4. bytes
// If it fails to parse as any of those, we will just assume it's bytes.
// We should also leave the header intact, because that part is present regardless of content.
function lengthDelimitedFromRaw(raw: Sized<Uint8Array>): LengthDelimitedBody {
  try {
    const message = readMessage(raw.data);

    return {
      lengthDelimitedType: "message",
      lengthDelimitedData: message,
    };
  } catch (e) {
    console.debug(
      "Failed parsing message from length delimited field. This is probably not an error. Falling back to string or bytes.",
      e
    );
  }

  //TODO: we should also try to read it as a packed field.

  // If it fails to parse as a message, we will try to parse it as a string.
  const possibleString = tryReadString(raw.data);
  if (possibleString) {
    return {
      lengthDelimitedType: "string",
      lengthDelimitedData: possibleString,
    };
  }

  // If it fails to parse as a string, we will just assume it's bytes.
  return {
    lengthDelimitedType: "bytes",
    lengthDelimitedData: raw.data,
  };
}

// //If the data of the field is a submessage, it will deal with its size itself?
// function readLengthDelimited(reader: Reader): [LengthDelimited, number] {
//   //possible data:
//   // 1. submessage
//   // 2. repeated field
//   // 3. string
//   // 4. bytes

//   // We should try to parse this as the data types described above, in order. If all else fails, just assume bytes.
//   const before = reader.pos;
//   //read how long the data is first.
//   const length = reader.uint32();
//   //then, we measure how long this varint header is
//   const varIntHeaderLength = reader.pos - before;
//   //we do not rewind here, if it *is* a submessage, it assumes we've already read the len varint.

//   //if try read tag works, we need to then figure out whether it's a submessage or a repeated field. It's safe to exhaust the buffer, we'll never read past where we should.
//   try {
//     //TODO: need to deal with packed repeated fields here.
//     // as far as i understand, they're a length delimited field, that contains a single tag at the start,
//     //  then the actual data of the field repeated until we finish the payload (with no more tags).
//     // Checking for its existence without type information is a bit of a pain. Probably force read a tag,
//     //  then be more permissive reading following tags within that length delimited payload.
//     const subMessage = readMessage(reader, length);
//     return [
//       {
//         data: subMessage,
//         innerType: "message",
//       },
//       varIntHeaderLength,
//     ];
//   } catch (e) {
//     reader.pos = before;
//     console.debug(
//       "Failed parsing message from length delimited field. This is probably not an error. Falling back to string or bytes.",
//       e
//     );
//     //let the other parsers try to parse this.
//   }

//   //the other two parsers don't really care about a Reader, so we can just pass the bytes.
//   const bytes = reader.bytes();

//   //if try read tag fails, we need to try to parse it as a string.
//   const possibleString = tryReadString(bytes);
//   if (possibleString) {
//     return [
//       {
//         data: possibleString,
//         innerType: "string",
//       },
//       varIntHeaderLength,
//     ];
//   }

//   //if that fails, just assume it's bytes.
//   return [
//     {
//       data: bytes,
//       innerType: "bytes",
//     },
//     varIntHeaderLength,
//   ];
// }

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

// function sanityCheckSizes(message: SizedRawMessage, pointer = 0) {
//   for (const field of message.fields) {
//     if (field.offset !== pointer) {
//       throw new Error(
//         `Field offset ${field.offset} does not match pointer ${pointer}`
//       );
//     }

//     pointer += field.tagSize;

//     if (
//       field.type === "lengthDelimited" &&
//       field.data.innerType === "message"
//     ) {
//       sanityCheckSizes(field.data.data, pointer);
//     }

//     pointer += field.dataSize;
//   }
// }
