<script lang="ts">
  export let selected: boolean
  export let label: string
</script>

<button id="button" disabled={selected} on:click>{label}</button>

<style>
  #button {
    margin: 1rem !important;
    font-family: inherit;
    font-size: inherit;
    background: var(--do-something);
    color: #222;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.5em 1em;
    line-height: 1;
  }

  #button:not(:disabled):hover {
    background-color: var(--do-something-lighter);
  }
</style>
