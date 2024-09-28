import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static instance: DataManager;


    // 确保 GameManager 是一个单例
    public static getInstance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    }

    private _kill = 0;
    private _die = 0;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public addKill() {
        this._kill += 1;
    }

    public addDie() {
        this._die += 1;
    }

    get die(): number {
        return this._die;
    }
    get kill(): number {
        return this._kill;
    }


}


