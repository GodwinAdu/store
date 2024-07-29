export const generateUniqueBarcode = () => {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // Random 8-character alphanumeric string
    
    return `${timestamp}-${randomPart}`;
  };

  