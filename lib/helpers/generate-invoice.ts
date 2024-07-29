

export const generateUniqueInvoiceValue = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    // const milliseconds = String(now.getMilliseconds()).padStart(3, '0');÷
    const randomPart = Math.floor(Math.random() * 10000); // Random 4-digit number

    return `INV-${year}${month}${day}-${hours}${minutes}${seconds}-${randomPart}`;
};