/**
 * Makes a sum type out of given partial type, in which at least one field is required.
 */
export type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> & { [K in Keys]: Required<Pick<T, K>> }[Keys];