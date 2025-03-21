import { Text } from "@chakra-ui/react";
import { SizedRawField } from "../../types";
import { BytesDisplay } from "./BytesDisplay";
import { MessageDisplay } from "./MessageDisplay";
import { VarIntDisplay } from "./VarIntDisplay";

export function DataDisplay({
  field: { type, data },
}: {
  field: SizedRawField;
}) {
  switch (type) {
    case "bytes":
      return <BytesDisplay bytes={data} />;
    case "fixed32":
      return <Text fontFamily="mono">{data.int32Representation}</Text>;
    case "fixed64":
      return <Text fontFamily="mono">{data.toString()}</Text>;
    case "message":
      return <MessageDisplay message={data} />;
    case "string":
      return <Text fontFamily="mono">{data}</Text>;
    case "varint":
      return <VarIntDisplay varInt={data} />;
  }
}
