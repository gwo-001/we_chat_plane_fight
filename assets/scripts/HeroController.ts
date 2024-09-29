import {
    _decorator,
    BoxCollider2D,
    Collider2D,
    Color,
    Component,
    Contact2DType,
    director,
    EventTouch,
    instantiate,
    Node,
    NodeEventType,
    Prefab,
    resources,
    Sprite,
    SpriteFrame,
    tween,
    Tween,
    UITransform,
    Vec3,
} from 'cc';
import {DataManager} from "db://assets/scripts/common/DataManager";
import {EventTypeEnum} from "db://assets/scripts/constants/EventTypeEnum";
import {HeroStatusEnum} from "db://assets/scripts/constants/HeroStatusEnum";

const {ccclass, property} = _decorator;
const eventTarget = new EventTarget();

@ccclass('HeroController')
export class HeroController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null;
    @property(Node)
    restartBtn: Node = null;  // 引用复活按钮


    /**
     * 玩家状态机
     * @private
     */
    private heroStatus: HeroStatusEnum = null;
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
    // 控制玩家闪烁的缓动
    private heroShineTween: Tween<Sprite> | null = null;

    start() {
        // 将玩家状态置为普通状态
        this.heroStatus = HeroStatusEnum.NORMAL;
        // 让飞机跟随拖动的位置
        this.heroFollowTouchMove();
        // 玩家的射击逻辑
        this.heroShot();
        // 监听碰撞检测
        this.getComponent(BoxCollider2D)?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // 监听玩家复活消息
        director.on(EventTypeEnum.HERO_REVIVE, this.reviveHero, this);
    }

    update(deltaTime: number) {
        // if (!this.isInvincible && this.isHeroAlive) {
        //     this.heroNormalStatus();
        // }
    }

    /**
     * 当玩家发生碰撞
     * @param slef 碰撞自身
     * @param other 碰撞的对象
     * @private
     */
    private onBeginContact(self: Collider2D, other: Collider2D) {
        if (other.tag === 0) {
            // 玩家死亡数+1
            DataManager.getInstance().addDie()
            // 将玩家死亡的位置记录下来
            this.playerDiePosition = this.node.getPosition()
            this.heroStatus = HeroStatusEnum.DIE;
            resources.load("hero1_die/spriteFrame", SpriteFrame, (err, sp) => {
                this.getComponent(Sprite).spriteFrame = sp;
            });
            // 将玩家的状态保存下来
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.active = false;
                }
            }, 1)
            // 玩家死亡消息
            director.emit(EventTypeEnum.HERO_DIE);
        }
    }

    public getHeroAlive(): boolean {
        return this.heroStatus !== HeroStatusEnum.DIE;
    }

    // 复活玩家
    private reviveHero(): void {
        this.heroStatus = HeroStatusEnum.INVINCIBLE;
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
        // 将玩家的无敌位置为true
        collider2D.enabled = false;
        this.heroShine();
        this.scheduleOnce(() => {
            collider2D.enabled = true;
            this.heroStatus = HeroStatusEnum.NORMAL;
        }, this.invincibleSeconds);
    }

    // 当玩家复活后会有一个闪烁的效果
    private heroShine() {
        let sprite = this.getComponent(Sprite);
        if (!sprite) {
            return;
        }
        this.heroShineTween = tween(sprite);
        console.log("开始闪烁")
        this.heroShineTween.repeat(this.invincibleSeconds,
            tween()
                .to(0.5, {color: new Color(255, 255, 255, 50)})  // 变半透明
                .to(0.5, {color: new Color(255, 255, 255, 255)}) // 变回全透明
        ).call(() => {
            let sprite = this.getComponent(Sprite);
            resources.load("hero1/spriteFrame", SpriteFrame, (err, sp) => {
                sprite.spriteFrame = sp;
                sprite.color = new Color(255, 255, 255);
            })
        }).start()
    }

    // 玩家射击逻辑
    private heroShot() {
        // 没间隔0.5秒创建一个子弹
        this.schedule(() => {
            // 如果玩家已经死亡，那么就不要创建子弹了
            if (!this.node) {
                return;
            }
            if (this.heroStatus === HeroStatusEnum.DIE) {
                return;
            }
            // if (!this.isHeroAlive) {
            //     return;
            // }
            let bulletIns = instantiate(this.bulletPrefab);
            bulletIns.setParent(director.getScene().getChildByName("Canvas"));
            let playerPosition = this.node.getPosition();
            bulletIns.setPosition(playerPosition.x, playerPosition.y + 100);
        }, 0.5)
    }

    // 玩家跟随触摸的位置来变换方向
    private heroFollowTouchMove() {
        this.node.on(NodeEventType.TOUCH_MOVE, (event: EventTouch) => {
            // 这里获取到的是世界坐标。要转为相对坐标
            // 获取触摸点的世界坐标
            const touchPos = event.getUILocation(); // 获取世界坐标，UI场景适用
            // 将世界坐标转换为节点的局部坐标
            const localPos = this.node.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
            this.node.setPosition(localPos.x, localPos.y);
        })
    }
}


