export const COOKIE_CONSENT_COOKIE_NAME = "paradedb_cookie_consent";

export const COOKIE_CONSENT_EVENT = "paradedb-consent-changed";

export interface CookieConsentEventDetail {
  analyticsGranted: boolean;
}
