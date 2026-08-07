import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  fetchPreviewDeployments,
  resolveCloudflarePreview,
  runFromEnvironment,
  validateImmutablePreviewUrl,
} from '../../scripts/resolve-cloudflare-preview.mjs'

const HEAD_SHA = '0123456789abcdef0123456789abcdef01234567'
const OTHER_SHA = 'abcdef0123456789abcdef0123456789abcdef01'

function deployment({
  sha = HEAD_SHA,
  createdOn = '2026-07-29T08:00:00.000Z',
  status = 'success',
  url = 'https://deadbeef.el-danes.pages.dev',
} = {}) {
  return {
    created_on: createdOn,
    deployment_trigger: { metadata: { commit_hash: sha } },
    latest_stage: { status },
    url,
  }
}

function response(
  result,
  { page = 1, totalPages = 1, ok = true, success = true } = {}
) {
  return {
    ok,
    status: ok ? 200 : 500,
    json() {
      return Promise.resolve({
        success,
        result,
        result_info: { page, total_pages: totalPages },
      })
    },
  }
}

function pagedFetch(pages, calls = []) {
  return (url, options) => {
    const parsed = new URL(url)
    const page = Number(parsed.searchParams.get('page') ?? '1')
    calls.push({ parsed, options })
    return response(pages[page - 1] ?? [], { page, totalPages: pages.length })
  }
}

