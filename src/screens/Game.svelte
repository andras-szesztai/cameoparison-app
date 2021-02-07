<script lang="ts">
    import Card from '../components/Card/Card.svelte'

    import { sleep } from '../utils'

    import type { ICelebrity, ICelebrityDetail } from '../types/data'

    type TSign = -1 | 0 | 1

    export let selection: {
        a: ICelebrity
        b: ICelebrity
    }[]

    const loadDetails = async (celeb: ICelebrity) => {
        const res = await fetch(
            `https://cameo-explorer.netlify.app/celebs/${celeb.id}.json`
        )
        return await res.json()
    }

    const promises: Promise<
        [ICelebrityDetail, ICelebrityDetail]
    >[] = selection.map((round) =>
        Promise.all([loadDetails(round.a), loadDetails(round.b)])
    )

    const results = Array<'right' | 'wrong'>(selection.length)
    let i = 0
    let lastResult: 'right' | 'wrong' | null = null

    async function handleSubmit(
        a: ICelebrityDetail,
        b: ICelebrityDetail,
        sign: TSign
    ) {
        lastResult = Math.sign(a.price - b.price) === sign ? 'right' : 'wrong'
        if (i < selection.length - 1) {
            i += 1
            await sleep(1500)
            results[i - 1] = lastResult
            lastResult = null
        } else {
            // End the game
        }
    }
</script>

<header>
    <p>
        Tap on the more monetisable celebrity's face, or tap 'same price' if
        society values them equally.
    </p>
</header>

<div class="game-container">
    {#await promises[i] then [a, b]}
        <div class="game">
            <div>
                <Card celeb={a} on:select={() => handleSubmit(a, b, 1)} />
            </div>
            <div>
                <button class="same" on:click={() => handleSubmit(a, b, 0)}>
                    Same price
                </button>
            </div>
            <div>
                <Card celeb={b} on:select={() => handleSubmit(a, b, -1)} />
            </div>
        </div>
    {:catch}
        <p class="error">Opps! Failed to load data.</p>
    {/await}
</div>

{#if lastResult}
    <img class="giant-result" alt={lastResult} src="/icons/{lastResult}.svg" />
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
</style>
