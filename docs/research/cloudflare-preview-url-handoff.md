# Cloudflare preview URL handoff to GitHub Actions

## Decision

Use a `pull_request` workflow as the required E2E check and have that workflow
poll Cloudflare's Pages Deployments API for the newest **preview** deployment
whose full `deployment_trigger.metadata.commit_hash` equals
`github.event.pull_request.head.sha`. Wait for that deployment to reach a
terminal state, require `latest_stage.status == "success"`, and pass its `url`
field to Playwright.

The workflow should:

1. run for `opened`, `reopened`, `synchronize`, and `ready_for_review` events on
   pull requests targeting `dev` or `master`;
2. avoid browser work while the pull request is a draft, then run on
   `ready_for_review`;
3. query
   `GET /accounts/{account_id}/pages/projects/el-danes/deployments?env=preview`,
   paginate as necessary, match the exact full commit SHA, and select the newest
   matching `created_on`;
4. continue polling while the newest match is `idle` or `active`, fail
   immediately on `failure`, `canceled`, or a skipped deployment, and fail on a
   bounded timeout if no matching deployment appears;
5. accept only the deployment's top-level `url`, verify that it is an HTTPS
   atomic `*.el-danes.pages.dev` URL rather than a branch alias, and expose only
   that URL to the browser jobs;
6. use concurrency keyed by pull-request number with `cancel-in-progress: true`,
   so a new commit cannot finish testing an obsolete preview; and
7. give the gate one unique, stable job name, such as `Preview E2E`, and require
   both that check (from GitHub Actions) and `Cloudflare Pages` (from the
   Cloudflare app) on `dev` and `master`.

This is the most reliable handoff because Cloudflare's documented API gives the
three fields the workflow needs as structured data: the trigger commit hash,
the deployment state, and the live deployment URL. The endpoint accepts a
least-privilege `Pages Read` token and supports an `env=preview` filter and
pagination. [Cloudflare Pages Deployments API](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/list/)

