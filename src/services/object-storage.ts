import { UploadedFile } from 'express-fileupload';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

import { Constants } from '#/utils';

export interface IObjectStorageService {
  uploadFile(file: UploadedFile): Promise<{ link: string }>;
}

const storageEndpoint = 'https://storage.yandexcloud.net';

type ObjectStorageServiceProps = {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
};

class ObjectStorageService implements IObjectStorageService {
  private client: S3Client;
  private bucketName: string;

  constructor({ bucketName, ...props }: ObjectStorageServiceProps) {
    this.bucketName = bucketName;
    this.client = new S3Client({
      credentials: props,
      region: Constants.OBJECT_STORAGE_REGION,
      endpoint: storageEndpoint,
    });
  }

  async uploadFile(file: UploadedFile) {
    const fileName = `${randomUUID()}_${file.name}`;
    const params = {
      Bucket: this.bucketName,
      Body: file.data,
      Key: fileName,
    };

    const link = `${storageEndpoint}/${Constants.OBJECT_STORAGE_AVATARS_NAME}/${fileName}`;

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

export type Storage = {
  avatar: IObjectStorageService;
};

export const storage: Storage = {
  avatar: new ObjectStorageService({
    bucketName: Constants.OBJECT_STORAGE_AVATARS_NAME,
    accessKeyId: Constants.OBJECT_STORAGE_AVATARS_KEY_ID,
    secretAccessKey: Constants.OBJECT_STORAGE_AVATARS_SECRET,
  }),
};
