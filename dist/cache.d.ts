export interface ICache {
    get(path: string, fetcher: Function): Promise<any>;
    set(path: string, content: any): Promise<any>;
    use(path: string, fetcher: Function): Promise<any>;
    clear(path: string, forceHardDelete?: boolean): Promise<boolean>;
    clearAll(): Promise<any>;
}
export default class Cache implements ICache {
    private readonly redis;
    constructor(redis?: any);
    use(path: any, fetcher: any): Promise<any>;
    get(path: any): Promise<any>;
    set(path: any, content: any): Promise<any>;
    clear(path: any): Promise<boolean>;
    clearAll(): Promise<any>;
    private getCache;
    private runFetcherThenSave;
}
