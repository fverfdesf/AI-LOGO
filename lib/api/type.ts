export type ResponseData<T> = {
    code: number,
    message: string,
    data: T | null
}