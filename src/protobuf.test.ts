import { expect, test } from "vitest";
import { decodeBytes } from "./protobuf";
import { examples } from "./utils/exampleBuffers";
import { SizedRawMessage } from "./types";

const ex1: SizedRawMessage = {
  offset: 0,
  dataSize: 39,
  fields: [
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 2,
          dataSize: 12,
          fields: [
            {
              fieldNumber: 14,
              field: {
                data: {
                  offset: 4,
                  dataSize: 10,
                  fields: [
                    {
                      fieldNumber: 1,
                      field: {
                        data: {
                          int: "6175",
                          uint: "6175",
                          sint: "-3088",
                        },
                        type: "varint",
                        offset: 4,
                        tagSize: 1,
                        dataSize: 2,
                      },
                    },
                    {
                      fieldNumber: 2,
                      field: {
                        data: {
                          int: "2017",
                          uint: "2017",
                          sint: "-1009",
                        },
                        type: "varint",
                        offset: 7,
                        tagSize: 1,
                        dataSize: 2,
                      },
                    },
                    {
                      fieldNumber: 3,
                      field: {
                        data: {
                          int: "50",
                          uint: "50",
                          sint: "25",
                        },
                        type: "varint",
                        offset: 10,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                    {
                      fieldNumber: 4,
                      field: {
                        data: {
                          int: "25",
                          uint: "25",
                          sint: "-13",
                        },
                        type: "varint",
                        offset: 12,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 2,
                tagSize: 2,
                dataSize: 10,
              },
            },
          ],
        },
        type: "message",
        offset: 0,
        tagSize: 2,
        dataSize: 12,
      },
    },
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 16,
          dataSize: 10,
          fields: [
            {
              fieldNumber: 2,
              field: {
                data: {
                  offset: 18,
                  dataSize: 8,
                  fields: [
                    {
                      fieldNumber: 1,
                      field: {
                        data: {
                          int: "1",
                          uint: "1",
                          sint: "-1",
                        },
                        type: "varint",
                        offset: 18,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                    {
                      fieldNumber: 2,
                      field: {
                        data: {
                          int: "15",
                          uint: "15",
                          sint: "-8",
                        },
                        type: "varint",
                        offset: 20,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                    {
                      fieldNumber: 3,
                      field: {
                        data: {
                          int: "30",
                          uint: "30",
                          sint: "15",
                        },
                        type: "varint",
                        offset: 22,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                    {
                      fieldNumber: 4,
                      field: {
                        data: {
                          int: "0",
                          uint: "0",
                          sint: "0",
                        },
                        type: "varint",
                        offset: 24,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 16,
                tagSize: 2,
                dataSize: 8,
              },
            },
          ],
        },
        type: "message",
        offset: 14,
        tagSize: 2,
        dataSize: 10,
      },
    },
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 28,
          dataSize: 4,
          fields: [
            {
              fieldNumber: 10,
              field: {
                data: {
                  offset: 30,
                  dataSize: 2,
                  fields: [
                    {
                      fieldNumber: 1,
                      field: {
                        data: {
                          int: "0",
                          uint: "0",
                          sint: "0",
                        },
                        type: "varint",
                        offset: 30,
                        tagSize: 1,
                        dataSize: 1,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 28,
                tagSize: 2,
                dataSize: 2,
              },
            },
          ],
        },
        type: "message",
        offset: 26,
        tagSize: 2,
        dataSize: 4,
      },
    },
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 34,
          dataSize: 5,
          fields: [
            {
              fieldNumber: 11,
              field: {
                data: {
                  offset: 36,
                  dataSize: 3,
                  fields: [
                    {
                      fieldNumber: 1,
                      field: {
                        data: {
                          int: "140",
                          uint: "140",
                          sint: "70",
                        },
                        type: "varint",
                        offset: 36,
                        tagSize: 1,
                        dataSize: 2,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 34,
                tagSize: 2,
                dataSize: 3,
              },
            },
          ],
        },
        type: "message",
        offset: 32,
        tagSize: 2,
        dataSize: 5,
      },
    },
  ],
};

const ex2: SizedRawMessage = {
  offset: 0,
  dataSize: 68,
  fields: [
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 2,
          dataSize: 18,
          fields: [
            {
              fieldNumber: 1,
              field: {
                data: {
                  int: "86",
                  uint: "86",
                  sint: "43",
                },
                type: "varint",
                offset: 2,
                tagSize: 1,
                dataSize: 1,
              },
            },
            {
              fieldNumber: 2,
              field: {
                data: {
                  int: "65535",
                  uint: "65535",
                  sint: "-32768",
                },
                type: "varint",
                offset: 4,
                tagSize: 1,
                dataSize: 3,
              },
            },
            {
              fieldNumber: 3,
              field: {
                data: {
                  int: "65535",
                  uint: "65535",
                  sint: "-32768",
                },
                type: "varint",
                offset: 8,
                tagSize: 1,
                dataSize: 3,
              },
            },
            {
              fieldNumber: 4,
              field: {
                data: {
                  int: "65535",
                  uint: "65535",
                  sint: "-32768",
                },
                type: "varint",
                offset: 12,
                tagSize: 1,
                dataSize: 3,
              },
            },
            {
              fieldNumber: 5,
              field: {
                data: {
                  int: "65535",
                  uint: "65535",
                  sint: "-32768",
                },
                type: "varint",
                offset: 16,
                tagSize: 1,
                dataSize: 3,
              },
            },
          ],
        },
        type: "message",
        offset: 0,
        tagSize: 2,
        dataSize: 18,
      },
    },
    {
      fieldNumber: 4,
      field: {
        data: {
          offset: 22,
          dataSize: 46,
          fields: [
            {
              fieldNumber: 1,
              field: {
                data: {
                  offset: 24,
                  dataSize: 14,
                  fields: [
                    {
                      fieldNumber: 15,
                      field: {
                        data: {
                          offset: 26,
                          dataSize: 12,
                          fields: [
                            {
                              fieldNumber: 1,
                              field: {
                                data: {
                                  int: "63519",
                                  uint: "63519",
                                  sint: "-31760",
                                },
                                type: "varint",
                                offset: 26,
                                tagSize: 1,
                                dataSize: 3,
                              },
                            },
                            {
                              fieldNumber: 2,
                              field: {
                                data: {
                                  int: "2047",
                                  uint: "2047",
                                  sint: "-1024",
                                },
                                type: "varint",
                                offset: 30,
                                tagSize: 1,
                                dataSize: 2,
                              },
                            },
                            {
                              fieldNumber: 3,
                              field: {
                                data: {
                                  int: "100",
                                  uint: "100",
                                  sint: "50",
                                },
                                type: "varint",
                                offset: 33,
                                tagSize: 1,
                                dataSize: 1,
                              },
                            },
                            {
                              fieldNumber: 4,
                              field: {
                                data: {
                                  int: "139",
                                  uint: "139",
                                  sint: "-70",
                                },
                                type: "varint",
                                offset: 35,
                                tagSize: 1,
                                dataSize: 2,
                              },
                            },
                          ],
                        },
                        type: "message",
                        offset: 24,
                        tagSize: 2,
                        dataSize: 12,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 22,
                tagSize: 2,
                dataSize: 14,
              },
            },
            {
              fieldNumber: 1,
              field: {
                data: {
                  offset: 40,
                  dataSize: 13,
                  fields: [
                    {
                      fieldNumber: 6,
                      field: {
                        data: {
                          offset: 42,
                          dataSize: 11,
                          fields: [
                            {
                              fieldNumber: 1,
                              field: {
                                data: {
                                  int: "255",
                                  uint: "255",
                                  sint: "-128",
                                },
                                type: "varint",
                                offset: 42,
                                tagSize: 1,
                                dataSize: 2,
                              },
                            },
                            {
                              fieldNumber: 2,
                              field: {
                                data: {
                                  int: "8",
                                  uint: "8",
                                  sint: "4",
                                },
                                type: "varint",
                                offset: 45,
                                tagSize: 1,
                                dataSize: 1,
                              },
                            },
                            {
                              fieldNumber: 3,
                              field: {
                                data: {
                                  int: "2",
                                  uint: "2",
                                  sint: "1",
                                },
                                type: "varint",
                                offset: 47,
                                tagSize: 1,
                                dataSize: 1,
                              },
                            },
                            {
                              fieldNumber: 4,
                              field: {
                                data: {
                                  int: "65535",
                                  uint: "65535",
                                  sint: "-32768",
                                },
                                type: "varint",
                                offset: 49,
                                tagSize: 1,
                                dataSize: 3,
                              },
                            },
                          ],
                        },
                        type: "message",
                        offset: 40,
                        tagSize: 2,
                        dataSize: 11,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 38,
                tagSize: 2,
                dataSize: 13,
              },
            },
            {
              fieldNumber: 1,
              field: {
                data: {
                  offset: 55,
                  dataSize: 13,
                  fields: [
                    {
                      fieldNumber: 6,
                      field: {
                        data: {
                          offset: 57,
                          dataSize: 11,
                          fields: [
                            {
                              fieldNumber: 1,
                              field: {
                                data: {
                                  int: "255",
                                  uint: "255",
                                  sint: "-128",
                                },
                                type: "varint",
                                offset: 57,
                                tagSize: 1,
                                dataSize: 2,
                              },
                            },
                            {
                              fieldNumber: 2,
                              field: {
                                data: {
                                  int: "4",
                                  uint: "4",
                                  sint: "2",
                                },
                                type: "varint",
                                offset: 60,
                                tagSize: 1,
                                dataSize: 1,
                              },
                            },
                            {
                              fieldNumber: 3,
                              field: {
                                data: {
                                  int: "2",
                                  uint: "2",
                                  sint: "1",
                                },
                                type: "varint",
                                offset: 62,
                                tagSize: 1,
                                dataSize: 1,
                              },
                            },
                            {
                              fieldNumber: 4,
                              field: {
                                data: {
                                  int: "65504",
                                  uint: "65504",
                                  sint: "32752",
                                },
                                type: "varint",
                                offset: 64,
                                tagSize: 1,
                                dataSize: 3,
                              },
                            },
                          ],
                        },
                        type: "message",
                        offset: 55,
                        tagSize: 2,
                        dataSize: 11,
                      },
                    },
                  ],
                },
                type: "message",
                offset: 53,
                tagSize: 2,
                dataSize: 13,
              },
            },
          ],
        },
        type: "message",
        offset: 20,
        tagSize: 2,
        dataSize: 46,
      },
    },
  ],
};

const ex3: SizedRawMessage = {
  offset: 0,
  dataSize: 71,
  fields: [
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 2,
          dataSize: 19,
          fields: [
            {
              fieldNumber: 1,
              field: {
                data: "Profile Indicator",
                type: "string",
                offset: 2,
                tagSize: 2,
                dataSize: 17,
              },
            },
          ],
        },
        type: "message",
        offset: 0,
        tagSize: 2,
        dataSize: 19,
      },
    },
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 23,
          dataSize: 7,
          fields: [
            {
              fieldNumber: 1,
              field: {
                data: "Solid",
                type: "string",
                offset: 23,
                tagSize: 2,
                dataSize: 5,
              },
            },
          ],
        },
        type: "message",
        offset: 21,
        tagSize: 2,
        dataSize: 7,
      },
    },
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 32,
          dataSize: 26,
          fields: [
            {
              fieldNumber: 1,
              field: {
                data: "Typing Speed Meter (KPS)",
                type: "string",
                offset: 32,
                tagSize: 2,
                dataSize: 24,
              },
            },
          ],
        },
        type: "message",
        offset: 30,
        tagSize: 2,
        dataSize: 26,
      },
    },
    {
      fieldNumber: 1,
      field: {
        data: {
          offset: 60,
          dataSize: 11,
          fields: [
            {
              fieldNumber: 1,
              field: {
                data: "Key Depth",
                type: "string",
                offset: 60,
                tagSize: 2,
                dataSize: 9,
              },
            },
          ],
        },
        type: "message",
        offset: 58,
        tagSize: 2,
        dataSize: 11,
      },
    },
  ],
};

export const expected = [ex1, ex2, ex3];

test("protobuf", (t) => {
  examples.forEach((example, i) => {
    const decoded = decodeBytes(example);
    expect(decoded).toEqual(expected[i]);
  });
});
