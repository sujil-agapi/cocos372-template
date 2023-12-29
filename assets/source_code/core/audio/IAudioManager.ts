import { _decorator, Component, Node } from 'cc';
import { IBase } from '../interfaces/IBase';
const { ccclass, property } = _decorator;
export interface IAudioManager extends IBase {
    playMusic (key : string) : void;
    playSFX (key : string) : void;
    updateSFXVolume (vol : number) : void;
    updateMusicVolume (vol : number) : void;
}

