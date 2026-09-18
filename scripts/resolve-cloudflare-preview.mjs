import { appendFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const API_ORIGIN = 'https://api.github.com'
const API_VERSION = '2022-11-28'
const CHECK_NAME = 'Cloudflare Pages'
const CLOUDFLARE_APP_OWNER = 'cloudflare'
const CLOUDFLARE_APP_SLUG = 'cloudflare-workers-and-pages'
const POLL_INTERVAL_MS = 15_000
const MAX_WAIT_MS = 15 * 60_000
const IMMUTABLE_PREVIEW_HOST = /^[0-9a-f]{8}\.el-danes\.pages\.dev$/
const FULL_SHA = /^[0-9a-f]{40}$/i

function requiredEnvironmentValue(env, name) {
  const value = env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is required`)
  }
  return value
}

function parseRepository(value) {
  const parts = value.split('/')
  if (
    parts.length !== 2 ||
    parts.some((part) => !/^[A-Za-z0-9_.-]+$/.test(part))
  ) {
    throw new Error('GITHUB_REPOSITORY must be in owner/repository format')
  }
  return parts
}

function malformedApiResponse(detail) {
  return new Error(`Malformed GitHub check-runs response: ${detail}`)
}

function validateCheckRun(value) {
  if (value === null || typeof value !== 'object') {
    throw malformedApiResponse('malformed check run')
  }

  const appOwner = value.app?.owner?.login
  const appSlug = value.app?.slug
  const { completed_at: completedAt, conclusion, head_sha: headSha } = value
  const { id, name, output, started_at: startedAt, status } = value
  if (
    !Number.isSafeInteger(id) ||
    typeof headSha !== 'string' ||
    typeof name !== 'string' ||
    typeof status !== 'string' ||
    (conclusion !== null && typeof conclusion !== 'string') ||
    typeof startedAt !== 'string' ||
    Number.isNaN(Date.parse(startedAt)) ||
    (completedAt !== null &&
      (typeof completedAt !== 'string' ||
        Number.isNaN(Date.parse(completedAt)))) ||
    typeof appOwner !== 'string' ||
    typeof appSlug !== 'string' ||
    output === null ||
    typeof output !== 'object' ||
    (status === 'completed' && (completedAt === null || conclusion === null)) ||
    (status !== 'completed' && conclusion !== null)
  ) {
    throw malformedApiResponse('malformed check run')
  }

  return {
    appOwner,
    appSlug,
    completedAt,
    conclusion,
    headSha,
    id,
    name,
    startedAt,
    status,
    summary: output.summary,
  }
}

export function validateImmutablePreviewUrl(value) {
  let parsed
  try {
    parsed = new URL(value)
  } catch {
    throw new Error('Expected an immutable Cloudflare preview URL')
  }

  if (
    parsed.protocol !== 'https:' ||
    parsed.username !== '' ||
    parsed.password !== '' ||
    parsed.port !== '' ||
    !IMMUTABLE_PREVIEW_HOST.test(parsed.hostname) ||
    parsed.pathname !== '/' ||
    parsed.search !== '' ||
    parsed.hash !== ''
  ) {
    throw new Error('Expected an immutable Cloudflare preview URL')
  }

  return parsed.origin
}

function previewUrlFromSummary(summary) {
  if (typeof summary !== 'string') {
    throw malformedApiResponse('successful check run has no summary')
  }

  const candidates = new Set()
  for (const value of summary.match(/https:\/\/[^\s'"<>]+/g) ?? []) {
    try {
      candidates.add(validateImmutablePreviewUrl(value))
    } catch {
      // The Cloudflare summary also contains its mutable branch alias and dashboard URL.
    }
  }
  if (candidates.size !== 1) {
    throw malformedApiResponse(
      'successful check run must expose exactly one immutable preview URL'
    )
  }
  return [...candidates][0]
}

export async function fetchCloudflareCheckRuns({
  repository,
  token,
  headSha,
  fetchImpl = globalThis.fetch,
  signal,
}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required')
  }
  const [owner, repo] = parseRepository(repository)
  const checkRuns = []
  let page = 1
  let totalCount = 0

  do {
    const url = new URL(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(headSha)}/check-runs`,
      API_ORIGIN
    )
    url.searchParams.set('check_name', CHECK_NAME)
    url.searchParams.set('filter', 'all')
    url.searchParams.set('page', String(page))
    url.searchParams.set('per_page', '100')

    let apiResponse
    try {
      apiResponse = await fetchImpl(url, {
        signal,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': API_VERSION,
        },
      })
    } catch {
      throw new Error('GitHub check-runs request failed')
    }

    if (
      apiResponse === null ||
      typeof apiResponse !== 'object' ||
      apiResponse.ok !== true
    ) {
      const status = Number.isInteger(apiResponse?.status)
        ? ` (${apiResponse.status})`
        : ''
      throw new Error(`GitHub check-runs request failed${status}`)
    }

    let body
    try {
      body = await apiResponse.json()
    } catch {
      throw malformedApiResponse('response was not valid JSON')
    }
    if (
      body === null ||
      typeof body !== 'object' ||
      !Number.isInteger(body.total_count) ||
      body.total_count < 0 ||
      !Array.isArray(body.check_runs)
    ) {
      throw malformedApiResponse('invalid result shape')
    }
    if (page === 1) {
      totalCount = body.total_count
    } else if (body.total_count !== totalCount) {
      throw malformedApiResponse('total count changed during pagination')
    }
    if (body.check_runs.length === 0 && checkRuns.length < totalCount) {
      throw malformedApiResponse('pagination ended before total count')
    }

    checkRuns.push(...body.check_runs)
    page += 1
  } while (checkRuns.length < totalCount)

  return checkRuns
}

