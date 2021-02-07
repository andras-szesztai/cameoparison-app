<script lang="ts">
  import { onMount } from "svelte"
  import Welcome from "./screens/Welcome.svelte"

  import { select } from "./select"

  import type { ICelebrity } from "./types/data"
  import type { TState } from "./types/state"

  let state: TState = "welcome"
  let selection: any

  let celebs_promise: Promise<{
    celebs: ICelebrity[]
    lookup: Map<string, ICelebrity>
  }>

  onMount(() => {
    celebs_promise = load_celebs()
  })

  const start = async (e: CustomEvent<{ slug: string }>) => {
    const { celebs, lookup } = await celebs_promise
    selection = select(celebs, lookup, e.detail.slug)
    state = "playing"
  }

  const load_celebs = async () => {
    const res = await fetch("https://cameo-explorer.netlify.app/celebs.json")
    const data: ICelebrity[] = await res.json()
    const lookup: Map<string, ICelebrity> = new Map()
    data.forEach((d) => {
      lookup.set(d.id, d)
    })
    const subset: Set<ICelebrity> = new Set()
    data.forEach((d) => {
      if (d.reviews >= 50) {
        subset.add(d)
        d.similar.forEach((id) => {
          const similarCeleb = lookup.get(id)
          if (similarCeleb) {
            subset.add(similarCeleb)
          }
        })
      }
    })
    return {
      celebs: Array.from(subset),
      lookup,
    }
  }
</script>

<main>
  {#if state === "welcome"}
    <Welcome on:select={start} />
  {:else if state === "playing"}
    <p>Game screen</p>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
