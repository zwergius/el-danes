<script lang="ts">
  import { LL } from '$i18n/i18n-svelte'
  import type { Experience } from '$lib/types'
  import { pageHeader } from '$lib/stores'
  import SEO from '$lib/components/SEO.svelte'
  import Anchor from '$lib/components/Anchor.svelte'
  import type { PageData } from './$types'

  /** @type {import('./$types').PageData */
  export let data: PageData
  let { experiences } = data
  $: ({ experiences } = data)
  $pageHeader = $LL.goodCompany()

  let activeCaseId: string | null = null
  let expandedCaseId: string | null = null

  function toggleDetails(id: string) {
    expandedCaseId = expandedCaseId === id ? null : id
  }

  function activateFromFocus(id: string, event: FocusEvent) {
    const target = event.target as HTMLElement
    activeCaseId = target.classList.contains('details-toggle') ? null : id
  }

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
    {#each projects as client, index}
      {@const detailsId = `case-details-${index}`}
      {@const detailsVisible =
        activeCaseId === client.id || expandedCaseId === client.id}
      <li
        data-case
        on:mouseenter={() => (activeCaseId = client.id)}
        on:mouseleave={() => (activeCaseId = null)}
        on:focusin={(event) => activateFromFocus(client.id, event)}
        on:focusout={() => (activeCaseId = null)}
      >
        <div class="case-heading">
          {#if client.url}
            <Anchor
              id={client.id}
              class="client-link"
              href={client.url}
              rel="external noopener"
              target="_blank"
            >
              {client.name}
              <span class="view">{$LL.view()}</span>
            </Anchor>
          {:else}
            <p>{client.name}</p>
          {/if}

          <button
            type="button"
            class="details-toggle"
            aria-controls={detailsId}
            aria-expanded={detailsVisible}
            aria-label={`${client.name}: ${client.type} - ${client.stack}`}
            on:click={() => toggleDetails(client.id)}
          >
            <span aria-hidden="true">ⓘ</span>
          </button>
        </div>

        <p
          id={detailsId}
          class="stack"
          data-case-details
          hidden={!detailsVisible}
        >
          {client.type} - {client.stack}
        </p>
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
  }

  .case-heading {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  :global(.client-link .view) {
    position: absolute;
    top: 0.4em;
    left: 100%;
    font-size: var(--font-1);
    text-transform: uppercase;
  }

  .details-toggle {
    position: relative;
    z-index: 2;
    flex: 0 0 auto;
    margin-left: var(--space-2);
    font-size: var(--font-1);
    line-height: 1;
    cursor: pointer;
  }

  .details-toggle:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .stack {
    font-size: var(--font-2);
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: 1;
    min-inline-size: 100%;
    min-block-size: 100%;
    color: var(--text);
    background: color-mix(in oklab, var(--background) 80%, transparent);
    display: flex;
    align-items: center;
    white-space: nowrap;
    pointer-events: none;
  }

  .stack[hidden] {
    display: none;
  }
</style>
