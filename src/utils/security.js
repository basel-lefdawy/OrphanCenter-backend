const maskIBAN = (iban) =>
  iban ? iban.slice(0, 4) + "****" + iban.slice(-4) : null;

const maskAccount = (acc) =>
  acc ? acc.slice(0, 2) + "******" + acc.slice(-2) : null;

module.exports = {
  maskIBAN,
  maskAccount,
};