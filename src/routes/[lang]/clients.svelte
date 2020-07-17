<script>
  import { _ } from 'svelte-i18n'
  import data from '@/assets/data/clients.json'
  import Hoverable from '@/components/Hoverable.svelte'

  const clients = data
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
            <a href="{client.url}" rel="external noopener" target="_blank">
              {client.name}
              <span>{$_('view')}</span>

              {#if isHovering}
                <div class="stack">
                  <p>{client.stack}</p>
                </div>
              {/if}

            </a>
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

  a,
  li {
    position: relative;
  }

  a > span {
    position: absolute;
    top: 0.4em;
    left: 100%;
    z-index: 2;
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
