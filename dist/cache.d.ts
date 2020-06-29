export interface ICache {
    get(path: string, fetcher: Function): Promise<any>;
    set(path: string, content: any): Promise<any>;
    use(path: string, fetcher: Function): Promise<any>;
    clear(path: string, forceHardDelete?: boolean): Promise<boolean>;
    clearAll(): Promise<any>;
}
export default class Cache implements ICache {
    private redis;
    constructor(redis?: any);
    use(fullPath: any, fetcher: any): Promise<any>;
    get(fullPath: any, fetcher: any): Promise<any>;
    set(path: any, content: any): Promise<{
        content: any;
        expires: number;
    }>;
    clear(path: any, forceHardDelete?: boolean): Promise<boolean>;
    clearAll(): Promise<any>;
    private getCache;
    private getFromFetcherSavingAsynchronously;
    private getCacheSavingIfNeeded;
    private runFetcherThenSave;
    private sendContent;
    private softDelete;
    private hardDelete;
}
