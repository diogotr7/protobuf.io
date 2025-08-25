import { Text } from "@chakra-ui/react";
import { BytesDisplay } from "./BytesDisplay";
import { MessageDisplay } from "./MessageDisplay";
import { VarIntDisplay } from "./VarIntDisplay";
import { Fixed32Display } from "./Fixed32Display";
import { Fixed64Display } from "./Fixed64Display";
import { Field } from "../../protobuf/field";

export function DataDisplay({ field }: { field: Field }) {
  const { fieldBody: fieldData } = field;

  const { fieldType: type, fieldData: data } = fieldData;

  switch (type) {
    case "lengthDelimited": {
      switch (data.data.lengthDelimitedBody.lengthDelimitedType) {
        case "bytes":
          return (
            <BytesDisplay
              bytes={data.data.lengthDelimitedBody.lengthDelimitedData}
            />
          );
        case "message":
          return (
            <MessageDisplay
              message={data.data.lengthDelimitedBody.lengthDelimitedData}
            />
          );
        case "string":
          return (
            <Text fontFamily="mono">
              {data.data.lengthDelimitedBody.lengthDelimitedData}
            </Text>
          );
        case "packedField":
          return <Text fontFamily="mono">Packed Field</Text>;
      }
    }
    case "fixed32":
      return <Fixed32Display fixed32={data} />;
    case "fixed64":
      return <Fixed64Display fixed64={data} />;
    case "varint":
      return <VarIntDisplay varInt={data} />;
  }
}
