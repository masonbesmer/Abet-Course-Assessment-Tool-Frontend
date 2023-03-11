

const crypto = require('crypto'); // needed for the AES encryption/decryption


// get the AES configuration from the .env file(s)
export async function getServerSideProps() {
    return {
        salt: process.env.AES_SALT,
        iterations: process.env.AES_ITERATIONS,
        keyLength: process.env.AES_LEN_KEY,
        initializationVectorLength: process.env.AES_LEN_INIT_VEC,
    };
}


// generate key and initialization vector for the AES encryption
const generateKeyAndIV = (plaintext, salt, iterations, keyLength, initializationVectorLength) => {
    const BYTE_SIZE = 8;
    const key = crypto.pbkdf2Sync(plaintext, salt, iterations, keyLength / BYTE_SIZE, String("sha"+keyLength));
    const iv = crypto.randomBytes(initializationVectorLength / BYTE_SIZE);
    return { key, iv };
};


// encrypt the plaintext string using AES
export async function encrypt (plaintext) {
    console.time('encrypt');
    let plainbytes = new TextEncoder().encode(plaintext); // encode the plaintext string as bytes
    const aesConfig = await getServerSideProps();
    let { key, iv } = generateKeyAndIV(plainbytes, aesConfig.salt, aesConfig.iterations, aesConfig.keyLength, aesConfig.initializationVectorLength); // generate key and initialization vector // the constants are defined in the .env file(s)
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // create a cipher object
    let cipherbytes = cipher.update(plainbytes); // encrypt the plaintext bytes
    cipherbytes = Buffer.concat([cipherbytes, cipher.final()]); // apply the encryption and destroy the cipher object
    let ciphertext = new TextDecoder().decode(cipherbytes); // decode the encrypted bytes as a string
    console.timeEnd('encrypt');
    return String(ciphertext); // return the encrypted bytes and invalidates the cipher object
};


// decrypt the ciphertext string using AES
export async function decrypt (ciphertext) {
    console.time('decrypt');
    let cipherbytes = Buffer.from(ciphertext); // convert the ciphertext string to bytes
    const aesConfig = await getServerSideProps();
    let { key, iv } = generateKeyAndIV(cipherbytes, aesConfig.salt, aesConfig.iterations, aesConfig.keyLength, aesConfig.initializationVectorLength); // generate key and initialization vector // the constants are defined in the .env file(s)
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv); // create a decipher object
    let plainbytes = decipher.update(cipherbytes); // decrypt the ciphertext bytes
    plainbytes = Buffer.concat([plainbytes, decipher.final()]); // apply the encryption and destroy the cipher object
    let plaintext = new TextDecoder().decode(plainbytes); // decode the decrypted bytes as a string
    console.timeEnd('decrypt');
    return String(plaintext); // return the decrypted bytes and invalidates the decipher object
};