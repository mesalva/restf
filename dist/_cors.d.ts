/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
export default function _cors(hostsStr: any, allowHeaders: any): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>, next: NextFunction) => void | Response<any>;
