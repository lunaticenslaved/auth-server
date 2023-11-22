import { IObjectStorage, ObjectStorage } from '#/services/storage/base';
import { Constants } from '#/utils';

const endpoint = 'https://storage.yandexcloud.net';

export type IStorage = {
  avatar: IObjectStorage;
};

export function createStorage(): IStorage {
  return {
    avatar: new ObjectStorage({
      endpoint,
      bucketName: Constants.OBJECT_STORAGE_AVATARS_NAME,
      accessKeyId: Constants.OBJECT_STORAGE_AVATARS_KEY_ID,
      secretAccessKey: Constants.OBJECT_STORAGE_AVATARS_SECRET,
    }),
  };
}
