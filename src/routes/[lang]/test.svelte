<script context="module">
  export async function preload(page, session) {
    const dotUrl =
      'https://api.github.com/repos/zwergius/dotfiles/contents/makesymlinks.sh'
    const url =
      'https://api.github.com/repos/zwergius/el-danes/contents/src/routes/[lang]/index.svelte'
    const res = await this.fetch(url, {
      'User-Agent': 'zwergius',
    })
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    // this.error(404, 'Not found')
  }
</script>

<script>
  import Code from '@/components/Code.svelte'
  export let data
  const code = atob(data.content)
  console.log('code: ', code)
</script>

<Code data="{code}" />
