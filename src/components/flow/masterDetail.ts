interface IMaster {
    id: number
    selected: IDetail
    order: IDetail[]
}

interface IDetail {
    id: number
    name: string
    active: boolean
    dateOfBirth: Date
    order: number
}
