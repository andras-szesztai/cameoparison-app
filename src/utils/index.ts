import type { ICelebrity, TCategories } from '../types/data'

export function pick_random(array: ICelebrity[] | string[]) {
    const index = Math.floor(array.length * Math.random())
    return array[index]
}

const ROUNDS_PER_GAME = 10

function remove(array: ICelebrity[], index: number) {
    // if a 'similar' account was picked, there's no
    // guarantee that it's in the filtered array
    if (index === -1) return

    // this is much faster than splicing the array
    array[index] = array[array.length - 1]
    array.pop()
}

export function select(
    celebs: ICelebrity[],
    lookup: Map<string, ICelebrity>,
    category: TCategories
) {
    const filtered = celebs.filter((c) => {
        return c.categories.includes(category)
    })

    const seen = new Set()
    const selection = []

    let i = ROUNDS_PER_GAME
    while (i--) {
        const n = Math.random()
        const ai = Math.floor(n * filtered.length)
        const a = filtered[ai]

        // remove a from the array so this person can't be picked again
        remove(filtered, ai)

        let b: ICelebrity

        // if this celeb has 'similar' celebs, decide whether to pick one
        const similar = a.similar.filter((id) => !seen.has(id))
        if (similar.length > 0 && Math.random() < 0.75) {
            const id = pick_random(similar)
            if (typeof id == 'string') {
                const bCelebrity = lookup.get(id)
                if (bCelebrity) {
                    b = bCelebrity
                } else {
                    b = a
                }
            } else {
                b = a
            }
        }

        // otherwise pick someone at random
        else {
            const bCelebrity = pick_random(filtered)
            if (typeof bCelebrity != 'string') {
                b = bCelebrity
            } else {
                b = a
            }
        }

        selection.push({ a, b })

        seen.add(a.id)
        if (b && typeof b !== 'string' && 'id' in b) {
            seen.add(b.id)
        }

        // remove b from the array so this person can't be picked again
        if (b && typeof b !== 'string') {
            remove(filtered, filtered.indexOf(b))
        }
    }

    return selection
}

export const sleep = (ms: number) => {
    return new Promise((fulfil) => {
        setTimeout(fulfil, ms)
    })
}
