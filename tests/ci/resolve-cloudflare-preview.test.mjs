import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  fetchCloudflareCheckRuns,
  resolveCloudflarePreview,
  runFromEnvironment,
  validateImmutablePreviewUrl,
} from '../../scripts/resolve-cloudflare-preview.mjs'

const HEAD_SHA = '0123456789abcdef0123456789abcdef01234567'
const OTHER_SHA = 'abcdef0123456789abcdef0123456789abcdef01'
const REPOSITORY = 'zwergius/el-danes'

function checkRun({
  id = 101,
  sha = HEAD_SHA,
  name = 'Cloudflare Pages',
  status = 'completed',
  conclusion = status === 'completed' ? 'success' : null,
  startedAt = '2026-08-09T08:00:00.000Z',
  completedAt = status === 'completed' ? '2026-08-09T08:01:00.000Z' : null,
  appOwner = 'cloudflare',
  appSlug = 'cloudflare-workers-and-pages',
  summary = `<a href='https://deadbeef.el-danes.pages.dev'>Preview URL</a>
<a href='https://feature.el-danes.pages.dev'>Branch Preview URL</a>`,
} = {}) {
  return {
    id,
    head_sha: sha,
    name,
    status,
    conclusion,
    started_at: startedAt,
    completed_at: completedAt,
    app: { owner: { login: appOwner }, slug: appSlug },
    output: { summary },
  }
}

function response(
  checkRuns,
  { ok = true, status = ok ? 200 : 500, totalCount = checkRuns.length } = {}
) {
  return {
    ok,
    status,
    json() {
      return Promise.resolve({ total_count: totalCount, check_runs: checkRuns })
    },
  }
}

function pagedFetch(pages, calls = []) {
  const totalCount = pages.flat().length
  return (url, options) => {
    const parsed = new URL(url)
    const page = Number(parsed.searchParams.get('page') ?? '1')
    calls.push({ parsed, options })
    return response(pages[page - 1] ?? [], { totalCount })
  }
}

function roundsFetch(rounds) {
  let round = 0
  return () => {
    const checkRuns = rounds[Math.min(round, rounds.length - 1)]
    round += 1
    return response(checkRuns)
  }
}

test('accepts only a hexadecimal immutable deployment root URL', () => {
  assert.equal(
    validateImmutablePreviewUrl('https://0123abcd.el-danes.pages.dev'),
    'https://0123abcd.el-danes.pages.dev'
  )
})

test('rejects aliases, production, credentials, paths, queries, fragments, HTTP, and arbitrary origins', () => {
  const rejected = [
    'https://feature.el-danes.pages.dev',
    'https://abc.el-danes.pages.dev',
    'https://0123abcdef.el-danes.pages.dev',
    'https://deadbeef.feature.el-danes.pages.dev',
    'https://el-danes.pages.dev',
    'https://user:pass@deadbeef.el-danes.pages.dev',
    'https://deadbeef.el-danes.pages.dev/path',
    'https://deadbeef.el-danes.pages.dev?query=yes',
    'https://deadbeef.el-danes.pages.dev#fragment',
    'http://deadbeef.el-danes.pages.dev',
    'https://deadbeef.example.com',
    'not a URL',
  ]

  for (const url of rejected) {
    assert.throws(
      () => validateImmutablePreviewUrl(url),
      /immutable Cloudflare preview URL/
    )
  }
})

test('fetches every GitHub check-run page without exposing the token in the URL', async () => {
  const calls = []
  const checkRuns = await fetchCloudflareCheckRuns({
    repository: REPOSITORY,
    token: 'github-token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch(
      [[checkRun({ id: 1 })], [checkRun({ id: 2 })]],
      calls
    ),
  })

  assert.equal(checkRuns.length, 2)
  assert.deepEqual(
    calls.map(({ parsed }) => parsed.searchParams.get('page')),
    ['1', '2']
  )
  for (const { parsed, options } of calls) {
    assert.equal(parsed.searchParams.get('check_name'), 'Cloudflare Pages')
    assert.equal(parsed.searchParams.get('filter'), 'all')
    assert.equal(
      parsed.pathname,
      `/repos/zwergius/el-danes/commits/${HEAD_SHA}/check-runs`
    )
    assert.equal(options.headers.Authorization, 'Bearer github-token')
    assert.equal(parsed.href.includes('github-token'), false)
  }
})

