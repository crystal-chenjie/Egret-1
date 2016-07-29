/**
 *
 * @author
 *
 */
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        _super.call(this);
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
    var d = __define,c=GameController,p=c.prototype;
    /**
     * 检查敌人相对英雄位置
     * 1: 英雄在上方 0: 持平 -1: 英雄在下方
     */
    p.CheckEnemyPosByHero = function (enemy) {
        var hero = this.gameView.GetHero();
        if (hero.y - enemy.y < -10) {
            return 1;
        }
        else if (hero.y - enemy.y > 10) {
            return -1;
        }
        return 0;
    };
    /**
     * 检测子弹是否击中英雄
     */
    p.CheckHurt = function (bullet) {
        var hurt = false;
        var arr = [];
        if (bullet.side == Side.Own) {
            arr = this.gameView.GetEnemies();
        }
        else {
            arr = [this.gameView.GetHero()];
        }
        for (var i = 0; i < arr.length; i++) {
            var hero = arr[i];
            if (this.hitTest(new egret.Rectangle(bullet.x - ((bullet.scaleX == -1) ? bullet.width : 0), bullet.y, bullet.width, bullet.height), new egret.Rectangle(hero.x - ((hero.scaleX == -1) ? hero.width : 0), hero.y, hero.width, hero.height))) {
                hurt = true;
                hero.Hurt(bullet.GetDamage());
            }
        }
        return hurt;
    };
    /**
     * 检测英雄是否超出范围(Y轴)
     */
    p.CheckHeroOut = function (hero) {
        if (hero.y - hero.anchorOffsetY < this.gameView.min_y) {
            hero.y = this.gameView.min_y + hero.anchorOffsetY;
            return true;
        }
        else if (hero.y - hero.anchorOffsetY + hero.height > this.gameView.max_y) {
            hero.y = this.gameView.max_y + hero.anchorOffsetY - hero.height;
            return true;
        }
        return false;
    };
    /**
     * 检测是否超出屏幕
     */
    p.CheckOutScreen = function (object) {
        return !this.hitTest(new egret.Rectangle(object.x, object.y, object.width, object.height), new egret.Rectangle(0, 0, App.StageUtils.getWidth(), App.StageUtils.getHeight()));
    };
    /**
     * 碰撞检测
     */
    p.hitTest = function (rect1, rect2) {
        return rect1.intersects(rect2);
    };
    return GameController;
}(BaseController));
egret.registerClass(GameController,'GameController');