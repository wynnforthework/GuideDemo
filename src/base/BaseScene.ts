interface ChangeSceneAnim {
    fadeInI();
    fadeOutI(call: Function);
}
enum AnimType {
    None,
    Fade,
    Hole,
    Door,
    Translocation,
    Curtain
}
class BaseScene extends egret.Sprite implements ChangeSceneAnim{
    public _stage: egret.DisplayObjectContainer;
    public stageW: number;
    public stageH: number;
    public sceneAnim?: ChangeSceneAnim;
    public scaleMin: number;
    private animType:AnimType;
    public constructor() {
        super();
    }

    public init() {
        this.touchEnabled = true;
        this.stageW = this._stage.stage.stageWidth;
        this.stageH = this._stage.stage.stageHeight;
        // this.scaleMin = Math.min(this.stageH / 750, this.stageW / 1334);
        this.scaleMin = this.stageH / 750;
        if(this.scaleMin>1){
            this.scaleMin=1;
        } else {
            this.stageH = Math.max(this.stageH,750);
        }
    }

    public initStage(stage: egret.DisplayObjectContainer) {
        this._stage = stage;
    }

    public destroy() {

    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public fadeIn() {
        if (this.sceneAnim)
            this.sceneAnim.fadeInI();
    }
    public fadeOut(call: any) {
        if (this.sceneAnim) {
            this.sceneAnim.fadeOutI(call);
        } else {
            call.call();
        }
    }
    public fadeInAnim(type?:AnimType) {
        const that = this;
        switch(type){
            case AnimType.Fade:{
                var bg = this.drawBmpXY("black@2x_png", 0, 0);
                bg.width = this.stageW;
                bg.height = this.stageH;
                egret.Tween.get(bg).to({alpha:0},500).call(()=>{
                    that.removeChild(bg);
                });
            } 
            break;
            case AnimType.Hole:{
                var posList = [];
                var a = that.numChildren;
                if(a==1){
                    break;
                }
                for(var i=1;i<that.numChildren;i++){
                    var c = that.getChildAt(i);
                    posList.push({"x":c.x,"y":c.y});
                    c.scaleX=c.scaleY=0;
                    c.x = that.stageW/2;
                    c.y = that.stageH/2;
                }
                var bg = that.drawBmpXY("findhead@2x_png", that.stageW/2, that.stageH/2);
                that.setChildIndex(bg,1);
                bg.anchorOffsetX=bg.width/2;
                bg.anchorOffsetY=bg.height/2;
                bg.scaleX=bg.scaleY=0;
                egret.Tween.get(bg).to({scaleX:1,scaleY:1},500).call(()=>{
                    var a = that.numChildren;
                    for(var i=2;i<that.numChildren;i++){
                        var c = that.getChildAt(i);
                        var p = posList[i-2];
                        egret.Tween.get(c).to({scaleX:1,scaleY:1,x:p.x,y:p.y},500);
                    }
                }).wait(500).to({scaleX:0,scaleY:0},500).call(()=>{
                    that.removeChild(bg);
                });
            } 
            break;
            case AnimType.Door:{
                var left = this.drawBmpXY("door_left@2x_png", this.stageW/2, 0);
                left.x = 0;
                left.height = this.stageH*this.scaleMin;
                var right = this.drawBmpXY("door_right@2x_png", this.stageW/2, 0);
                right.height = this.stageH*this.scaleMin;
                
                egret.Tween.get(left).to({x:-left.width},500);
                egret.Tween.get(right).to({x:this.stageW},500).call(()=>{
                    that.removeChild(left);
                    that.removeChild(right);
                });
            } 
            break;
            case AnimType.Curtain:{
                var bg = this.drawBmpXY("splash_jpg",0 , 0);
                bg.width = this.stageW;
                bg.height = this.stageH;
                bg.y = 0;
                egret.Tween.get(bg).to({y:-this.stageH},500).wait(500).call(()=>{
                    that.removeChild(bg);
                });
            }
            break;
            default:
            break;
        }
        
    }
    public fadeOutAnim(call: Function,type?:AnimType) {
        const that = this;
        switch(type){
            case AnimType.Fade:{
                var bg = this.drawBmpXY("black@2x_png", 0, 0);
                bg.width = this.stageW;
                bg.height = this.stageH;
                bg.alpha = 0;
                egret.Tween.get(bg).to({alpha:1},500).call(()=>{
                    that.removeChild(bg);
                    if(call){
                        call();
                    }
                });
            } 
            break;
            case AnimType.Hole:{
                var bg = this.drawBmpXY("findhead@2x_png", this.stageW/2, this.stageH/2);
                this.setChildIndex(bg,1);
                bg.anchorOffsetX=bg.width/2;
                bg.anchorOffsetY=bg.height/2;
                bg.scaleX=bg.scaleY=0;
                egret.Tween.get(bg).to({scaleX:1,scaleY:1},500).call(()=>{
                    for(var i=2;i<that.numChildren;i++){
                        var c = this.getChildAt(i);
                        egret.Tween.get(c).to({scaleX:0,scaleY:0,x:this.stageW/2,y:this.stageH/2},500);
                    }
                }).wait(500).to({scaleX:0,scaleY:0},500).call(()=>{
                    that.removeChild(bg);
                    if(call){
                        call();
                    }
                });
            } 
            break;
            case AnimType.Door:{
                var left = this.drawBmpXY("door_left@2x_png", this.stageW/2, 0);
                left.x = -left.width;
                left.height = this.stageH*this.scaleMin;
                var right = this.drawBmpXY("door_right@2x_png", this.stageW/2, 0);
                right.height = this.stageH*this.scaleMin;
                right.x = this.stageW;
                egret.Tween.get(left).to({x:0},500);
                egret.Tween.get(right).to({x:right.width},500).call(()=>{
                    that.removeChild(left);
                    that.removeChild(right);
                    if(call){
                        call();
                    }
                });
            } 
            break;
            case AnimType.Curtain:{
                var bg = this.drawBmpXY("splash_jpg", 0, 0);
                bg.width = this.stageW;
                bg.height = this.stageH;
                bg.y = -this.stageH;
                egret.Tween.get(bg).to({y:0},500).call(()=>{
                    that.removeChild(bg);
                    if(call){
                        call();
                    }
                });
            }
            break;
            default:{
                if(call){
                    call();
                }
            }
            break;
        }
        
    }
    public setScaleMin(view: egret.DisplayObject) {
        view.scaleX = view.scaleY = this.scaleMin;
    }
    // 开启转场动画
    public enableSceneAnim(type:AnimType){
        this.sceneAnim = this;
        this.animType = type;
    }
    public fadeInI(){
        this.fadeInAnim(this.animType);
    }
    public fadeOutI(call){
        this.fadeOutAnim(call,this.animType);
    }

    private value=0;
	//添加factor的set,get方法,注意用public  
	public get factor():number {  
		return this.value;  
	}  
	//计算方法参考 二次贝塞尔公式  
	public set factor(value:number) {
		this.value = value;
	}

    public drawBmpXY(name: string, x: number, y: number, hcenter: boolean = false, vcenter: boolean = false, scale: number = 1) {
        let bmp = this.createBitmapByName(name);
        this.addChild(bmp);
        bmp.x = x;
        bmp.y = y;
        bmp.scaleX = scale;
        bmp.scaleY = scale;
        if (hcenter) {
            bmp.anchorOffsetX = bmp.width / 2;
        }
        if (vcenter) {
            bmp.anchorOffsetY = bmp.height / 2;
        }
        return bmp;
    }
}