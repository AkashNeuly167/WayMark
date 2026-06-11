const validateRequiredFields = (body, fields) => {
  const missingFields = [];

  fields.forEach((field) => {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field].toString().trim() === ""
    ) {
      missingFields.push(field);
    }
  });

  return missingFields;
};

export default validateRequiredFields; 