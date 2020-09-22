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
    public alertMes(mes:string,color:number=-1){
        this._cache.push([mes, color]);
        this.showMes();
    }
    public alertSmsBlack(str:string){
            this.alertMes(str,0x000000);
    }
    private _isShowMesing:boolean;
    public showMes(){
        if (this._isShowMesing) {
            return;
        }

        if (this._cache.length == 0) {
            return;
        }

        var arr:Array<any> = this._cache.shift();
        var mes:string = arr[0];
        var color:number = arr[1];

        var txt:egret.TextField = new egret.TextField();
        txt.text = mes;
        txt.size = 30;
        if(color>=0){
            txt.textColor = color;
        } else {
            txt.textColor = 0xffffff;
        }
        txt.width = 300;
        txt.height = 80;
        txt.textAlign = egret.HorizontalAlign.CENTER;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        txt.x = (this._stage.width - txt.width)/2;
        txt.y = (this._stage.height - txt.height)/2+20;
        this._stage.addChild(txt);
        egret.Tween.get(txt,{
            loop:false,
        }).to({y:(this._stage.height - txt.height)/2-100
        },1000).call(this.onAlertComplete,this,[txt]);
        this._isShowMesing = true;
    }
    private onAlertComplete(txt:egret.TextField){
        txt.parent.removeChild(txt);
        this.nextMes();
    }
    private nextMes():void {
        this._isShowMesing = false;
        this.showMes();
    }

    private loadingBg:egret.Sprite;
    private isShowLoading:boolean;
    private timer:egret.Timer;
    public showLoading(){
        if(this.timer&&this.timer.running){
            this.timer.stop();
        }
        if(this.isShowLoading)
            return;
        
        this.timer = new egret.Timer(1000,1);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer.start();
    }

    public hideLoading(){
        this.timer.stop();
        if(!this.isShowLoading)
            return;
        this.loadingBg.parent.removeChild(this.loadingBg);
        this.isShowLoading = false;
    }
    private drawLoading(){
        this.loadingBg = new egret.Sprite();
        this.loadingBg.touchEnabled=true;
        var loadingBg:egret.Shape = new egret.Shape();
        loadingBg.graphics.clear();
        loadingBg.graphics.beginFill(0x000000,0.5);
        loadingBg.graphics.drawRect(0,0,this._stage.width,this._stage.height);
        loadingBg.graphics.endFill();
        loadingBg.x = 0;
        loadingBg.y = 0;
        var text:egret.TextField = new egret.TextField();
        text.text = "通讯中。。。";
        text.size = 30;
        text.textColor = 0xffffff;
        text.width = 300;
        text.height = 50;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.x = (this._stage.width - text.width)/2;
        text.y = (this._stage.height -text.height)/2+20;
        this.loadingBg.addChild(loadingBg);
        this.loadingBg.addChild(text);
        this.loadingBg.x = 0;
        this.loadingBg.y = 0;
        this._stage.addChild(this.loadingBg);
        this.isShowLoading = true;
    }
    private timerComFunc(event: egret.TimerEvent) {
        var timer:egret.Timer = event.target;
        timer.stop();
        this.drawLoading();
    }
}