import { expect, test } from '@playwright/test'

import { isCloudflareWebAnalyticsRumFailure } from './fixtures/health'

const cloudflareConsoleErrors = [
  "Access to XMLHttpRequest at 'https://cloudflareinsights.com/cdn-cgi/rum' from origin 'https://91aaf9c7.el-danes.pages.dev' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
  '[JavaScript Error: "Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://cloudflareinsights.com/cdn-cgi/rum. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 404."]',
]

const cloudflarePageException =
  'XMLHttpRequest cannot load https://cloudflareinsights.com/cdn-cgi/rum due to access control checks.'

test('recognizes the observed Cloudflare RUM browser failures', () => {
  for (const message of [...cloudflareConsoleErrors, cloudflarePageException]) {
    expect(isCloudflareWebAnalyticsRumFailure(message)).toBe(true)
  }
})

test('does not recognize unrelated or lookalike browser failures', () => {
  const unrelatedFailures = [
    'Uncaught TypeError: first-party failure',
    'https://cloudflareinsights.com/cdn-cgi/other failed',
    'https://cloudflareinsights.com/cdn-cgi/rumor failed',
    'https://cloudflareinsights.com.evil.example/cdn-cgi/rum failed',
  ]

  for (const message of unrelatedFailures) {
    expect(isCloudflareWebAnalyticsRumFailure(message)).toBe(false)
  }
})
