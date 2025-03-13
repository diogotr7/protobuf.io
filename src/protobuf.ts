import { BinaryReader, WireType } from "@protobuf-ts/runtime";
import { Field, Message } from "./types";

export function decodeBytes(bytes: Uint8Array): Message {
  if (!bytes || bytes.length === 0) return new Map();

  return decodeProtobuf(new BinaryReader(bytes));
}

export function decodeProtobuf(reader: BinaryReader): Message {
  const fields: Map<number, Field> = new Map();

  while (reader.pos < reader.len) {
    const [fieldNumber, field] = readField(reader);
    if (!fields.has(fieldNumber)) {
      fields.set(fieldNumber, field);
      continue;
    }

    //if we already have a field with this number. It's a repeated field.
    //Check if we already have a repeated field, if not, create one.
    const existingField = fields.get(fieldNumber)!;
    if (existingField.tag === "repeatedField") {
      //TODO: check mismatched types?
      existingField.data.push(field);
    } else {
      //TODO: verify that the existing field is of the same type as the new field?
      fields.set(fieldNumber, {
        tag: "repeatedField",
        data: [existingField, field],
      });
    }
  }

  return fields;
}

function readField(reader: BinaryReader): [number, Field] {
  const [fieldNumber, wireType] = reader.tag();
  console.debug("field", fieldNumber, "wire type", WireType[wireType]);
  switch (wireType) {
    case WireType.Varint: {
      const before = reader.pos;
      const int32Representation = reader.int32();
      reader.pos = before;
      const uint32Representation = reader.uint32();
      reader.pos = before;
      const sint32Representation = reader.sint32();
      reader.pos = before;
      const int64Representation = reader.int64();
      reader.pos = before;
      const uint64Representation = reader.uint64();
      reader.pos = before;
      const sint64Representation = reader.sint64();
      reader.pos = before;
      const booleanRepresentation = reader.bool();

      return [
        fieldNumber,
        {
          data: {
            int32Representation,
            uint32Representation,
            sint32Representation,
            int64Representation,
            uint64Representation,
            sint64Representation,
            booleanRepresentation,
          },
          tag: "varint",
        },
      ];
    }
    case WireType.Bit32: {
      const before = reader.pos;
      const uint32Representation = reader.fixed32();
      reader.pos = before;
      const int32Representation = reader.int32();

      return [
        fieldNumber,
        {
          tag: "fixed32",
          data: {
            int32Representation,
            uint32Representation,
          },
        },
      ];
    }
    case WireType.Bit64: {
      const before = reader.pos;
      const uint64Representation = reader.fixed64();
      reader.pos = before;
      const int64Representation = reader.sfixed64();

      return [
        fieldNumber,
        {
          tag: "fixed64",
          data: {
            int64Representation,
            uint64Representation,
          },
        },
      ];
    }
    case WireType.LengthDelimited: {
      return readLengthDelimited(fieldNumber, reader.bytes());
    }
    case WireType.StartGroup: {
      reader.skip(WireType.StartGroup);
      console.debug("Skipping group.");
      //hacky, skip the group and go next
      return readField(reader);
    }
    case WireType.EndGroup: {
      throw new Error("groups are not supported");
    }
    default: {
      throw new Error("unknown wire type " + WireType[wireType]);
    }
  }
}

function readLengthDelimited(
  fieldNumber: number,
  bytes: Uint8Array
): [number, Field] {
  //possible data:
  // 1. submessage
  // 2. repeated field
  // 3. string
  // 4. bytes

  // We should try to parse this as the data types described above, in order. If all else fails, just assume bytes.
  const reader = new BinaryReader(bytes);

  //if try read tag works, we need to then figure out whether it's a submessage or a repeated field. It's safe to exhaust the buffer, we'll never read past where we should.
  try {
    const data = decodeProtobuf(reader);

    //kind of dodgy logic incoming, more of a heuristic than anything else.
    // We try to handle deciding whether it's a submessage or a repeated field as best as we can.
    // If we only have one field, there's no way to tell for sure, we just assume it's a submessage.
    // If there's multiple with the same field number, it has to be a repeated field.
    // If there's multiple with different field numbers, it's a submessage.

    const asArray = Array.from(data.entries());
    if (asArray.length > 1 && asArray.every((f) => f[0] === asArray[0][0])) {
      return [
        fieldNumber,
        {
          tag: "repeatedField",
          data: Array.from(data.values()),
        },
      ];
    }

    return [
      fieldNumber,
      {
        data: data,
        tag: "message",
      },
    ];
  } catch (e) {
    console.debug(
      "Failed parsing message from length delimited field. This is probably not an error. Falling back to string or bytes.",
      e
    );
    //let the other parsers try to parse this.
  }

  console.debug("Trying to parse as string or bytes.");

  //if try read tag fails, we need to try to parse it as a string.
  const possibleString = tryReadString(bytes);
  if (possibleString) {
    return [
      fieldNumber,
      {
        data: possibleString,
        tag: "string",
      },
    ];
  }

  //if that fails, just assume it's bytes.
  return [
    fieldNumber,
    {
      data: bytes,
      tag: "bytes",
    },
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
