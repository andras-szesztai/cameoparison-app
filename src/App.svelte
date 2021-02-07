<script lang="ts">
  import Welcome from "./screens/Welcome.svelte"

  import type { TState } from "./types/state"

  let state: TState = "welcome"
</script>

<main>
  {#if state === "welcome"}
    <Welcome />
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
