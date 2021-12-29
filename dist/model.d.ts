export default class RestfModel {
    protected options?: string | any;
    _db: any;
    protected route?: string;
    constructor(options?: string | any);
    protected get db(): any;
    protected rawSelect(query: string, params?: any[]): Promise<any>;
    protected rawSelectFirst(query: string, params: any[]): Promise<any>;
    all(): any;
    find(id: number): any;
    findBy(column: string, value: any): any;
    insertGetId(data: any): any;
    create(data: object): any;
    update(data: object, whereClause?: any): any;
    delete(id: number): any;
    static newDefaultData(data: object): {
        createdAt: Date;
    };
}
