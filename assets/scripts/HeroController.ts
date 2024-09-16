import {_decorator, Component, director, EventTouch, instantiate, Node, NodeEventType, Prefab, Sprite} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('HeroController')
export class HeroController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null;

    start() {
        this.node.on(NodeEventType.TOUCH_MOVE, (event: EventTouch) => {
            this.node.setPosition(event.getLocationX(), event.getLocationY());
        })
        // this.node.on(NodeEventType.MOUSE_MOVE,(event:EventTouch)=>{
        //     this.node.setPosition(event.getLocationX(), event.getLocationY())
        // })
        this.schedule(()=>{
            let bulletIns = instantiate(this.bulletPrefab);
            bulletIns.setParent(director.getScene());
            bulletIns.setPosition(this.node.getPosition())
        },0.5)
    }

    update(deltaTime: number) {
        // 每一帧都监听一下触摸的移动

    }
}


