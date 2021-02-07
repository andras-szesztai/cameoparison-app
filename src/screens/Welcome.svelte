<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    import Button from '../components/Button/Button.svelte'
    import type { TCategories } from '../types/data'

    import { categories } from './../constants/categories'

    const dispatch = createEventDispatcher<{ select: { slug: TCategories } }>()

    let selected = false

    const handleSelect = (slug: TCategories) => {
        selected = true
        dispatch('select', { slug })
    }
</script>

<header>
    <h1>
        CameoP<span class="logo">a</span>rison
    </h1>
    <p>
        On <a href="https://cameo.com">cameo.com</a>, you can buy personalised
        video clips from everyone from Lindsay Lohan to Ice T.
    </p>
    <p>But who commands the highest price?</p>
    <p>Pick a category to play a game:</p>
    <div class="categories">
        {#each categories as { label, slug }}
            <Button {label} {selected} on:click={() => handleSelect(slug)} />
        {/each}
    </div>
</header>

<style>
    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: min(12vw, 4em);
        font-weight: 100;
        margin: 0 0 0.5em 0;
    }

    p {
        max-width: 24em;
        margin: 0 auto 1em auto;
    }

    .logo {
        display: inline-block;
        background: url(/icons/compare.svg) 50% 50% no-repeat;
        background-size: 100% 100%;
        width: 0.8em;
        top: 0.05em;
        transform: scale(1.4);
        left: 0.02em;
        text-indent: -9999px;
    }
</style>
