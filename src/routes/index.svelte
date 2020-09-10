<script context="module">
  // This file is needed otherwise service-worker-index.html won't be added to build'
  export async function preload(page, { language }) {
    return this.redirect(303, language)
  }
</script>
