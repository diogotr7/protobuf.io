import { Text } from "@chakra-ui/react";
import { Field } from "../types";
import { BytesDisplay } from "./BytesDisplay";
import { MessageDisplay } from "./MessageDisplay";
import { RepeatedFieldDisplay } from "./RepeatedFieldDisplay";
import { VarIntDisplay } from "./VarIntDisplay";

export function DataDisplay({
  field: { type, data },
  depth,
}: {
  field: Field;
  depth: number;
}) {
  switch (type) {
    case "bytes":
      return <BytesDisplay bytes={data} />;
    case "fixed32":
      return <Text fontFamily="mono">{data.int32Representation}</Text>;
    case "fixed64":
      return <Text fontFamily="mono">{data.toString()}</Text>;
    case "message":
      return <MessageDisplay message={data} depth={depth} />;
    case "repeatedField":
      return <RepeatedFieldDisplay fields={data} depth={depth} />;
    case "string":
      return <Text fontFamily="mono">{data}</Text>;
    case "varint":
      return <VarIntDisplay varInt={data} />;
  }
}
