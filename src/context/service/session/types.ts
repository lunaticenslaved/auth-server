import { Session } from '#/models';

export type SaveSessionResponse = Session;
export interface SaveSessionRequest {
  userId: string;
  userAgent: string;
  fingerprint: string;
  ip: string;
  expiresAt: Date;
  refreshToken: string;
  accessToken: string;
  sessionId?: string;
}

export type DeleteSessionResponse = void;
export type DeleteSessionRequest =
  | {
      sessionId: string;
    }
  | {
      refreshToken: string;
    };

export type GetSessionResponse = Session;
export type GetSessionRequest =
  | {
      sessionId: string;
    }
  | {
      refreshToken: string;
    }
  | {
      accessToken: string;
    }
  | {
      userId: string;
      fingerprint: string;
    };
