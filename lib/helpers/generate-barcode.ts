export function generateRandomCodes(length: number, numberOfCodes: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codes = [];

  for (let i = 0; i < numberOfCodes; i++) {
    let code = '';
    for (let j = 0; j < length; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    codes.push(code);
  }

  return codes[0];
}


