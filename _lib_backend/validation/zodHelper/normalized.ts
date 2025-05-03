export function normalizeFormFields(fields) {
    const normalized = {};
  
    for (const key in fields) {
      const value = fields[key];
      // If it's an array with one item, unwrap it
      if (Array.isArray(value) && value.length === 1) {
        normalized[key] = value[0];
      } else {
        normalized[key] = value;
      }
    }
  
    return normalized;
}


export function normalizeToArray(data) {
  const normalized = {};
  
  for (const key in data) {
    const value = data[key];
    normalized[key] = JSON.parse(value);
  }
  
    return normalized;
}

  