import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { config } from 'dotenv';
import { decryptData, encryptData } from '@app/helper';

config();

let version: string = process.env.VERSION || 'v1'; // Set the version from .env file or default to 'v1'

export function setVersion(apiVersion: string) {
  version = apiVersion;
}

export function responseJson(data: any, statusCode: HttpStatus, response: Response) {
  if (data.status == false) {
    data.statusCode = HttpStatus.BAD_REQUEST;
    throw new BadRequestException(data, { cause: new Error() })
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

function checkVersion() {
  return version;
}
@Injectable()
export class ResponseService { }