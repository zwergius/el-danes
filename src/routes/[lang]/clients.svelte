<script context="module">
  export async function preload() {
    const url =
      process.env.NODE_ENV === 'development'
        ? '/mock.json'
        : 'https://api.github.com/repos/zwergius/el-danes/contents/src/routes/%5Blang%5D/clients.svelte'
    const res = await this.fetch(url, {
      'User-Agent': 'zwergius',
    })
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    this.error(404, 'Not found')
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import { pageCode } from '@/stores.js'
  import clientsData from '@/assets/data/clients.json'
  import Hoverable from '@/components/Hoverable.svelte'
  import Anchor from '@/components/Anchor.svelte'

  export let data
  $pageCode = atob(data.content)

  const clients = clientsData
    .map((job) => job.projects)
    .flat()
    .filter(({ visible }) => visible)
</script>

<section>
  <ul>
    {#each clients as client}
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
                  <p>{client.stack}</p>
                </div>
              {/if}

            </Anchor>
          {:else}
            <p>{client.name}</p>

            {#if isHovering}
              <div class="stack">
                <p>{client.stack}</p>
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
