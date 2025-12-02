/**
 * Symmetric key encryption used for encrypting Audio/Video data
 */
export class AesGcmEncryption {
    private aesKeyLocal?: CryptoKey;
    private aesKeyRemote?: CryptoKey;

    private static toBase64(data: Uint8Array): string {
        let binary = "";
        data.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        return window.btoa(binary);
    }

    private static fromBase64(data: string): Uint8Array {
        const binary = window.atob(data);
        const buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
            buffer[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    public async int(): Promise<CryptoKey> {
        if(this.aesKeyLocal) {
            return this.aesKeyLocal;
        }
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        this.aesKeyLocal = key;
        return this.aesKeyLocal;
    }

    public getRemoteAesKey(): CryptoKey {
        if(!this.aesKeyRemote) {
            throw new Error("AES key from remote not set.");
        }
        return this.aesKeyRemote;
    }

    public hasRemoteKey(): boolean {
        return !!this.aesKeyRemote;
    }

    public clearRemoteKey(): void {
        this.aesKeyRemote = undefined;
    }

    /**
     * To Do: 
     * this key is plain text, can be used to decrypt data.
     * Should not be transmitted over network.
     * Use cryptoUtils to encrypt the key and exchange.
     */
    public async getRawAesKeyToExport(): Promise<string> {
        if(!this.aesKeyLocal) {
            throw new Error('AES key not generated');
        }
        const jsonWebKey = await crypto.subtle.exportKey("jwk", this.aesKeyLocal);
        return JSON.stringify(jsonWebKey);
    }

    public async setRemoteAesKey(key: string): Promise<void> {
        const jsonWebKey = JSON.parse(key);
        this.aesKeyRemote = await crypto.subtle.importKey(
            "jwk",
            jsonWebKey,
            { name: "AES-GCM" },
            true, // Key is usable for decryption
            ["decrypt"] // Usage options for the key
        );

    }

    public async encryptText(plaintext: string): Promise<string> {
        await this.int();
        if(!this.aesKeyLocal) {
            throw new Error("AES key not generated");
        }
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(plaintext);
        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv
            },
            this.aesKeyLocal,
            encoded
        );
        const cipherText = AesGcmEncryption.toBase64(new Uint8Array(encrypted));
        const ivText = AesGcmEncryption.toBase64(iv);
        return `${ivText}:${cipherText}`;
    }

    public async decryptText(payload: string): Promise<string> {
        if(!this.aesKeyRemote) {
            throw new Error("Remote AES key not set.");
        }
        const [ivText, cipherText] = payload.split(":");
        if(!ivText || !cipherText) {
            throw new Error("Invalid encrypted payload");
        }
        const iv = AesGcmEncryption.fromBase64(ivText);
        const cipher = AesGcmEncryption.fromBase64(cipherText);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv
            },
            this.aesKeyRemote,
            cipher
        );
        return new TextDecoder().decode(decrypted);
    }

    public async encryptData(data: ArrayBuffer) {
            // Generate an Initialization Vector (IV) for AES-GCM (12 bytes)
            const iv = crypto.getRandomValues(new Uint8Array(12));
            // Encrypt the frame data using AES-GCM
            const encryptedData = await crypto.subtle.encrypt(
              {
                name: "AES-GCM",
                iv: iv
              },
              this.aesKeyLocal,      // Symmetric key for encryption
              data    // The frame data to be encrypted
            );
          
          
            return { encryptedData: new Uint8Array(encryptedData) , iv };
    }

    public async decryptData(data: Uint8Array, iv: Uint8Array): Promise<ArrayBuffer> {
        if(!this.aesKeyRemote) {
            throw new Error('Remote AES key not set.')
        }
        return crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          this.aesKeyRemote,  // Symmetric key for decryption
          data  // The encrypted  frame data
        );
      }

}
