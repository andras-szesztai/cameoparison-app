export type TCategories =
    | 'actors'
    | 'athletes'
    | 'comedians'
    | 'creators'
    | 'models'
    | 'musicians'
    | 'reality-tv'

export interface ICelebrity {
    categories: TCategories[]
    id: string
    name: string
    price: number
    rating: number
    reviews: number
    similar: string[]
}
