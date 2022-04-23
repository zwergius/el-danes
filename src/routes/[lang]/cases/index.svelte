<script context="module" lang="ts">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch }) {
    const [codeRes, expRes] = await Promise.all([
      fetch(`/code/cases.json`),
      fetch(`/en/cases.json`),
    ])
    if (!codeRes.ok) {
      return {
        status: codeRes.status,
        error: new Error(`Could not load cases code`),
      }
    }
    if (!expRes.ok) {
      return {
        status: expRes.status,
        error: new Error(`Could not load experiences`),
      }
    }
    return {
      props: {
        code: await codeRes.text(),
        experiences: await expRes.json(),
      },
    }
  }
</script>

<script lang="ts">
  import { LL } from '$i18n/i18n-svelte'
  import type { Experience } from '$lib/types'
  import { pageCode, pageHeader, theme } from '$lib/stores'
  import SEO from '$lib/components/SEO.svelte'
  import Hoverable from '$lib/components/Hoverable.svelte'
  import Anchor from '$lib/components/Anchor.svelte'

  export let code: string, experiences: Experience[]

  $pageHeader = $LL.goodCompany()
  $pageCode = code

  const projects = experiences
    .map((companies) => companies.projects)
    .flat()
    .filter(({ visible }) => Boolean(visible))
    .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
</script>

<SEO title={$LL.goodCompany()} />

<section>
  <ul>
    {#each projects as client}
      <li>
        <Hoverable let:hovering={isHovering}>
          {#if client.url}
            <Anchor
              id={client.id}
              class="client-link"
              href={client.url}
              rel="external noopener"
              target="_blank"
            >
              {client.name}
              <span>{$LL.view()}</span>

              {#if isHovering}
                <div
                  style="background: {$theme === 'dark'
                    ? 'rgb(0, 0, 0, 0.8)'
                    : 'rgb(255, 255, 255, 0.8)'};"
                  class="stack"
                >
                  <p>{client.type} - {client.stack}</p>
                </div>
              {/if}
            </Anchor>
          {:else}
            <p>{client.name}</p>

            {#if isHovering}
              <div
                style="background: {$theme === 'dark'
                  ? 'rgb(0, 0, 0, 0.8)'
                  : 'rgb(255, 255, 255, 0.8)'};"
                class="stack"
              >
                <p>{client.type} - {client.stack}</p>
              </div>
            {/if}
          {/if}
        </Hoverable>
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    display: inline-block;
  }

  li {
    position: relative;
    white-space: nowrap;
  }

  :global(li > a.client-link::after) {
    width: 100%;
  }

  li span {
    position: absolute;
    top: 0.4em;
    left: 100%;
    font-size: var(--font-1);
    text-transform: uppercase;
  }

  .stack {
    font-size: var(--font-2);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    min-width: 100%;
    height: 100%;
    color: var(--text);
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
</style>
