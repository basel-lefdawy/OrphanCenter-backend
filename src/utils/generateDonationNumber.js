const generateDonationNumber = () => {
  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `DON-${Date.now()}-${random}`;
};

module.exports = generateDonationNumber;