test('requires an exact full commit SHA match', async () => {
  const resolved = await resolveCloudflarePreview({
    repository: REPOSITORY,
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch([
      [
        checkRun({
          id: 2,
          sha: OTHER_SHA,
          summary: 'https://aaaaaaaa.el-danes.pages.dev',
        }),
        checkRun({
          id: 1,
          sha: HEAD_SHA,
          summary: 'https://bbbbbbbb.el-danes.pages.dev',
        }),
      ],
    ]),
  })

  assert.equal(resolved, 'https://bbbbbbbb.el-danes.pages.dev')
})

test('accepts checks only from the official Cloudflare GitHub app', async () => {
  const resolved = await resolveCloudflarePreview({
    repository: REPOSITORY,
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch([
      [
        checkRun({
          id: 2,
          appOwner: 'attacker',
          summary: 'https://aaaaaaaa.el-danes.pages.dev',
        }),
        checkRun({
          id: 1,
          summary: 'https://bbbbbbbb.el-danes.pages.dev',
        }),
      ],
    ]),
  })

  assert.equal(resolved, 'https://bbbbbbbb.el-danes.pages.dev')
})

test('selects the newest same-SHA Cloudflare check run', async () => {
  const resolved = await resolveCloudflarePreview({
    repository: REPOSITORY,
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch([
      [
        checkRun({
          id: 1,
          startedAt: '2026-08-09T08:00:00.000Z',
          summary: 'https://aaaaaaaa.el-danes.pages.dev',
        }),
        checkRun({
          id: 2,
          startedAt: '2026-08-09T08:01:00.000Z',
          summary: 'https://bbbbbbbb.el-danes.pages.dev',
        }),
      ],
    ]),
  })

  assert.equal(resolved, 'https://bbbbbbbb.el-danes.pages.dev')
})

test('fails when the newest same-SHA check failed even if an older one succeeded', async () => {
  await assert.rejects(
    resolveCloudflarePreview({
      repository: REPOSITORY,
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: pagedFetch([
        [
          checkRun({ id: 1, startedAt: '2026-08-09T08:00:00.000Z' }),
          checkRun({
            id: 2,
            startedAt: '2026-08-09T08:01:00.000Z',
            conclusion: 'failure',
          }),
        ],
      ]),
    }),
    /terminal conclusion: failure/
  )
})

test('polls queued and in-progress checks every 15 seconds until success', async () => {
  let now = 0
  const sleeps = []
  const resolved = await resolveCloudflarePreview({
    repository: REPOSITORY,
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: roundsFetch([
      [checkRun({ status: 'queued' })],
      [checkRun({ status: 'in_progress' })],
      [checkRun()],
    ]),
    now: () => now,
    sleep: (milliseconds) => {
      sleeps.push(milliseconds)
      now += milliseconds
    },
  })

  assert.equal(resolved, 'https://deadbeef.el-danes.pages.dev')
  assert.deepEqual(sleeps, [15_000, 15_000])
})

for (const conclusion of [
  'failure',
  'cancelled',
  'timed_out',
  'action_required',
  'stale',
  'skipped',
]) {
  test(`fails immediately for terminal conclusion ${conclusion}`, async () => {
    let slept = false
    await assert.rejects(
      resolveCloudflarePreview({
        repository: REPOSITORY,
        token: 'token',
        headSha: HEAD_SHA,
        fetchImpl: pagedFetch([[checkRun({ conclusion })]]),
        sleep: () => {
          slept = true
        },
      }),
      new RegExp(`terminal conclusion: ${conclusion}`)
    )
    assert.equal(slept, false)
  })
}

test('times out when no matching check appears', async () => {
  let now = 0
  let requests = 0
  await assert.rejects(
    resolveCloudflarePreview({
      repository: REPOSITORY,
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: () => {
        requests += 1
        return response([])
      },
      now: () => now,
      sleep: (milliseconds) => {
        now += milliseconds
      },
      maxWaitMs: 30_000,
    }),
    /timed out after 30 seconds/
  )
  assert.equal(requests, 3)
})

test('uses a 15-minute default hard timeout', async () => {
  const times = [0, 15 * 60_000]
  await assert.rejects(
    resolveCloudflarePreview({
      repository: REPOSITORY,
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: () => response([]),
      now: () => times.shift(),
    }),
    /timed out after 900 seconds/
  )
})

