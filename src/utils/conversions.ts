// Utility functions for Base64 conversion
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function hexToArrayBuffer(hex: string): Uint8Array {
  let hexArray = hex.split(" ");
  if (hexArray.length === 1) {
    //split by 2 characters
    hexArray = hex.match(/.{1,2}/g) || [];
  }

  const bytes = new Uint8Array(hexArray.length);
  for (let i = 0; i < hexArray.length; i++) {
    bytes[i] = parseInt(hexArray[i], 16);
  }
  return bytes;
}

export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return bytesToHexDisplay(bytes);
}

// Utility function to convert Uint8Array to hex for display purposes only
export function bytesToHexDisplay(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

export function decimalBytesToArrayBuffer(decimalBytes: string): Uint8Array {
  const decimalArray = decimalBytes.split(",").map((byte) => byte.trim());
  const bytes = new Uint8Array(decimalArray.length);
  for (let i = 0; i < decimalArray.length; i++) {
    bytes[i] = parseInt(decimalArray[i], 10);
  }
  return bytes;
}

export function arrayBufferToDecimalBytes(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).join(", ");
}
