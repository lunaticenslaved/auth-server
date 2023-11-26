import { Session } from '#/models';

export type SaveSessionResponse = Session;
export interface SaveSessionRequest {
  userId: string;
  userAgent: string;
  sessionId?: string;
}

export type DeleteSessionResponse = void;
export interface DeleteSessionRequest {
  sessionId: string;
}

export type GetSessionResponse = Session;
export interface GetSessionRequest {
  sessionId: string;
}
