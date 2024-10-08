<script lang="ts">
  import { LL } from '$i18n/i18n-svelte'
  import type { Experience } from '$lib/types'
  import { pageHeader, theme } from '$lib/stores'
  import SEO from '$lib/components/SEO.svelte'
  import Hoverable from '$lib/components/Hoverable.svelte'
  import Anchor from '$lib/components/Anchor.svelte'
  import type { PageData } from './$types'

  /** @type {import('./$types').PageData */
  export let data: PageData
  let { experiences } = data
  $: ({ experiences } = data)
  $pageHeader = $LL.goodCompany()

  const projects = experiences
    .map((companies: Experience) => companies.projects)
    .flat()
    .filter(({ visible }) => Boolean(visible))
    .sort((a: { name: string }, b: { name: string }) =>
      a.name.toUpperCase().localeCompare(b.name.toUpperCase())
    )
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
    width: 100%;
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
