export const generateUniqueSKU = (productName:string) => {
    const now = new Date();
    
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const day = String(now.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // Random 4-character alphanumeric string
    
    const productPrefix = productName.substring(0, 3).toUpperCase(); // First three letters of product name
    
    return `${productPrefix}-${year}${month}${day}-${randomPart}`;
  };