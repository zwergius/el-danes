import { appendFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const API_ORIGIN = 'https://api.cloudflare.com'
const POLL_INTERVAL_MS = 15_000
const MAX_WAIT_MS = 15 * 60_000
const NON_TERMINAL_STATUSES = new Set(['idle', 'active'])
const IMMUTABLE_PREVIEW_HOST = /^[0-9a-f]{8}\.el-danes\.pages\.dev$/
const FULL_SHA = /^[0-9a-f]{40}$/i

function requiredEnvironmentValue(env, name) {
  const value = env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is required`)
  }
  return value
}

function malformedApiResponse(detail) {
  return new Error(`Malformed Cloudflare API response: ${detail}`)
}

function validatePage(body, expectedPage) {
  if (body === null || typeof body !== 'object' || body.success !== true) {
    throw malformedApiResponse('request was not successful')
  }
  if (!Array.isArray(body.result)) {
    throw malformedApiResponse('result must be an array')
  }

  const page = body.result_info?.page
  const totalPages = body.result_info?.total_pages
  if (
    !Number.isInteger(page) ||
    page !== expectedPage ||
    !Number.isInteger(totalPages) ||
    totalPages < 1 ||
    totalPages < page
  ) {
    throw malformedApiResponse('invalid pagination metadata')
  }

  return { deployments: body.result, totalPages }
}

function validateDeployment(value) {
  if (value === null || typeof value !== 'object') {
    throw malformedApiResponse('malformed deployment')
  }

  const commitHash = value.deployment_trigger?.metadata?.commit_hash
  const status = value.latest_stage?.status
  const { created_on: createdOn, url } = value
  if (
    typeof commitHash !== 'string' ||
    typeof status !== 'string' ||
    typeof createdOn !== 'string' ||
    Number.isNaN(Date.parse(createdOn)) ||
    typeof url !== 'string'
  ) {
    throw malformedApiResponse('malformed deployment')
  }

  return { commitHash, status, createdOn, url }
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

export async function fetchPreviewDeployments({
  accountId,
  project,
  token,
  fetchImpl = globalThis.fetch,
  signal,
}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required')
  }

  const deployments = []
  let page = 1
  let totalPages = 1

  do {
    const url = new URL(
      `/client/v4/accounts/${encodeURIComponent(accountId)}/pages/projects/${encodeURIComponent(project)}/deployments`,
      API_ORIGIN
    )
    url.searchParams.set('env', 'preview')
    url.searchParams.set('page', String(page))

    let apiResponse
    try {
      apiResponse = await fetchImpl(url, {
        signal,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      throw new Error('Cloudflare API request failed')
    }

    if (
      apiResponse === null ||
      typeof apiResponse !== 'object' ||
      apiResponse.ok !== true
    ) {
      const status = Number.isInteger(apiResponse?.status)
        ? ` (${apiResponse.status})`
        : ''
      throw new Error(`Cloudflare API request failed${status}`)
    }

    let body
    try {
      body = await apiResponse.json()
    } catch {
      throw malformedApiResponse('response was not valid JSON')
    }

    const { deployments: pageDeployments, totalPages: validatedTotalPages } =
      validatePage(body, page)
    deployments.push(...pageDeployments)
    totalPages = validatedTotalPages
    page += 1
  } while (page <= totalPages)

  return deployments
}

export async function resolveCloudflarePreview({
  accountId,
  project,
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
    let rawDeployments
    try {
      rawDeployments = await fetchPreviewDeployments({
        accountId,
        project,
        token,
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

    const matching = rawDeployments
      .map(validateDeployment)
      .filter((candidate) => candidate.commitHash === headSha)
      .sort(
        (left, right) =>
          Date.parse(right.createdOn) - Date.parse(left.createdOn)
      )
    const [newest] = matching

    if (newest?.status === 'success') {
      return validateImmutablePreviewUrl(newest.url)
    }
    if (newest && !NON_TERMINAL_STATUSES.has(newest.status)) {
      throw new Error(
        `Newest matching Cloudflare deployment reached terminal status: ${newest.status}`
      )
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
  const accountId = requiredEnvironmentValue(env, 'CLOUDFLARE_ACCOUNT_ID')
  const project = requiredEnvironmentValue(env, 'CLOUDFLARE_PAGES_PROJECT')
  const token = requiredEnvironmentValue(env, 'CLOUDFLARE_PAGES_READ_TOKEN')
  const headSha = requiredEnvironmentValue(env, 'PR_HEAD_SHA')
  const outputPath = requiredEnvironmentValue(env, 'GITHUB_OUTPUT')

  const url = await resolveCloudflarePreview({
    accountId,
    project,
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
