interface ICryptoUtils {
    generateKeypairs(): Promise<{privateKey: string, publicKey: string}>,
    generateSigningKeypairs(): Promise<{privateKey: string, publicKey: string}>,
    encryptMessage(plaintext: string, publicKey: string): Promise<string>,
    decryptMessage(ciphertext: string, privateKey: string): Promise<string>,
    signMessage(plaintext: string, privateKey: string): Promise<string>,
    verifySignature(plaintext: string, signature: string, publicKey: string): Promise<boolean>,
}

type KeyUsageType = 'encrypt' | 'decrypt' | 'sign' | 'verify';
type AlgorithmName = 'RSA-OAEP' | 'RSA-PSS';

// Generate an RSA key pair
async function generateRSAKeyPair(algorithmName: AlgorithmName = 'RSA-OAEP'): Promise<CryptoKeyPair> {
    const modulusLength = 2048;
    const publicExponent = new Uint8Array([0x01, 0x00, 0x01]); // 65537

    const algorithm: RsaHashedKeyGenParams = {
        name: algorithmName,
        modulusLength,
        publicExponent,
        hash: 'SHA-256',
    };

    const usages: KeyUsage[] = algorithmName === 'RSA-PSS' ? ['sign', 'verify'] : ['encrypt', 'decrypt'];

    return window.crypto.subtle.generateKey(algorithm, true, usages);
}

// Encrypt a plaintext message using the public key from an RSA key pair
async function encryptMessage(plaintext: string, publicKey: CryptoKey): Promise<ArrayBuffer> {
    const encoded = new TextEncoder().encode(plaintext);

    const algorithm: RsaOaepParams = {
        name: "RSA-OAEP",
    };

    const encrypted = await window.crypto.subtle.encrypt(algorithm, publicKey, encoded);

    return encrypted;
}

// Decrypt a ciphertext message using the private key from an RSA key pair
async function decryptMessage(ciphertext: ArrayBuffer, privateKey: CryptoKey): Promise<string> {
    const algorithm: RsaOaepParams = {
        name: "RSA-OAEP",
    };

    const decrypted = await window.crypto.subtle.decrypt(algorithm, privateKey, ciphertext);

    const plaintext = new TextDecoder().decode(decrypted);

    return plaintext;
}

export const cryptoUtils: ICryptoUtils = {
    generateKeypairs: async (): Promise<{privateKey: string, publicKey: string}> => {
        const { privateKey, publicKey } = await generateRSAKeyPair();
        return {
            privateKey: await exportKey(privateKey),
            publicKey: await exportKey(publicKey)
        }
    },
    generateSigningKeypairs: async (): Promise<{privateKey: string, publicKey: string}> => {
        const { privateKey, publicKey } = await generateRSAKeyPair('RSA-PSS');
        return {
            privateKey: await exportKey(privateKey),
            publicKey: await exportKey(publicKey)
        }
    },
    encryptMessage: async (plaintext: string, publicKey: string): Promise<string> => {
        const publicCryptoKey = await importKey(publicKey, 'encrypt', 'RSA-OAEP');
        return typedArrayToStr(await encryptMessage(plaintext, publicCryptoKey));
    },
    decryptMessage: async (ciphertext: string, privateKey: string): Promise<string> => {
        const privateCryptoKey = await importKey(privateKey, 'decrypt', 'RSA-OAEP');
        return decryptMessage(strToTypedArr(ciphertext), privateCryptoKey)
    },
    signMessage: async (plaintext: string, privateKey: string): Promise<string> => {
        const privateCryptoKey = await importKey(privateKey, 'sign', 'RSA-PSS');
        const encoded = new TextEncoder().encode(plaintext);
        const signature = await window.crypto.subtle.sign(
            { name: 'RSA-PSS', saltLength: 32 },
            privateCryptoKey,
            encoded
        );
        return typedArrayToStr(new Uint8Array(signature));
    },
    verifySignature: async (plaintext: string, signature: string, publicKey: string): Promise<boolean> => {
        const publicCryptoKey = await importKey(publicKey, 'verify', 'RSA-PSS');
        const encoded = new TextEncoder().encode(plaintext);
        const sigArr = strToTypedArr(signature);
        return window.crypto.subtle.verify(
            { name: 'RSA-PSS', saltLength: 32 },
            publicCryptoKey,
            sigArr,
            encoded
        );
    },
}

const exportKey = async (key: CryptoKey): Promise<string> => {
    return JSON.stringify(await window.crypto.subtle.exportKey('jwk', key));
}

const importKey = async (key: string, usage: KeyUsageType, algorithm: AlgorithmName = 'RSA-OAEP'): Promise<CryptoKey> => {
    return window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(key),
        {
            name: algorithm,
            hash: 'SHA-256',
        },
        true,
        [usage]
    );
}

const typedArrayToStr = (arrayBuffer: ArrayBuffer): string => {
    // Convert the ArrayBuffer to a Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);

    // Populate the Uint8Array with some data (for example, all zeros)
    // uint8Array.fill(0);

    // Convert the Uint8Array to a base64-encoded string
    return window.btoa(String.fromCharCode.apply(null, uint8Array as unknown as number[]));
}

const strToTypedArr = (base64String: string): ArrayBuffer => {
    // Decode the base64 string to a Uint8Array
    const uint8Array = new Uint8Array(window.atob(base64String).split('').map(char => char.charCodeAt(0)));

    // Create a new ArrayBuffer from the Uint8Array
    return uint8Array.buffer;
}
