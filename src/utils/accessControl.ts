import { Request } from "express";

export const hasEditOrOwnerAccess = (req: Request): boolean => {
    return req.accessLevel === 'edit' || req.accessLevel === 'owner';
};

export const hasOwnerAccess = (req: Request): boolean => {
    return req.accessLevel === 'owner';
};

export const hasReadAccess = (req: Request): boolean => {
    return req.accessLevel === 'read' || req.accessLevel === 'edit' || req.accessLevel === 'owner';
};