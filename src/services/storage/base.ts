import { UploadedFile } from 'express-fileupload';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

import { Constants } from '#/utils';

export interface IObjectStorage {
  uploadFile(file: UploadedFile): Promise<{ link: string }>;
}

type ObjectStorageProps = {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
};

export class ObjectStorage implements IObjectStorage {
  private client: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor({ bucketName, endpoint, ...props }: ObjectStorageProps) {
    this.bucketName = bucketName;
    this.endpoint = endpoint;

    this.client = new S3Client({
      endpoint,
      credentials: props,
      region: Constants.OBJECT_STORAGE_REGION,
    });
  }

  async uploadFile(file: UploadedFile) {
    const fileName = `${randomUUID()}_${file.name}`;
    const params = {
      Bucket: this.bucketName,
      Body: file.data,
      Key: fileName,
    };

    const link = `${this.endpoint}/${Constants.OBJECT_STORAGE_AVATARS_NAME}/${fileName}`;

    await this.client.send(new PutObjectCommand(params));

    console.log(
      'Successfully created ' +
        params.Key +
        ' and uploaded it to ' +
        params.Bucket +
        '/' +
        params.Key,
    );

    await this.client.config;

    return { link };
  }
}
