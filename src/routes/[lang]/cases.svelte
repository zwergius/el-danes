<script context="module">
  export async function preload() {
    const res = await this.fetch('clients.json')
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    this.error(404, 'Not found')
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'
  import { goodCompany, view } from 'assets/translations.yaml'
  import { pageCode, pageHeader, theme } from '@/stores'
  import projectsData from '@/assets/data/clients.json'
  import SEO from '@/components/SEO.svelte'
  import Hoverable from '@/components/Hoverable.svelte'
  import Anchor from '@/components/Anchor.svelte'

  export let data
  const { page } = stores()
  const lang = $page.params.lang

  $pageHeader = goodCompany[lang]

  onMount(() => {
    $pageCode = atob(data.content)
  })

  const projects = projectsData
    .map((companies) => companies.projects)
    .flat()
    .filter(({ visible }) => Boolean(visible))
    .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
</script>

<SEO title={goodCompany[lang]} />

<section>
  <ul>
    {#each projects as client}
      <Hoverable let:hovering={isHovering}>
        <li class:isHovering>
          {#if client.url}
            <Anchor
              id={client.id}
              class="client-link"
              href={client.url}
              rel="external noopener"
              target="_blank"
            >
              {client.name}
              <span>{view[lang]}</span>

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
        </li>
      </Hoverable>
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
