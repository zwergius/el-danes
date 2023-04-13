import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
  const [codeRes, expRes] = await Promise.all([
    fetch(`/code/cases.json`),
    fetch(`/en/cases.json`),
  ])
  if (!codeRes.ok) {
    throw error(500, `Could not load cases code`)
  }
  if (!expRes.ok) {
    throw error(500, `Could not load experiences`)
  }
  const code = await codeRes.text()

  const experiences = await expRes.json()
  return {
    code,
    experiences,
  }
}
