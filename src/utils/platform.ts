import { VERSION } from '../version';

const BASE_USER_AGENT = `vue-facial-liveness/${VERSION}`;

export const getLivenessUserAgent = (): string => {
  return BASE_USER_AGENT;
};
