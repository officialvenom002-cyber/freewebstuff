export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views (useful for client-side transitions and pushState)
export const pageview = (url: string, title?: string) => {
  if (typeof window !== "undefined" && (window as any).gtag && GA_TRACKING_ID) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Track specific events (e.g. category switch, search, website click)
export const event = (
  action: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  if (typeof window !== "undefined" && (window as any).gtag && GA_TRACKING_ID) {
    (window as any).gtag("event", action, params);
  }
};
