/**
 *
 * @author 
 *
 */
class GameController extends BaseController {

    private gameView: GameView;
    private gameUIView: GameUIView;
    
    public constructor() {
        super();

        //初始化数据
        GameManager.Init();
        
        //初始化UI
        this.gameView = new GameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, this.gameView);
        this.gameUIView = new GameUIView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameUI, this.gameUIView);
        
        this.registerFunc(GameConst.Jump, this.gameView.Jump, this.gameView);
        this.registerFunc(GameConst.Shoot, this.gameView.Shoot, this.gameView);
        this.registerFunc(GameConst.CeateBullet, this.gameView.CreateBullet, this.gameView);
        this.registerFunc(GameConst.RemoveBullet, this.gameView.RemoveBullet, this.gameView);

    }
    
    /**
     * 检查敌人相对英雄位置
     * 1: 英雄在上方 0: 持平 -1: 英雄在下方
     */ 
    public CheckEnemyPosByHero(enemy: Hero): number{
        var hero = this.gameView.GetHero();
        if(hero.y - enemy.y < -10){
            return 1;
        }else if(hero.y - enemy.y > 10){
            return -1;
        }
        return 0;
    }
    
    /**
     * 检测子弹是否击中英雄
     */ 
    public CheckHurt(bullet: Bullet): Boolean{
        var hurt = false;
        var arr: Array<Hero> = []
        if(bullet.side == Side.Own){
            arr = this.gameView.GetEnemies();
        }else{
            arr = [this.gameView.GetHero()];
        }
        for(let i = 0;i < arr.length;i++) {
            
            let hero: Hero = arr[i];
            if(this.hitTest(new egret.Rectangle(bullet.x - ((bullet.scaleX == -1) ? bullet.width : 0),bullet.y,bullet.width,bullet.height),
                new egret.Rectangle(hero.x - ((hero.scaleX == -1) ? hero.width : 0),hero.y,hero.width,hero.height))) {
                hurt = true;
                hero.Hurt(bullet.GetDamage());
            }
        }        
        return hurt;
    }
     
    /**
     * 检测英雄是否超出范围(Y轴)
     */ 
    public CheckHeroOut(hero: Hero): Boolean{
        if(hero.y - hero.anchorOffsetY < this.gameView.min_y){
            hero.y = this.gameView.min_y + hero.anchorOffsetY;
            return true;
        }else if(hero.y - hero.anchorOffsetY + hero.height > this.gameView.max_y){
            hero.y = this.gameView.max_y + hero.anchorOffsetY - hero.height;
            return true;
        }
        return false;
    }
    
    /**
     * 检测是否超出屏幕
     */
    public CheckOutScreen(object: BaseGameObject): Boolean {
        return !this.hitTest(new egret.Rectangle(object.x, object.y, object.width, object.height), 
                            new egret.Rectangle(0, 0, App.StageUtils.getWidth(), App.StageUtils.getHeight()));
    }
    
    /**
     * 碰撞检测
     */ 
    private hitTest(rect1: egret.Rectangle,rect2: egret.Rectangle): boolean {
        return rect1.intersects(rect2);
    }
}