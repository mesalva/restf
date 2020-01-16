import RestfController from './controller';
export default class RestfSerializer {
    controller?: RestfController;
    constructor(controller?: any);
    set(obj: any): void;
    get(path: any): any;
    static use(method: any): any;
    static staticfy(...methods: string[]): void;
}
