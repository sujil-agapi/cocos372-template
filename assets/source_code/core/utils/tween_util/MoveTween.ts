import { _decorator, Component, Tween, Node, Vec3, tween, Enum } from "cc";
import { EasingType, EasingTypeOptions, getEasingFunction } from "./EasingType";

const { ccclass, property } = _decorator;

enum PositionSourceType {
    Coordinates = 0,
    Node = 1,
}

@ccclass("MoveTween")
export class MoveTween extends Component {
    @property({
        type: EasingTypeOptions,
        tooltip: "The easing function type for the animation.",
    })
    public easingType: EasingType = EasingType.Linear;

    @property({
        type: Enum(PositionSourceType),
        tooltip: "Choose between specifying positions or selecting nodes for start/end positions.",
    })
    positionSource: PositionSourceType = PositionSourceType.Coordinates;

    // Vec3 positions are visible only if positionSource is Coordinates
    @property({
        visible: function () {
            return this.positionSource === PositionSourceType.Coordinates;
        },
    })
    public startPosition: Vec3 = new Vec3(0, 0, 0);

    @property({
        visible: function () {
            return this.positionSource === PositionSourceType.Coordinates;
        },
    })
    public endPosition: Vec3 = new Vec3(0, 0, 0);

    // Node references are visible only if positionSource is Node
    @property({
        type: Node,
        visible: function () {
            return this.positionSource === PositionSourceType.Node;
        },
    })
    public startNode: Node | null = null;

    @property({
        type: Node,
        visible: function () {
            return this.positionSource === PositionSourceType.Node;
        },
    })
    public endNode: Node | null = null;

    @property
    public duration: number = 1;

    @property
    public loop: boolean = false;

    @property
    public delay: number = 0.1;

    @property
    public playOnStart: boolean = true;

    private currentTween: Tween<Node> | null = null;

    protected start(): void {
        if (this.playOnStart) {
            this.play();
        }
    }

    play(callback?: Function): void {
        let start = this.positionSource === PositionSourceType.Coordinates
                    ? this.startPosition
                    : this.startNode?.position ?? new Vec3(0, 0, 0);
        let end = this.positionSource === PositionSourceType.Coordinates
                  ? this.endPosition
                  : this.endNode?.position ?? new Vec3(0, 0, 0);

        let easingFunction = getEasingFunction(this.easingType);

        this.currentTween?.stop();
        let positionSequence = tween(this.node).sequence(
            tween().to(this.duration, { position: start }, { easing: easingFunction }),
            tween().to(this.duration, { position: end }, { easing: easingFunction })
        );

        if (this.loop) {
            this.currentTween = new Tween<Node>(this.node)
                .then(positionSequence)
                .repeatForever();
        } else {
            this.currentTween = new Tween<Node>(this.node)
                .then(positionSequence)
                .call(() => {
                    if (callback && typeof callback === "function") {
                        callback();
                    }
                });
        }

        this.currentTween.start();
    }

    stop(): void {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }
}