Cloudflare documents hash-based preview URLs as atomic and permanently
addressable, while branch aliases move to the latest branch deployment. The
workflow must therefore use the API's deployment `url`, not an item from
`aliases` and not the branch-preview URL shown by the GitHub app.
[Cloudflare preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/#preview-aliases)

## Why the workflow starts from `pull_request`

A required check has to be reported for the pull request's current testable
commit. The `pull_request` event also directly models the agreed lifecycle:
`synchronize` covers new commits and `ready_for_review` covers a draft becoming
ready. GitHub supports those activity types, and branch filters can restrict
the workflow to the two target branches.
[GitHub Actions events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)

A workflow triggered by Cloudflare's `check_run` completion is useful as a
notification but is the wrong primary required-check trigger. GitHub states
that a `check_run` workflow uses the last commit on the default branch for
`GITHUB_SHA`/`GITHUB_REF`, requires the workflow file to exist on the default
branch, and suppresses some check-triggered workflows to prevent recursion.
That does not reliably create the required Actions check on the pull request's
head/test commit. [GitHub `check_run` event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#check_run)

## Repository evidence

The live Cloudflare app behavior on
[Configure shared agent workflows](https://github.com/zwergius/el-danes/pull/93)
confirms that Cloudflare creates a `Cloudflare Pages` check run on the exact
pull-request head SHA. The check's output includes both an atomic preview URL
(`https://ec6a8e60.el-danes.pages.dev`) and a mutable branch URL. Its
`external_id` and dashboard link identify deployment
`ec6a8e60-b564-42e7-94aa-d904d1d53cb6`.
[Live check-run response](https://api.github.com/repos/zwergius/el-danes/check-runs/89658231419)

The same pull request also received a Cloudflare bot comment containing those
two URLs. [Live Cloudflare PR comment](https://github.com/zwergius/el-danes/pull/93#issuecomment-5077558204)
By contrast,
[fix jml](https://github.com/zwergius/el-danes/pull/92) has a successful
Cloudflare check run but no Cloudflare PR comment, so comments are not complete
enough to be the handoff source. Its live check again exposes separate atomic
and branch-preview URLs.
[Second live check-run response](https://api.github.com/repos/zwergius/el-danes/check-runs/54254065047)

The repository's GitHub Deployments collection has no deployment corresponding
to that successful preview. Cloudflare's app has chosen checks/comments rather
than a GitHub Deployment for this repository, so a `deployment_status` workflow
cannot receive an `environment_url` here.
[Live GitHub Deployments query](https://api.github.com/repos/zwergius/el-danes/deployments?sha=8e22ad6620c0a160c13410452e1ed027f3d13067)

Cloudflare officially documents Git integration as producing preview URLs and
GitHub check runs. It also documents that skipped builds do not produce a check
run or commit status.
[Cloudflare GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#check-runs)

## Alternatives considered

| Signal | Strength | Why it is not the primary handoff |
| --- | --- | --- |
| Cloudflare Pages Deployments API | Structured commit hash, environment, state, timestamp, and immutable URL; Cloudflare-owned contract | Recommended. It needs an account ID and a read-only API token. |
| `Cloudflare Pages` check run | Exact head SHA, terminal conclusion, and available through GitHub's Checks API | Use as a corroborating/visible required check. Cloudflare does not document the HTML format of `output.summary`; parsing its `Preview URL` would couple CI to presentation markup. |
| Cloudflare PR comment | Human-readable atomic and branch URLs | Comments may be absent, can lag or be edited, contain HTML, and identify the commit only in presentation text. Live repository history already contains a successful check without a comment. |
| GitHub `deployment_status` | Would provide a structured `environment_url` and a native Actions trigger | No GitHub Deployment exists for successful live Pages builds in this repository. |
| Branch-preview URL | Easy to derive from the branch name | It is intentionally mutable and races when multiple commits deploy. |
| Blind HTTP polling of a guessed URL | Requires no API credential | There is no documented deterministic mapping from a Git commit SHA to Cloudflare's random deployment hash, and HTTP success does not prove the deployment belongs to the requested commit. |

GitHub's Checks API remains useful for diagnostics and for requiring the
Cloudflare build itself. It supports filtering check runs by name, app, status,
and latest completion time and requires only `Checks: read` for private
repositories (public check data can be read without authentication).
[GitHub check-runs API](https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference)

## Lifecycle and race handling

### New commits

Each `synchronize` event starts a run for the new
`pull_request.head.sha`. Cancel the older run by pull-request-number concurrency
and never fall back to a branch alias. Exact SHA matching prevents the newer
branch alias from being tested by the older run.

### Redeployments of the same commit

Cloudflare can create more than one deployment for one SHA. Always select the
newest matching `created_on`. A manually retried deployment should be followed
by **re-running the existing pull-request E2E workflow run** after Cloudflare
finishes; a GitHub Actions re-run preserves the pull-request association and
required-check identity while re-querying the newest deployment.

There is no suitable native automatic redeployment trigger in the current
integration: `deployment_status` has no live deployment object, a PR comment is
not dependable, and a `check_run`-triggered Actions run is associated with the
default branch rather than the pull-request commit. The CI design decision may
add a privileged dispatcher later, but it is not required for a correct gate:
the required `Cloudflare Pages` check blocks a failed redeployment, and the E2E
run can be explicitly re-run after a successful redeployment.

### Failed, canceled, skipped, or missing deployments

Fail closed. A failed or canceled latest deployment must fail `Preview E2E`
without starting browsers. A missing deployment must time out and fail rather
than silently skip. This also catches Cloudflare's documented `[CI Skip]`,
branch-control, and path-control cases, for which no Cloudflare check appears.
[Cloudflare skipped-build behavior](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#check-runs)

### Draft to ready

The draft run should not consume browser capacity. The explicit
`ready_for_review` activity starts a fresh run, which may immediately find the
already completed deployment for the unchanged head SHA or wait for it if
necessary. A later `synchronize` repeats the normal new-commit path.

### Pull requests targeting `dev` or `master`

Use `branches: [dev, master]` on the `pull_request` trigger. The workflow file
must be present on each target branch before its checks can gate pull requests
to that branch. Roll out and observe the workflow before turning on enforcement
for each branch.

### Fork pull requests

Cloudflare states that its Git integration does not create preview URLs for
pull requests originating from forks. Therefore this gate cannot test fork PRs
without a separate trusted deployment path. Under the agreed “every ready PR”
policy, fail closed with a clear message and require a maintainer-owned branch
for E2E. Do not expose the Cloudflare token to fork-authored workflow code.
[Cloudflare fork limitation](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#preview-urls)

## Permissions and secret handling

- Store the Cloudflare account ID as a repository variable and a dedicated API
  token as a secret. Give the token only `Pages Read`, scoped to the account and
  project as narrowly as Cloudflare permits; never use the global API key.
- Set workflow permissions explicitly. The URL-resolver job needs only
  `contents: read` from GitHub; the browser jobs need no write permission.
- Keep the Cloudflare token out of Playwright's job and environment. Resolve the
  URL in a small handoff job, mask it defensively, and pass only the validated
  public URL as a job output.
- Pin third-party actions to full commit SHAs. Do not run arbitrary browser code
  in a job that holds the Cloudflare credential.
- Same-repository workflow changes can access repository secrets. Protect the
  workflow and resolver code through review/branch controls; if collaborators
  beyond trusted maintainers gain write access, move the token behind a
  protected environment or a separately controlled reusable workflow before
  enabling automatic access.

Cloudflare lists `Pages Read` as an accepted permission for the deployments
endpoint and recommends bearer API tokens over global keys.
[Cloudflare API authorization](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/list/#get-deployments)

## Required-check rollout

1. Give the final non-matrix gate job one unique stable name, `Preview E2E`.
   Matrix workers should feed it through a final `always()` gate job so failures
   cannot turn the required job into a skipped success.
2. Land the workflow on `dev`, observe a successful run there, then require
   `Preview E2E` from GitHub Actions and `Cloudflare Pages` from the Cloudflare
   app for pull requests into `dev`.
3. Promote the workflow to `master`, observe it there, and apply the equivalent
   requirement to `master`.
4. Do not use workflow path filters for a required check: GitHub documents that
   a skipped workflow can leave a required check pending indefinitely. Keep the
   stable gate present and make any intentional no-op decision inside the
   workflow.

GitHub recommends unique job names for required checks and allows the expected
GitHub App to be selected as a check's source.
[GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
GitHub also documents the pending/skipped and dependent-job failure modes for
required checks.
[GitHub required-check troubleshooting](https://docs.github.com/en/pull-requests/troubleshooting-required-status-checks)

The repository currently has no repository rulesets according to its live
first-party API response. The available token cannot read classic branch
protection, so the implementation must inspect the `dev` and `master`
protection UI/API with administrator access before changing enforcement.
[Live repository rulesets](https://api.github.com/repos/zwergius/el-danes/rulesets)

## Inputs for the CI-design decision

The remaining workflow-design decision should lock:

- the polling interval and timeout;
- the exact Cloudflare secret/variable names and token ownership;
- whether same-SHA redeployments remain an explicit “redeploy, then re-run E2E”
  operation or gain a privileged dispatcher;
- the final matrix-to-gate job dependency shape and artifact retention; and
- the maintainer-owned-branch policy for contributions from forks.

It should not reopen the handoff choice: the authoritative value is the newest
successful Cloudflare Pages **preview deployment URL matched by full PR head
SHA**.
