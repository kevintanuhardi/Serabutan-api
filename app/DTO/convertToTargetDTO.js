const convertToTargetDTO = (loanData) => loanData.map((loanDatum) => {
  const {
    installmentAmount,
    remainingBalance,
    TagCustomerResorts,
  } = loanDatum;

  const {
    manualCustomerId,
    Customer,
  } = TagCustomerResorts;

  const {
    name,
    streetName: address,
  } = Customer;

  return {
    noNasabah: manualCustomerId,
    name,
    address,
    installment: installmentAmount,
    unpaidSum: remainingBalance,
  };
});

module.exports = convertToTargetDTO;
