export interface UrlValidationResult {
  isValid: boolean;
  domain: string;
  normalizedUrl: string;
  isHttps: boolean;
  faviconUrl: string;
  error?: string;
}

export function validateAndParseUrl(inputUrl: string): UrlValidationResult {
  try {
    let urlStr = inputUrl.trim();
    if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
      urlStr = "https://" + urlStr;
    }

    const parsed = new URL(urlStr);
    const domain = parsed.hostname.replace(/^www\./, "");

    // Google Favicon service reliable fallback
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    return {
      isValid: true,
      domain,
      normalizedUrl: parsed.toString(),
      isHttps: parsed.protocol === "https:",
      faviconUrl,
    };
  } catch {
    return {
      isValid: false,
      domain: "",
      normalizedUrl: inputUrl,
      isHttps: false,
      faviconUrl: "",
      error: "Please enter a valid website URL (e.g. https://example.com)",
    };
  }
}