test('does not accept a successful response that arrives after the deadline', async () => {
  const times = [0, 15 * 60_000 + 1]
  await assert.rejects(
    resolveCloudflarePreview({
      repository: REPOSITORY,
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: () => response([checkRun()]),
      now: () => times.shift(),
    }),
    /timed out after 900 seconds/
  )
})

test('rejects malformed GitHub API responses', async () => {
  const malformedResponses = [
    { ok: false, status: 503, json: () => Promise.resolve({}) },
    {
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error('bad json')),
    },
    {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ total_count: -1, check_runs: [] }),
    },
    {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ total_count: 0, check_runs: {} }),
    },
  ]

  for (const malformed of malformedResponses) {
    await assert.rejects(
      fetchCloudflareCheckRuns({
        repository: REPOSITORY,
        token: 'token',
        headSha: HEAD_SHA,
        fetchImpl: () => malformed,
      }),
      /GitHub check-runs/
    )
  }
})

test('rejects malformed matching check runs', async () => {
  const missingApp = checkRun()
  delete missingApp.app

  for (const malformed of [
    missingApp,
    checkRun({ conclusion: null }),
    checkRun({ status: 'queued', conclusion: 'success' }),
  ]) {
    await assert.rejects(
      resolveCloudflarePreview({
        repository: REPOSITORY,
        token: 'token',
        headSha: HEAD_SHA,
        fetchImpl: pagedFetch([[malformed]]),
      }),
      /malformed check run/
    )
  }
})

test('rejects successful checks without exactly one immutable preview URL', async () => {
  for (const summary of [
    'https://feature.el-danes.pages.dev',
    'https://deadbeef.el-danes.pages.dev.evil.example',
    'https://aaaaaaaa.el-danes.pages.dev https://bbbbbbbb.el-danes.pages.dev',
  ]) {
    await assert.rejects(
      resolveCloudflarePreview({
        repository: REPOSITORY,
        token: 'token',
        headSha: HEAD_SHA,
        fetchImpl: pagedFetch([[checkRun({ summary })]]),
      }),
      /exactly one immutable preview URL/
    )
  }
})

test('normalizes duplicate representations of the same immutable URL', async () => {
  const resolved = await resolveCloudflarePreview({
    repository: REPOSITORY,
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch([
      [
        checkRun({
          summary:
            'https://deadbeef.el-danes.pages.dev https://deadbeef.el-danes.pages.dev/',
        }),
      ],
    ]),
  })

  assert.equal(resolved, 'https://deadbeef.el-danes.pages.dev')
})

test('reads canonical GitHub environment values and writes only the validated URL output', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'el-danes-resolver-'))
  const outputPath = join(directory, 'github-output')
  try {
    const resolved = await runFromEnvironment({
      env: {
        GITHUB_REPOSITORY: REPOSITORY,
        GITHUB_TOKEN: 'github-token',
        PR_HEAD_SHA: HEAD_SHA,
        GITHUB_OUTPUT: outputPath,
      },
      fetchImpl: pagedFetch([[checkRun()]]),
    })

    assert.equal(resolved, 'https://deadbeef.el-danes.pages.dev')
    assert.equal(
      await readFile(outputPath, 'utf8'),
      'preview_url=https://deadbeef.el-danes.pages.dev\n'
    )
    assert.equal(
      (await readFile(outputPath, 'utf8')).includes('github-token'),
      false
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('rejects missing environment values, malformed repositories, and non-full head SHAs', async () => {
  const base = {
    GITHUB_REPOSITORY: REPOSITORY,
    GITHUB_TOKEN: 'token',
    PR_HEAD_SHA: HEAD_SHA,
    GITHUB_OUTPUT: '/tmp/output',
  }

  for (const name of Object.keys(base)) {
    await assert.rejects(
      runFromEnvironment({ env: { ...base, [name]: '' } }),
      new RegExp(name)
    )
  }
  await assert.rejects(
    runFromEnvironment({
      env: { ...base, GITHUB_REPOSITORY: 'invalid' },
    }),
    /owner\/repository/
  )
  await assert.rejects(
    runFromEnvironment({
      env: { ...base, PR_HEAD_SHA: HEAD_SHA.slice(0, 12) },
    }),
    /PR_HEAD_SHA must be a full 40-character commit SHA/
  )
})
