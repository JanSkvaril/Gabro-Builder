export type Build = Component[]
export interface Component {
    name: string,
    id: number,
    props: Prop[],
    children: Build | null | undefined
}

export interface Prop {
    name: string,
    type: string,
    val?: string,
}

