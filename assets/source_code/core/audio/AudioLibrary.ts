import { _decorator, AudioClip, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioClipEntry')
export class AudioClipEntry  {
    @property
    key: string = '';

    @property(AudioClip)
    clip: AudioClip = null;
}

@ccclass('AudioLibrary')
export class AudioLibrary extends Component {
    @property([AudioClipEntry])
    private backgroundMusic: AudioClipEntry[] = [];

    @property([AudioClipEntry])
    private soundEffects: AudioClipEntry[] = [];

    getBGClipByKey(key: string): AudioClip | null {
        const entry = this.backgroundMusic.find(clip => clip.key === key);
        return entry ? entry.clip : null;
    }

    getSFXClipByKey(key: string): AudioClip | null {
        const entry = this.soundEffects.find(clip => clip.key === key);
        return entry ? entry.clip : null;
    }
}

