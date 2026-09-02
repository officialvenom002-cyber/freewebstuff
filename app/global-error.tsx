"use client";

/**
 * Root-level error boundary — catches crashes inside layout.tsx itself.
 * Must include <html> and <body> since the normal layout is unavailable.
 * This is the absolute last line of defence before a blank white screen.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Critical Error | FreeWebStuff</title>
        <meta name="robots" content="noindex" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            min-height: 100vh;
            background: #0f0d0b;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .container { text-align: center; max-width: 480px; }
          .icon { font-size: 3rem; margin-bottom: 1.5rem; }
          h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; }
          p { color: #94a3b8; font-size: 0.875rem; line-height: 1.6; margin-bottom: 2rem; }
          button {
            padding: 0.625rem 1.75rem;
            border-radius: 0.75rem;
            background: #0ea5e9;
            color: #0f172a;
            font-weight: 700;
            font-size: 0.875rem;
            border: none;
            cursor: pointer;
            transition: background 0.15s;
          }
          button:hover { background: #38bdf8; }
          .digest { font-size: 0.7rem; color: #475569; font-family: monospace; margin-top: 1rem; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon">🚨</div>
          <h1>Critical Error</h1>
          <p>
            A critical error occurred in the application shell. Please try again —
            if this keeps happening, the issue will be resolved shortly.
          </p>
          <button onClick={reset}>Try Again</button>
          {error?.digest && (
            <p className="digest">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
