import { Component } from "cc";
export interface IBootStrapListener{
    isTypeOfBootStrapListener : boolean;
    initialise(): void;
    resolveDependencies(): void;
    terminate(): void;
}