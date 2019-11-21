export default class BaseModel {
    db: any;
    constructor(table: string);
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
