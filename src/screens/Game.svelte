<script lang="ts">
    import type { ICelebrity, ICelebrityDetail } from '../types/data'

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
</script>

<header>
    <p>
        Tap on the more monetisable celebrity's face, or tap 'same price' if
        society values them equally.
    </p>
</header>

<div class="game-container">
    {#await promises[i] then [a, b]}
        {console.log(a)}
        <div class="game">
            <div class="card-container">
                {a.name}
            </div>
            <div>
                <button class="same"> Same price </button>
            </div>
            <div class="card-container">
                {b.name}
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
</style>
