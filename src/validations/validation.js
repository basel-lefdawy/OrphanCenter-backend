function getMissingFields(body, requiredFields) {
  return requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });
}

function hasMissingFields(body, requiredFields) {
  return getMissingFields(body, requiredFields).length > 0;
}

module.exports = {
  getMissingFields,
  hasMissingFields,
};
