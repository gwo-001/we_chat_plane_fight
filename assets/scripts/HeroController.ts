import {_decorator, Component, director, EventTouch, instantiate, Node, NodeEventType, Prefab, Sprite} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('HeroController')
export class HeroController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null;

    start() {
        // 让飞机跟随拖动的位置
        this.node.on(NodeEventType.TOUCH_MOVE, (event: EventTouch) => {
            // 这里获取到的是世界坐标。要转为相对坐标
            this.node.setPosition(event.getLocationX()-240, event.getLocationY()-426);
        })
        // 没间隔0.5秒创建一个子弹
        this.schedule(()=>{
            console.log("创建子弹中……")
            let bulletIns = instantiate(this.bulletPrefab);
            bulletIns.setParent(director.getScene().getChildByName("Canvas"));
            let playerPosition = this.node.getPosition();
            bulletIns.setPosition(playerPosition.x, playerPosition.y+60);
        },0.5)
    }

    update(deltaTime: number) {

    }
}


