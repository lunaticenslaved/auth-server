import { Session } from '#/models';

export type SaveSessionResponse = Session;
export interface SaveSessionRequest {
  userId: string;
  userAgent: string;
  fingerprint: string;
  ip: string;
  expiresAt: Date;
  refreshToken: string;
  sessionId?: string;
}

export type DeleteSessionResponse = void;
export interface DeleteSessionRequest {
  sessionId: string;
}

export type GetSessionResponse = Session;
export type GetSessionRequest =
  | {
      sessionId: string;
    }
  | {
      refreshToken: string;
    }
  | {
      userId: string;
      fingerprint: string;
    };

export type CheckSessionResponse = 'not-exists' | 'expired' | 'valid' | 'unknown-fingerprint';
export interface CheckSessionRequest {
  refreshToken: string;
  fingerprint: string;
}
