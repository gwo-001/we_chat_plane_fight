import {
    _decorator,
    BoxCollider2D, Collider2D,
    Component, Contact2DType,
    director,
    EventTouch,
    instantiate,
    NodeEventType,
    Prefab, resources, Sprite, SpriteFrame,
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('HeroController')
export class HeroController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null;

    private isHeroAlive: boolean = true;

    start() {
        // 让飞机跟随拖动的位置
        this.node.on(NodeEventType.TOUCH_MOVE, (event: EventTouch) => {
            // 这里获取到的是世界坐标。要转为相对坐标
            this.node.setPosition(event.getLocationX() - 240, event.getLocationY() - 426);
        })
        // 没间隔0.5秒创建一个子弹
        this.schedule(() => {
            // 如果玩家已经死亡，那么就不要创建子弹了
            if (!this.isHeroAlive) {
                return;
            }
            let bulletIns = instantiate(this.bulletPrefab);
            bulletIns.setParent(director.getScene().getChildByName("Canvas"));
            let playerPosition = this.node.getPosition();
            bulletIns.setPosition(playerPosition.x, playerPosition.y + 100);
        }, 0.5)
        // 开启碰撞检测
        let boxCollider2D = this.getComponent(BoxCollider2D);
        boxCollider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    update(deltaTime: number) {

    }

    private onBeginContact(slef: Collider2D, other: Collider2D) {
        console.log("玩家进入碰撞:"+other.tag)
        if (other.tag === 0) {
            this.isHeroAlive = false;
            this.bulletPrefab.destroy();
            resources.load("hero1_die/SpriteFrame", SpriteFrame, (err, sp) => {
                this.node.getComponent(Sprite).spriteFrame = sp;
            });
            this.scheduleOnce(() => {
                slef.destroy()
            }, 1)
        }
    }
}


