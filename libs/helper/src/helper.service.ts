import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { createCipheriv, createDecipheriv } from 'crypto';

const algorithm: string = 'aes-256-cbc';
const key: string = 'MySecretEncryptionKey123!'; // Replace with your own encryption key
const encryptionKey = generateEncryptionKey(key);
// pagination.interface.ts
export interface Pagination<T> {
    data: T[];
    total: number;
    currentPage: number;
    perPage: number;
}


export function encryptData(data: string): string {

    const iv = crypto.randomBytes(16);

    const cipher = createCipheriv(algorithm, encryptionKey, iv);

    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    return `${iv.toString('hex')}:${encryptedData}`;
}

export function decryptData(encryptedData: string): string {
    const [ivHex, encryptedDataHex] = encryptedData.split(':');
    const decipher = createDecipheriv(algorithm, encryptionKey, Buffer.from(ivHex, 'hex'));

    let decryptedData = decipher.update(encryptedDataHex, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    console.log(decryptedData);
    return JSON.parse(decryptedData);
}

function generateEncryptionKey(key: string): Buffer {
    const salt = crypto.randomBytes(16);
    const keyLength = 32;

    return crypto.pbkdf2Sync(key, salt, 100000, keyLength, 'sha256');
}


@Injectable()
export class HelperService { }