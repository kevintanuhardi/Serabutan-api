exports.addCountryCodeToPhone = (
  countryCode,
  phoneNumber,
) => {
  // case start with 0.
  if (phoneNumber[0] === '0') {
    return `${countryCode}${phoneNumber.substring(1)}`;
  }

  // case have no + but start with country code.
  if (`+${phoneNumber.substring(0, 2)}` === countryCode) {
    return `+${phoneNumber}`;
  }

  const phoneWithCountryCode = phoneNumber.includes('+')
    ? phoneNumber
    : `+${phoneNumber}`;
  const codeFromPhone = phoneWithCountryCode.substring(0, 3);

  if (codeFromPhone !== '+62' && codeFromPhone !== '+84') {
    return null;
  }

  return phoneWithCountryCode;
};
