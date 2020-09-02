import { Request, Response, NextFunction } from 'express';
export default function _cors(hostsStr: any, allowHeaders: any): (req: Request, res: Response, next: NextFunction) => void | Response<any>;
