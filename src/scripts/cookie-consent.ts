export {};

const MEASUREMENT_ID = 'G-TZSSJDCPGS';
const STORAGE_KEY = 'sfce:cookie-consent';
// Bump the version when the purposes, provider or consent wording materially change.
const CONSENT_VERSION = 1;
const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;

type Consent = {
  version: number;
  analytics: boolean;
  updatedAt: number;
  expiresAt: number;
};

declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: unknown[]) => void;
    'ga-disable-G-TZSSJDCPGS': boolean;
  }
}

const panel = document.getElementById('cookie-consent')!;
const currentLabel = document.getElementById('cookie-consent-current')!;
const status = document.getElementById('cookie-consent-status')!;
const settingsButtons = document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]');
let consent: Consent | null = null;
let tagStarted = false;
let expiryTimer: ReturnType<typeof setTimeout>;
let returnFocus: HTMLElement | null = null;

function readConsent(): Consent | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable. An explicit choice still works for this page only.
    return consent;
  }
  try {
    const stored = JSON.parse(raw || 'null');
    if (stored?.version === CONSENT_VERSION && typeof stored.analytics === 'boolean'
      && Number.isFinite(stored.updatedAt) && stored.updatedAt <= Date.now()
      && Number.isFinite(stored.expiresAt) && stored.expiresAt > Date.now()
      && stored.expiresAt > stored.updatedAt
      && stored.expiresAt - stored.updatedAt <= CONSENT_LIFETIME) {
      return stored;
    }
  } catch {
    // Malformed records never authorize analytics.
  }
  return null;
}

function removeAnalyticsCookies() {
  const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0])
    .filter(name => name === '_ga' || name.startsWith('_ga_'));
  const hostname = window.location.hostname;
  const domains = ['', ...hostname.split('.').map((_, index, parts) => parts.slice(index).join('.'))];
  // Include parent-domain and legacy path cookies, without touching study preferences.
  const paths = ['/', ...window.location.pathname.split('/').map((_, index, parts) => parts.slice(0, index + 1).join('/')).filter(Boolean)];
  for (const name of names) {
    for (const domain of domains) {
      for (const path of paths) {
        document.cookie = `${name}=; Max-Age=0; Path=${path}${domain ? `; Domain=${domain}` : ''}; SameSite=Lax`;
      }
    }
  }
}

function startAnalytics() {
  if (tagStarted) {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }
  tagStarted = true;
  window['ga-disable-G-TZSSJDCPGS'] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 180 * 24 * 60 * 60,
    cookie_update: false,
    cookie_path: '/',
    // Keep query strings and fragments out of the initial page view.
    page_location: window.location.origin + window.location.pathname,
    page_referrer: document.referrer ? document.referrer.split(/[?#]/)[0] : '',
  });
  // Basic consent mode: no Google script or cookieless pings before opt-in.
  const script = document.createElement('script');
  script.id = 'sfce-google-tag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function applyConsent() {
  clearTimeout(expiryTimer);
  const accepted = consent?.analytics === true;
  window['ga-disable-G-TZSSJDCPGS'] = !accepted;
  currentLabel.textContent = `Analytics is currently ${accepted ? 'on' : 'off'}. Your choice is remembered for 180 days.`;
  if (accepted) {
    startAnalytics();
  } else {
    removeAnalyticsCookies();
    if (tagStarted) {
      // Disable collection before updating consent; reload to unload Google's listeners too.
      window.gtag('consent', 'update', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied',
      });
      // A failed storage write must not restore an old opt-in on reload.
      if (readConsent()?.analytics !== true) window.location.reload();
      return;
    }
  }
  if (consent) {
    // Short intervals avoid the browser's ~24.8-day setTimeout limit.
    expiryTimer = setTimeout(checkExpiry, Math.min(consent.expiresAt - Date.now(), 60_000));
  }
}

function setPanelVisible(visible: boolean, focus = false) {
  panel.hidden = !visible;
  settingsButtons.forEach(button => button.setAttribute('aria-expanded', String(visible)));
  if (visible && focus) {
    returnFocus = document.activeElement as HTMLElement;
    panel.querySelector<HTMLButtonElement>('[data-consent-reject]')?.focus();
  } else if (!visible && panel.contains(document.activeElement)) {
    (returnFocus || settingsButtons[0])?.focus({ preventScroll: true });
  }
}

function saveChoice(analytics: boolean) {
  const now = Date.now();
  consent = { version: CONSENT_VERSION, analytics, updatedAt: now, expiresAt: now + CONSENT_LIFETIME };
  let saved = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    saved = false;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Keep the in-memory choice. */ }
  }
  setPanelVisible(false);
  status.textContent = `Analytics ${analytics ? 'accepted' : 'rejected'}.${saved ? '' : ' Your browser could not save this choice; it applies to this page only.'}`;
  applyConsent();
}

function checkExpiry() {
  if (consent && consent.expiresAt <= Date.now()) {
    consent = null;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Fail closed. */ }
    applyConsent();
    setPanelVisible(true);
  } else if (consent) {
    clearTimeout(expiryTimer);
    expiryTimer = setTimeout(checkExpiry, Math.min(consent.expiresAt - Date.now(), 60_000));
  }
}

settingsButtons.forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => setPanelVisible(true, true));
});
panel.querySelector('[data-consent-accept]')?.addEventListener('click', () => saveChoice(true));
panel.querySelector('[data-consent-reject]')?.addEventListener('click', () => saveChoice(false));
panel.querySelector('[data-consent-close]')?.addEventListener('click', () => setPanelVisible(false));
panel.addEventListener('keydown', event => {
  if (event.key === 'Escape') setPanelVisible(false);
});
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY || event.key === null) {
    consent = readConsent();
    applyConsent();
    setPanelVisible(!consent);
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkExpiry();
});
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    // A page restored from the back/forward cache may have missed a withdrawal.
    consent = readConsent();
    applyConsent();
    setPanelVisible(!consent);
  }
});

consent = readConsent();
applyConsent();
setPanelVisible(!consent);
