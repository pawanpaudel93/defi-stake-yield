export type Token = {
    image: string
    address: string
    name: string
}

export interface networkMap {
    [key: string]: {
        [key: string]: Array<string>
    }
}