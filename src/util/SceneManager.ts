class SceneManager extends SingtonClass{
    private _stage:egret.DisplayObjectContainer;
    private _nowScene:BaseScene;
    private _newScene:BaseScene;
    private _cache:Array<any>;

    public constructor() {
        super();
        this._cache = [];
    }

    public init(stage:egret.DisplayObjectContainer){
        this._stage = stage;
        console.log("SceneManager init()");
    }

    public changeScene(scene:BaseScene){
        var newScene:any = ()=>{
            if(scene){
                scene.initStage(this._stage);
                scene.init();
                scene.enableSceneAnim(AnimType.Fade);
            }
            this._nowScene = scene;
            if(this._nowScene){
                this._stage.addChild(this._nowScene);
                this._nowScene.fadeIn();
            }
        }
        this._newScene = scene;
        if(this._nowScene){
            this._nowScene.fadeOut(()=>{
                if(this._nowScene.parent){
                    this._stage.removeChild(this._nowScene);
                }
                this._nowScene.destroy();
                newScene.call();
            });
        } else {
            newScene.call();
        }
    }
}