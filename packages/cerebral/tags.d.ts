import { IPath } from "function-tree";

export function props(path: TemplateStringsArray, ...values: any[]): IPath
export function signal(path: TemplateStringsArray, ...values: any[]): IPath
export function state(path: TemplateStringsArray, ...values: any[]): IPath
export function string(path: TemplateStringsArray, ...values: any[]): IPath