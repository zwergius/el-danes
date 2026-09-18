# Preview delivery controls

Pull requests targeting `master` are gated by two required checks:

- `Cloudflare Pages`, which publishes the preview for the exact pull-request head SHA.
- `Preview E2E`, which resolves that immutable deployment from the official Cloudflare check and runs the browser suite.

Required checks are strict, so a pull request must be up to date with `master` before it can merge. The workflow is credential-free: repository variables, secrets, and API tokens are not part of preview resolution.

Cloudflare Pages uses `master` as the production branch. Repository automation and pull requests target `master`; the retired `dev` branch must not be recreated or used as an integration branch.

The rollout evidence and live repository-state verification are recorded on [issue #114](https://github.com/zwergius/el-danes/issues/114).
