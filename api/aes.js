import fs from 'fs';
import crypto from 'crypto';


// generate key and initialization vector
const generateKeyAndIV = (plaintext, salt, iterations, keyLength, initializationVectorLength) => {
    const byteSize = 8;
    const key = crypto.pbkdf2Sync(plaintext, salt, iterations, keyLength / byteSize, String("sha"+keyLength));
    const iv = crypto.randomBytes(initializationVectorLength / byteSize);
    return { key, iv };
};


export const encrypt = (plaintext) => {
    const aesConfig = JSON.parse(fs.readFileSync("../security/aesConfig.json", 'utf8')); // get configuration for the encryption algorithm
    let plainbytes = new TextEncoder().encode(plaintext); // encode the plaintext string as bytes
    let { key, iv } = generateKeyAndIV(plainbytes, aesConfig.salt, aesConfig.iterations, aesConfig.keyLength, aesConfig.initializationVectorLength); // generate key and initialization vector
    let cipher = crypto.createCipheriv("aes-256-cbc", key, iv); // create a cipher object
    let cipherbytes = cipher.update(plainbytes); // encrypt the plaintext bytes
    return Buffer.concat([cipherbytes, cipher.final()]); // return the encrypted bytes and invalidates the cipher object
};

