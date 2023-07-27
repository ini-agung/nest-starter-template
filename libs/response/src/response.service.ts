import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { config } from 'dotenv';
import * as crypto from 'crypto';
config();

let version: string = process.env.VERSION || 'v1'; // Set the version from .env file or default to 'v1'
const algorithm: string = 'aes-256-cbc';
const key: string = 'MySecretEncryptionKey123!'; // Replace with your own encryption key
const encryptionKey = generateEncryptionKey(key);
export function setVersion(apiVersion: string) {
  version = apiVersion;
}

export function responseJson(data: any, statusCode: HttpStatus, response: Response) {
  if(data.status == false){
    data.statusCode = HttpStatus.BAD_REQUEST;
    throw new BadRequestException(data, {cause: new Error()})
  }
  if (version === 'v1') {
    response.status(statusCode).json(data);
  } else if (version === 'v2') {
    const encryptedData = encryptData(data);
    const decryptedData = decryptData(encryptedData);
    response.status(statusCode).json(encryptedData);
  } else {
    throw new HttpException('Invalid API version', HttpStatus.BAD_REQUEST);
  }
}

function checkVersion(){
  return version;
}

function encryptData(data: string): string {

  const iv = crypto.randomBytes(16);

  const cipher = createCipheriv(algorithm, encryptionKey, iv);

  let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  return `${iv.toString('hex')}:${encryptedData}`;
}

function decryptData(encryptedData: string): string {
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
export class ResponseService {}