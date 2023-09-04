import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as Sentry from '@sentry/node';
import { createCipheriv, createDecipheriv } from 'crypto';

const algorithm: string = process.env.ALGORITHM || 'aes-256-cbc';
const responseKey: string = process.env.RESPONSE_KEY || 'MySecretEncryptionKey123!'; // Replace with your own encryption key
const encryptionKey = generateEncryptionKey(responseKey);
const responseIv = crypto.randomBytes(16);


export interface Pagination<T> {
    data: T[];
    total: number;
    currentPage: number;
    perPage: number;
    prevPage: string;
    nextPage: string;
}

export function encryptData(data: string): string {
    const cipher = createCipheriv(algorithm, encryptionKey, responseIv);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

export function decryptData(encryptedData: string): string {
    const encryptedDataHex = encryptedData;
    const decipher = createDecipheriv(algorithm, encryptionKey, responseIv);
    let decryptedData = decipher.update(encryptedDataHex, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return JSON.parse(decryptedData);
}


function generateEncryptionKey(key: string): Buffer {
    const salt = crypto.randomBytes(16);
    const keyLength = 32;
    return crypto.pbkdf2Sync(key, salt, 100000, keyLength, 'sha256');
}
let currentUserValue: object;
export function setCurrentUser(current_user: object) {
    currentUserValue = current_user;
}

export function currentUser(): object {
    return currentUserValue;
}

export function captureSentryException(error: Error): void {
    Sentry.captureException(error);
}

export function logLever() {
    return process.env.NODE_ENV === 'production' ? 'warn' : 'log';
}


@Injectable()
export class HelperService { }
