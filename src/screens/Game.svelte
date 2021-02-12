<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { fly, scale } from 'svelte/transition'
    import { elasticOut } from 'svelte/easing'
    import Card from '../components/Card/Card.svelte'

    import { pick_random, sleep, loadImage } from '../utils'

    import type { ICelebrity, ICelebrityDetail } from '../types/data'

    type TSign = -1 | 0 | 1

    export let selection: {
        a: ICelebrity
        b: ICelebrity
    }[]

    const dispatch = createEventDispatcher<{ restart: null }>()

    const loadDetails = async (celeb: ICelebrity) => {
        const res = await fetch(
            `https://cameo-explorer.netlify.app/celebs/${celeb.id}.json`
        )
        const details = await res.json()
        await loadImage(details.image)
        return details
    }

    const promises: Promise<
        [ICelebrityDetail, ICelebrityDetail]
    >[] = selection.map((round) =>
        Promise.all([loadDetails(round.a), loadDetails(round.b)])
    )

    const results = Array<'right' | 'wrong'>(selection.length)
    let i = 0
    let lastResult: 'right' | 'wrong' | null = null
    let done = false
    let ready = true

    async function handleSubmit(
        a: ICelebrityDetail,
        b: ICelebrityDetail,
        sign: TSign
    ) {
        lastResult = Math.sign(a.price - b.price) === sign ? 'right' : 'wrong'
        if (i < selection.length - 1) {
            await sleep(1500)
            results[i] = lastResult
            i += 1
            lastResult = null
        } else {
            await sleep(1500)
            results[i] = lastResult
            lastResult = null
            done = true
        }
    }

    const pickMessage = (p: number) => {
        if (p <= 0.2) return pick_random(['Oof.', 'Better luck next time?'])
        if (p <= 0.5) return pick_random(["I've seen worse", 'Keep trying!'])
        if (p <= 0.8)
            return pick_random(['Yeah!', 'Not bad. Practice makes perfect'])
        if (p < 1) return pick_random(['Impressive.'])
        return pick_random(['Flawless victory', 'Top marks'])
    }

    $: score = results.filter((x) => x === 'right').length
</script>

<header>
    <p>
        Tap on the more monetisable celebrity's face, or tap 'same price' if
        society values them equally.
    </p>
</header>

<div class="game-container">
    {#if done}
        <div
            class="done"
            in:scale={{ delay: 200, duration: 800, easing: elasticOut }}
        >
            <strong>{score} point{score > 1 ? 's' : ''}</strong>
        </div>
        <p>{pickMessage(score / results.length)}</p>
        <button on:click={() => dispatch('restart')}>Back to main screen</button
        >
    {:else if ready}
        {#await promises[i] then [a, b]}
            <div
                class="game"
                in:fly={{ duration: 200, y: 20 }}
                out:fly={{ duration: 200, y: -20 }}
                on:outrostart={() => (ready = false)}
                on:outroend={() => (ready = true)}
            >
                <div>
                    <Card
                        showPrice={!!lastResult}
                        winner={a.price >= b.price}
                        celeb={a}
                        on:select={() => handleSubmit(a, b, 1)}
                    />
                </div>
                <div>
                    <button class="same" on:click={() => handleSubmit(a, b, 0)}>
                        Same price
                    </button>
                </div>
                <div>
                    <Card
                        showPrice={!!lastResult}
                        winner={b.price >= a.price}
                        celeb={b}
                        on:select={() => handleSubmit(a, b, -1)}
                    />
                </div>
            </div>
        {:catch}
            <p class="error">Opps! Failed to load data.</p>
        {/await}
    {/if}
</div>

{#if lastResult}
    <img
        class="giant-result"
        in:fly={{ x: 100, duration: 200 }}
        alt={lastResult}
        src="/icons/{lastResult}.svg"
    />
{/if}

<div
    class="results"
    style="grid-template-columns: repeat({results.length}, 1fr)"
>
    {#each results as result}
        <span class="result">
            {#if result}
                <img alt={result} src="/icons/{result}.svg" />
            {/if}
        </span>
    {/each}
</div>

<style>
    .game-container {
        flex: 1;
    }

    .error {
        color: red;
    }

    .game {
        display: grid;
        grid-template-rows: 1fr 2em 1fr;
        grid-gap: 0.5em;
        width: 100%;
        max-width: min(100%, 40vh);
        height: 100%;
        margin: 0 auto;
    }

    .game > div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media (min-width: 640px) {
        .game {
            max-width: 100%;
            grid-template-rows: none;
            grid-template-columns: 1fr 8em 1fr;
        }

        .same {
            height: 8em;
        }
    }

    .giant-result {
        position: fixed;
        width: 50vmin;
        height: 50vmin;
        left: calc(50vw - 25vmin);
        top: calc(50vh - 25vmin);
        opacity: 0.5;
    }

    .results {
        display: grid;
        grid-gap: 0.2em;
        width: 100%;
        max-width: 320px;
        margin: 1em auto 0 auto;
    }
    .result {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        padding: 0 0 100% 0;
        transition: background 0.2s;
        transition-delay: 0.2s;
    }
    .result img {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    .done {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .done strong {
        font-size: 6em;
        font-weight: 700;
    }
</style>
