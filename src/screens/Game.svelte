<script lang="ts">
    import Card from '../components/Card/Card.svelte'

    import type { ICelebrity, ICelebrityDetail } from '../types/data'

    type TSign = -1 | 0 | 1

    export let selection: {
        a: ICelebrity
        b: ICelebrity
    }[]

    const load_details = async (celeb: ICelebrity) => {
        const res = await fetch(
            `https://cameo-explorer.netlify.app/celebs/${celeb.id}.json`
        )
        return await res.json()
    }

    const promises: Promise<
        [ICelebrityDetail, ICelebrityDetail]
    >[] = selection.map((round) =>
        Promise.all([load_details(round.a), load_details(round.b)])
    )

    let i = 0

    function handleSubmit(
        a: ICelebrityDetail,
        b: ICelebrityDetail,
        sign: TSign
    ) {
        const result = Math.sign(a.price - b.price) === sign ? 'right' : 'wrong'
        if (i < selection.length - 1) {
            i += 1
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

<div class="results">
    <p>Results will go here</p>
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
</style>
