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

export interface ICelebrityDetail {
    categories: TCategories[]
    description: string
    id: string
    image: string
    name: string
    price: number
    rating: number
    reviews: number
    similar: ICelebrity[]
    length: number
    type: string
}
