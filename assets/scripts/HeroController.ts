import {
    Node,
    _decorator,
    BoxCollider2D, Collider2D,
    Component, Contact2DType,
    director,
    EventTouch,
    instantiate,
    NodeEventType,
    Prefab, resources, Sprite, SpriteFrame, UITransform, Vec3, tween,
} from 'cc';
import {DataManager} from "db://assets/scripts/common/DataManager";

const {ccclass, property} = _decorator;

@ccclass('HeroController')
export class HeroController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null;
    @property(Node)
    restartBtn: Node = null;  // 引用复活按钮
    @property(Node)
    dataManagerNode: Node = null;


    /**
     * 当玩家死亡时记录玩家的位置
     * @private
     */
    private playerDiePosition: Vec3;
    // 玩家是否处于无敌状态
    private isInvincible = false;
    // 玩家是否存活
    private isHeroAlive: boolean = true;
    // 玩家复活后的无敌时间
    private invincibleSeconds: number = 3;

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
            // 玩家死亡数+1
            if (this.dataManagerNode) {
                let dataScript = this.dataManagerNode.getComponent(DataManager);
                if (dataScript) {
                    dataScript.addDie();
                }
            }
            // 将玩家死亡的位置记录下来
            this.playerDiePosition = this.node.getPosition()
            this.isHeroAlive = false;
            resources.load("hero1_die/spriteFrame", SpriteFrame, (err, sp) => {
                console.log("加载玩家死亡")
                this.getComponent(Sprite).spriteFrame = sp;
            });
            // 将玩家的状态保存下来
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.active = false;
                }
            }, 1)
            // 将重新开始游戏的按钮拖到中间来,移动到屏幕中央，带有缓动效果
            const targetPosition = new Vec3(0, 0, 0);

            tween(this.restartBtn)
                .to(2, {position: targetPosition}, {easing: 'cubicOut'})
                .start();
        }
    }

    public getHeroAlive(): boolean {
        return this.isHeroAlive;
    }

    // 复活玩家
    public reviveHero(): void {
        this.isHeroAlive = true;
        this.node.active = true;
        this.node.setPosition(this.playerDiePosition);
        // 将玩家的图标换成
        resources.load("hero1/spriteFrame", SpriteFrame, (err, sp) => {
            this.getComponent(Sprite).spriteFrame = sp;
        })
        // 给玩家设置一个无敌时间
        let collider2D = this.node.getComponent(Collider2D);
        if (!collider2D) {
            return;
        }
        collider2D.enabled = false;
        this.scheduleOnce(() => {
            this.isInvincible = false;
            collider2D.enabled = true;
        }, this.invincibleSeconds);
    }
}


