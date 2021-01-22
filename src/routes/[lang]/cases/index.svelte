<script context="module">
  import { safeParseJSON } from '@/helpers'

  export async function preload(page) {
    const { lang } = page.params
    const res = await this.fetch(`/${lang}/cases.json`)
    if (res.status === 200) {
      const { code, experiences } = await res.json()
      return { code, experiences: safeParseJSON(experiences), lang }
    }
    this.error(404, `/${lang}/cases.json Not found`)
  }
</script>

<script>
  import { pageCode, pageHeader, theme } from '@/stores'
  import { goodCompany, view } from 'assets/translations.yaml'
  import SEO from '@/components/SEO.svelte'
  import Hoverable from '@/components/Hoverable.svelte'
  import Anchor from '@/components/Anchor.svelte'

  export let code, experiences, lang

  $pageHeader = goodCompany[lang]
  $pageCode = code

  const projects = experiences
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