function roundsFetch(rounds) {
  let round = 0
  return () => {
    const result = rounds[Math.min(round, rounds.length - 1)]
    round += 1
    return response(result)
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

test('follows Cloudflare pagination without exposing the token in the URL', async () => {
  const calls = []
  const deployments = await fetchPreviewDeployments({
    accountId: 'account/id',
    project: 'el danes',
    token: 'top-secret-token',
    fetchImpl: pagedFetch(
      [[deployment({ sha: OTHER_SHA })], [deployment()]],
      calls
    ),
  })

  assert.equal(deployments.length, 2)
  assert.deepEqual(
    calls.map(({ parsed }) => parsed.searchParams.get('page')),
    ['1', '2']
  )
  for (const { parsed, options } of calls) {
    assert.equal(parsed.searchParams.get('env'), 'preview')
    assert.equal(
      parsed.pathname,
      '/client/v4/accounts/account%2Fid/pages/projects/el%20danes/deployments'
    )
    assert.equal(options.headers.Authorization, 'Bearer top-secret-token')
    assert.equal(parsed.href.includes('top-secret-token'), false)
  }
})

test('requires an exact full commit SHA match instead of accepting a prefix', async () => {
  const resolved = await resolveCloudflarePreview({
    accountId: 'account',
    project: 'el-danes',
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch([
      [
        deployment({
          sha: HEAD_SHA.slice(0, 12),
          url: 'https://aaaaaaaa.el-danes.pages.dev',
        }),
        deployment({
          sha: HEAD_SHA,
          url: 'https://bbbbbbbb.el-danes.pages.dev',
        }),
      ],
    ]),
  })

  assert.equal(resolved, 'https://bbbbbbbb.el-danes.pages.dev')
})

test('selects the newest same-SHA redeployment by created_on', async () => {
  const resolved = await resolveCloudflarePreview({
    accountId: 'account',
    project: 'el-danes',
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: pagedFetch([
      [
        deployment({
          createdOn: '2026-07-29T08:00:00.000Z',
          url: 'https://aaaaaaaa.el-danes.pages.dev',
        }),
        deployment({
          createdOn: '2026-07-29T08:01:00.000Z',
          url: 'https://bbbbbbbb.el-danes.pages.dev',
        }),
      ],
    ]),
  })

  assert.equal(resolved, 'https://bbbbbbbb.el-danes.pages.dev')
})

test('fails when the newest same-SHA redeployment failed even if an older one succeeded', async () => {
  await assert.rejects(
    resolveCloudflarePreview({
      accountId: 'account',
      project: 'el-danes',
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: pagedFetch([
        [
          deployment({
            createdOn: '2026-07-29T08:00:00.000Z',
            status: 'success',
          }),
          deployment({
            createdOn: '2026-07-29T08:01:00.000Z',
            status: 'failure',
          }),
        ],
      ]),
    }),
    /terminal status: failure/
  )
})

test('polls idle and active deployments every 15 seconds until success', async () => {
  let now = 0
  const sleeps = []
  const resolved = await resolveCloudflarePreview({
    accountId: 'account',
    project: 'el-danes',
    token: 'token',
    headSha: HEAD_SHA,
    fetchImpl: roundsFetch([
      [deployment({ status: 'idle' })],
      [deployment({ status: 'active' })],
      [deployment({ status: 'success' })],
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

for (const status of ['failure', 'canceled', 'cancelled', 'skipped']) {
  test(`fails immediately for terminal status ${status}`, async () => {
    let slept = false
    await assert.rejects(
      resolveCloudflarePreview({
        accountId: 'account',
        project: 'el-danes',
        token: 'token',
        headSha: HEAD_SHA,
        fetchImpl: pagedFetch([[deployment({ status })]]),
        sleep: () => {
          slept = true
        },
      }),
      new RegExp(`terminal status: ${status}`)
    )
    assert.equal(slept, false)
  })
}

test('times out when no matching deployment appears', async () => {
  let now = 0
  let requests = 0
  await assert.rejects(
    resolveCloudflarePreview({
      accountId: 'account',
      project: 'el-danes',
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
      accountId: 'account',
      project: 'el-danes',
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
      accountId: 'account',
      project: 'el-danes',
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: () => response([deployment()]),
      now: () => times.shift(),
    }),
    /timed out after 900 seconds/
  )
})

test('rejects malformed API responses', async () => {
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
      json: () =>
        Promise.resolve({
          success: false,
          result: [],
          result_info: { page: 1, total_pages: 1 },
        }),
    },
    {
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          result: {},
          result_info: { page: 1, total_pages: 1 },
        }),
    },
    {
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          result: [],
          result_info: { page: 1 },
        }),
    },
  ]

  for (const malformed of malformedResponses) {
    await assert.rejects(
      fetchPreviewDeployments({
        accountId: 'account',
        project: 'el-danes',
        token: 'token',
        fetchImpl: () => malformed,
      }),
      /Cloudflare API/
    )
  }
})

test('rejects malformed matching deployment records', async () => {
  const malformed = deployment()
  delete malformed.latest_stage

  await assert.rejects(
    resolveCloudflarePreview({
      accountId: 'account',
      project: 'el-danes',
      token: 'token',
      headSha: HEAD_SHA,
      fetchImpl: pagedFetch([[malformed]]),
    }),
    /malformed deployment/
  )
})

test('reads canonical environment variables and writes only the validated URL output', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'el-danes-resolver-'))
  const outputPath = join(directory, 'github-output')
  try {
    const resolved = await runFromEnvironment({
      env: {
        CLOUDFLARE_ACCOUNT_ID: 'account',
        CLOUDFLARE_PAGES_PROJECT: 'el-danes',
        CLOUDFLARE_PAGES_READ_TOKEN: 'top-secret-token',
        PR_HEAD_SHA: HEAD_SHA,
        GITHUB_OUTPUT: outputPath,
      },
      fetchImpl: pagedFetch([[deployment()]]),
    })

    assert.equal(resolved, 'https://deadbeef.el-danes.pages.dev')
    assert.equal(
      await readFile(outputPath, 'utf8'),
      'preview_url=https://deadbeef.el-danes.pages.dev\n'
    )
    assert.equal(
      (await readFile(outputPath, 'utf8')).includes('top-secret-token'),
      false
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('rejects missing environment values and non-full head SHAs', async () => {
  const base = {
    CLOUDFLARE_ACCOUNT_ID: 'account',
    CLOUDFLARE_PAGES_PROJECT: 'el-danes',
    CLOUDFLARE_PAGES_READ_TOKEN: 'token',
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
      env: { ...base, PR_HEAD_SHA: HEAD_SHA.slice(0, 12) },
    }),
    /PR_HEAD_SHA must be a full 40-character commit SHA/
  )
})
