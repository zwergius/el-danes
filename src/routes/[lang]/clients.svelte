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
  import { _ } from 'svelte-i18n'
  import { pageCode, pageHeader } from '@/stores.js'
  import projectsData from '@/assets/data/projects.json'
  import SEO from '@/components/SEO.svelte'
  import Hoverable from '@/components/Hoverable.svelte'
  import Anchor from '@/components/Anchor.svelte'

  export let data

  $pageHeader = $_('clients.header')

  onMount(() => {
    $pageCode = atob(data.content)
  })

  const projects = projectsData
    .filter(({ visible }) => Boolean(visible))
    .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
</script>

<SEO title="{$_('clients')}" />

<section>
  <ul>
    {#each projects as client}
      <Hoverable let:hovering="{isHovering}">
        <li class:isHovering>

          {#if client.url}
            <Anchor
              id="{client.id}"
              class="client-link"
              href="{client.url}"
              rel="external noopener"
              target="_blank">
              {client.name}
              <span>{$_('view')}</span>

              {#if isHovering}
                <div class="stack">
                  <p>{client.type} - {client.stack}</p>
                </div>
              {/if}

            </Anchor>
          {:else}
            <p>{client.name}</p>

            {#if isHovering}
              <div class="stack">
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
    background: rgb(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
</style>
