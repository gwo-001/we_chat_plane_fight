import {
    _decorator,
    BoxCollider2D, Collider2D,
    Component, Contact2DType,
    director,
    EventTouch,
    instantiate,
    NodeEventType,
    Prefab, resources, Sprite, SpriteFrame, UITransform, Vec3,
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
            // 获取触摸点的世界坐标
            const touchPos = event.getUILocation(); // 获取世界坐标，UI场景适用
            // 将世界坐标转换为节点的局部坐标
            const localPos = this.node.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
            this.node.setPosition(localPos.x, localPos.y);
        })
        // 没间隔0.5秒创建一个子弹
        this.schedule(() => {
            // 如果玩家已经死亡，那么就不要创建子弹了
            if (!this.node) {
                return;
            }
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

    /**
     * 当玩家发生碰撞
     * @param slef 碰撞自身
     * @param other 碰撞的对象
     * @private
     */
    private onBeginContact(slef: Collider2D, other: Collider2D) {
        if (other.tag === 0) {
            this.isHeroAlive = false;
            this.bulletPrefab.destroy();
            resources.load("hero1_die/spriteFrame", SpriteFrame, (err, sp) => {
                console.log("加载玩家死亡")
                this.getComponent(Sprite).spriteFrame = sp;
            });
            /**
             * 妖后玩家存回
             */
            this.scheduleOnce(() => {
                this.node.destroy()
            }, 1)
        }
    }

    public getHeroAlive(): boolean {
        return this.isHeroAlive;
    }
}


