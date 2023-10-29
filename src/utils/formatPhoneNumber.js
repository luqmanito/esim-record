export default function formatPhoneNumber(value) {
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    const codePhoneArea = value.slice(0, 2);

    const restOfPhone = value.slice(2, value.length);

    return `+(${codePhoneArea})-${restOfPhone}`;
  }
}
