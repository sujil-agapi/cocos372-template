import { _decorator, Slider, Button, Sprite } from "cc";
import { AudioConst } from "../../../../core/audio/AudioConst";
import { AudioManager } from "../../../../core/audio/AudioManager";
import { IAudioManager } from "../../../../core/audio/IAudioManager";
import { GameStateManager } from "../../../../core/gamestate/GameStateManager";
import { GameState } from "../../../../core/gamestate/GameStates";
import { IGameStateManager } from "../../../../core/gamestate/IGameStateManager";
import { InterfaceManager } from "../../../../core/interfaces/InterfaceManager";
import { IPlayerDataManager } from "../../../../core/playerdata/IPlayerDataManager";
import { PlayerDataManager } from "../../../../core/playerdata/PlayerDataManager";
import { BaseScreen } from "../../../../core/ui/base/BaseScreen";

const { ccclass, property } = _decorator;

@ccclass('SettingsScreen')
export class SettingsScreen extends BaseScreen {

    @property(Slider)
    private musicSlider: Slider = null;
    @property(Sprite)
    private musicSliderFiller : Sprite = null;

    @property(Slider)
    private sfxSlider: Slider = null;

    @property(Sprite)
    private sfxSliderFiller : Sprite = null;

    @property(Button)
    private closeBtn: Button = null;

    private audioManager: IAudioManager;
    private playerDataManager: IPlayerDataManager;
    private gameStateManager: IGameStateManager;

    private localSFXVolume: number;
    private localMusicVolume: number;

    protected onShow(): void {
        super.onShow();

        this.audioManager = InterfaceManager.Instance.getInterface(AudioManager);
        this.playerDataManager = InterfaceManager.Instance.getInterface(PlayerDataManager);
        this.gameStateManager = InterfaceManager.Instance.getInterface(GameStateManager);

        const audioPref = this.playerDataManager.getAudioPref();
        this.updateSfxSliders (audioPref.sfxVolume);
        this.updateMusicSliders(audioPref.musicVolume);

        this.sfxSlider.node.on('slide', this.onSFXValueChanged, this);
        this.musicSlider.node.on('slide', this.onMusicSliderValueChanged, this);
        this.closeBtn.node.on(Button.EventType.CLICK, this.onCloseBtnClick, this);
    }

    protected onHide(): void {
        super.onHide();
        if (this.playerDataManager) {
            this.playerDataManager.updateAudioPreference(this.localMusicVolume, this.localSFXVolume);
        }

        this.sfxSlider.node.off('slide', this.onSFXValueChanged, this);
        this.musicSlider.node.off('slide', this.onMusicSliderValueChanged, this);
        this.closeBtn.node.off(Button.EventType.CLICK, this.onCloseBtnClick, this);
    }

    private onSFXValueChanged(slider: Slider): void {
        this.updateSfxSliders ( slider.progress);
    }

    private onMusicSliderValueChanged(slider: Slider): void {
    this.updateMusicSliders (slider.progress);
    }

    private updateMusicSliders (progress : number) : void {
        this.audioManager.updateMusicVolume(progress);
        this.musicSliderFiller.fillRange = progress;
        this.localMusicVolume = progress;
        this.musicSlider.progress = progress;
    }

    private updateSfxSliders (progress : number) : void {
        this.audioManager.updateSFXVolume(progress);
        this.sfxSliderFiller.fillRange = progress;
        this.localSFXVolume = progress;
        this.sfxSlider.progress = progress;
    }

    private onCloseBtnClick(): void {
        this.audioManager.playSFX(AudioConst.ButtonClick);
        this.gameStateManager.forceChangeGameState(GameState.Home);
    }
}