export async function resolveCloudflarePreview({
  repository,
  token,
  headSha,
  fetchImpl = globalThis.fetch,
  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
  now = Date.now,
  pollIntervalMs = POLL_INTERVAL_MS,
  maxWaitMs = MAX_WAIT_MS,
}) {
  if (!FULL_SHA.test(headSha)) {
    throw new Error('PR_HEAD_SHA must be a full 40-character commit SHA')
  }
  parseRepository(repository)
  if (!Number.isFinite(pollIntervalMs) || pollIntervalMs <= 0) {
    throw new Error('Poll interval must be positive')
  }
  if (
    !Number.isInteger(maxWaitMs) ||
    maxWaitMs < 1 ||
    maxWaitMs > 2 ** 32 - 1
  ) {
    throw new Error('Maximum wait must be a positive 32-bit integer')
  }

  const startedAt = now()
  const timeoutSignal = AbortSignal.timeout(maxWaitMs)

  for (;;) {
    let rawCheckRuns
    try {
      rawCheckRuns = await fetchCloudflareCheckRuns({
        repository,
        token,
        headSha,
        fetchImpl,
        signal: timeoutSignal,
      })
    } catch (error) {
      if (timeoutSignal.aborted) {
        throw new Error(
          `Cloudflare preview resolution timed out after ${maxWaitMs / 1_000} seconds`
        )
      }
      throw error
    }

    const elapsed = now() - startedAt
    if (elapsed >= maxWaitMs) {
      throw new Error(
        `Cloudflare preview resolution timed out after ${maxWaitMs / 1_000} seconds`
      )
    }

    const matching = rawCheckRuns
      .map(validateCheckRun)
      .filter(
        (candidate) =>
          candidate.headSha === headSha &&
          candidate.name === CHECK_NAME &&
          candidate.appOwner === CLOUDFLARE_APP_OWNER &&
          candidate.appSlug === CLOUDFLARE_APP_SLUG
      )
      .sort((left, right) => {
        const timeDifference =
          Date.parse(right.startedAt) - Date.parse(left.startedAt)
        return timeDifference === 0 ? right.id - left.id : timeDifference
      })
    const [newest] = matching

    if (newest?.status === 'completed') {
      if (newest.conclusion !== 'success') {
        throw new Error(
          `Newest matching Cloudflare check reached terminal conclusion: ${newest.conclusion ?? 'missing'}`
        )
      }
      return previewUrlFromSummary(newest.summary)
    }

    await sleep(Math.min(pollIntervalMs, maxWaitMs - elapsed))
  }
}

export async function runFromEnvironment({
  env = process.env,
  fetchImpl = globalThis.fetch,
  sleep,
  now,
  appendFileImpl = appendFile,
} = {}) {
  const repository = requiredEnvironmentValue(env, 'GITHUB_REPOSITORY')
  const token = requiredEnvironmentValue(env, 'GITHUB_TOKEN')
  const headSha = requiredEnvironmentValue(env, 'PR_HEAD_SHA')
  const outputPath = requiredEnvironmentValue(env, 'GITHUB_OUTPUT')

  const url = await resolveCloudflarePreview({
    repository,
    token,
    headSha,
    fetchImpl,
    ...(sleep === undefined ? {} : { sleep }),
    ...(now === undefined ? {} : { now }),
  })
  await appendFileImpl(outputPath, `preview_url=${url}\n`, { encoding: 'utf8' })
  return url
}

const isDirectExecution =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectExecution) {
  runFromEnvironment().catch((error) => {
    const message =
      error instanceof Error
        ? error.message
        : 'Cloudflare preview resolution failed'
    process.stderr.write(`${message}\n`)
    process.exitCode = 1
  })
}
