import { Response } from 'express';

import { DOMAIN } from '#/utils/constants';

import * as access from './access';
import * as refresh from './refresh';
import { CreateRefreshTokenResponse } from './types';

export type { CreateAccessTokenResponse, CreateRefreshTokenResponse } from './types';

export const tokens = {
  access,
  refresh,

  removeTokensFormResponse(res: Response) {
    res.clearCookie('refreshToken');
  },
  setTokensToResponse(refreshToken: CreateRefreshTokenResponse, res: Response) {
    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: true,
      domain: DOMAIN,
      expires: refreshToken.expiresAt,
    });
  },
};
