import CryptoJS from 'crypto-js';

const secretKey: string = 'jhqvdwfywegyf71381637123531thvqhjdqh6123';

// Encrypt function
export function encryptText(plainText: string): string {
  const encrypted = CryptoJS.AES.encrypt(plainText, secretKey).toString();
  return encrypted;
}

// Decrypt function
export function decryptText(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}
