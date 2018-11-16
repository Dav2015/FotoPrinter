'use strict';

class FotoPrint
{
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.shpinDrawing = new Pool(100);
        this.staticObject= new Pool(10);
    }

    // insertText(value){
    //
    //     let color = document.getElementById("myColor");
    //
    //     let text = new Text(30,30,color.value,value);
    //
    //     this.shpinDrawing.insert(text);
    //
    // }

    init() {
        /*
        let o = new Oval(150, 150, 50, 1, 1, "blue");
        this.shpinDrawing.insert(o);

        let h = new Heart(250, 250, 80, "pink");
        this.shpinDrawing.insert(h);

        let dad = new Picture(200, 200, 70, 70, "imgs/allison1.jpg");
        this.shpinDrawing.insert(dad);

        let ghost = new Ghost(300,200,1,"#425cf4");
        this.shpinDrawing.insert(ghost);

        let bear = new Bear(300,200,100,"#239b3d");
        this.shpinDrawing.insert(bear);

        let r = new Rect(500, 100,100, 100, "red");
        this.shpinDrawing.insert(r);
        */

        let b= new smileyFace(500,100,50,1,"yellow");
        this.shpinDrawing.insert(b);

        let s = new rectangleFace(50,50,1,"red");
        this.shpinDrawing.insert(s);
    }

    // insertText(){
    //     let cnv = document.getElementById("drawingCanvas");
    //     let color = document.getElementById("myColor").value;
    //     let input = prompt("Insira o texto pretendido:");
    //     let text = new Text(400,500,color, input);
    //
    //     this.shpinDrawing.insert(text);
    //
    //     console.log(this.shpinDrawing.stuff);
    // }
    //2 parte
    selectObject(mx, my){
        for (let object of this.staticObject.stuff) {
            if(object.mouseOver(mx,my)){
                return this.cloneObj(object);
            }
        }
        return null;
    }

    scaleObj(mx,my,isGrowUp){
        for (let object of this.shpinDrawing.stuff) {
            if(object.mouseOver(mx,my)){
                object.resize(isGrowUp);
                console.log(object.name);
                return true;
            }
        }
        return false;
    }

    drawObj(cnv) {
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
        }

    }

    dragObj(mx, my) {
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
                this.offsety = my - this.shpinDrawing.stuff[i].posy;
                let item = this.shpinDrawing.stuff[i];
                this.thingInMotion = this.shpinDrawing.stuff.length - 1;
                this.shpinDrawing.stuff.splice(i, 1);
                this.shpinDrawing.stuff.push(item);
                return true;
            }
        }
        return false;
    }



    moveObj(mx, my) {
        this.shpinDrawing.stuff[this.thingInMotion].posx = mx - this.offsetx;
        this.shpinDrawing.stuff[this.thingInMotion].posy = my - this.offsety;
    }

    removeObj () {
        this.shpinDrawing.remove();
    }

    insertObj (mx, my) {
        let item = null;
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx,my)) {
                item = this.cloneObj(this.shpinDrawing.stuff[i]);
                this.shpinDrawing.insert(item);
                return true;
            }
        }
        //2parte
        //inserir objeto selecionado se nao estiver por cima de nada
        if(selectedObject!=null) {
            let insertObject=this.cloneObj(selectedObject);
            insertObject.setPos(mx, my);
            app.shpinDrawing.insert(insertObject);
            return true;
        }
        return false;
    }


    cloneObj (obj) {
        let item = {};
        let color = document.getElementById("myElColor");
        switch(obj.name) {
            case "R":
                item = new Rect(obj.posx + 20, obj.posy + 20, obj.w, obj.h, color.value);
                break;

            case "P":
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.impath);
                break;

            case "O":
                item = new Oval(obj.posx + 20, obj.posy + 20, obj.r, obj.hor, obj.ver, color.value);
                break;

            case "H":
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4,color.value);
                break;

            case "G":
                //item = new Ghost(obj.posx + 20, obj.posy + 20, obj.drx * 4, obj.color);
                item = new Ghost(obj.posx + 20, obj.posy + 20,1, color.value);
                break;

            case "B":
                //item = new Ghost(obj.posx + 20, obj.posy + 20, obj.drx * 4, obj.color);
                item = new Bear(obj.posx + 20, obj.posy + 20,50,color.value);
                break;

            case "I":
                item = new newImage(obj.posx + 20, obj.posy + 20, obj.w,obj.h, obj.impath);
                break;

            case "S":
                item = new smileyFace(obj.posx + 20, obj.posy + 20, obj.r, obj.scale, color.value);
                break;

            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }


}


class Pool
{
    constructor (maxSize) {
        this.size = maxSize;
        this.stuff = [];
    }

    insert (obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove () {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
           alert("There aren't objects in the application to delete");
        }
    }
}

/*class staticPool extends Pool{

    constructor (maxSize) {
        super(maxSize);
    }

    selectPos(){

    }
}*/

