var source;

var file_1;

class DrawingObjects
{
    constructor (px, py, name) {
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }

        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method draw.");
        }

        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method mouseOver.");
        }

        this.posx = px;
        this.posy = py;
        this.name = name;
    }

    draw (cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method draw from child.");
    }

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }

   resize(isGrowUp) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }


    sqDist(px1, py1, px2, py2) {
        let xd = px1 - px2;
        let yd = py1 - py2;

        return ((xd * xd) + (yd * yd));
    }

    setPos(mx,my){
        this.posx=mx;
        this.posx=my;
    }
}

class Rect extends DrawingObjects
{

    constructor (px, py, w, h, c) {
        super(px, py, 'R');
        this.w = w;
        this.h = h;
        this.color = c;
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 10:-10;
        console.log(valueReshape);
        this.w += valueReshape;
        this.h += valueReshape;
        console.log(this.w);
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.w, this.h);
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));
    }
}

class Picture extends DrawingObjects
{

    constructor (px, py, w, h, impath) {
        super(px, py, 'P');
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 10:-10;
        console.log(valueReshape);
        this.w += valueReshape;
        this.h += valueReshape;
        console.log(this.w);
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");
        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            //console.log("Debug: N Time");
        } else {
            //console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));
    }
}

class Oval extends DrawingObjects
{
    constructor (px, py, r, hs, vs, c) {
        super(px, py, 'O');
        this.r = r;
        this.radsq = r * r;
        this.hor = hs;
        this.ver = vs;
        this.color = c;
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        return (this.sqDist(x1,y1,x2,y2) <= (this.radsq));
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 0.5:-0.5;
        console.log(valueReshape);
        this.hor += valueReshape;
        this.ver += valueReshape;
        console.log(this.w);
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");
        ctx.save();
        ctx.translate(this.posx,this.posy);
        ctx.scale(this.hor,this.ver);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}


class Heart extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'H');
        this.h = w * 0.7;
        this.drx = w / 4;
        this.radsq = this.drx * this.drx;
        this.ang = .25 * Math.PI;
        this.color = c;
    }

    outside (x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp?10:-10;
        this.h += valueReshape;
        this.drx = this.h / 4;
        this.radsq = this.drx * this.drx;
    }

    draw (cnv) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let cx = rightctrx + this.drx * Math.cos(this.ang);
        let cy = this.posy + this.drx * Math.sin(this.ang);
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
        ctx.lineTo(this.posx, this.posy + this.h);
        ctx.lineTo(cx,cy);
        ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    mouseOver (mx, my) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let qx = this.posx - 2 * this.drx;
        let qy = this.posy - this.drx;
        let qwidth = 4 * this.drx;
        let qheight = this.drx + this.h;

        let x2 = this.posx;
        let y2 = this.posy + this.h;
        let m = (this.h) / (2 * this.drx);

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist (mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }
    }
}

class Bear extends DrawingObjects
{
    constructor (px,py,width,color) {
        super(px, py, 'B');
        this.posx=px;
        this.posy=py;
        this.w = width;
        this.h = this.w * 0.7;
        this.color = color;
        this.bearPrincipalRadious=this.w/2;
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 10:-10;
        //console.log(valueReshape);
        this.w += valueReshape;
        this.h = this.w * 0.7;
        this.bearPrincipalRadious=this.w/2;
       // console.log(this.w);
    }


    /*sqDist(pos_x,pos_y,mx,my){
        let value=super.sqDist(pos_x,pos_y,mx,my);
        return Math.sqrt(value);
    }*/


    debugBoundingBox(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle="red";
        ctx.arc(this.posx,this.posy,this.bearPrincipalRadious ,0,2*Math.PI);
        ctx.moveTo(this.posx+this.w/2,this.posy-this.h/2);
        ctx.arc(this.posx+this.w/2,this.posy-this.h/2,this.w/4 ,0,2*Math.PI);
        ctx.moveTo(this.posx-this.w/2,this.posy-this.h/2);
        ctx.arc(this.posx-this.w/2,this.posy-this.h/2,this.w/4 ,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    mouseOver (mx, my) {
        //is inside if
        let isHover = (this.sqDist(this.posx,this.posy,mx,my)<Math.pow(this.bearPrincipalRadious,2))
            || (this.sqDist(this.posx+this.w/2,this.posy-this.h/2,mx,my)<Math.pow(this.w/4,2))
            || (this.sqDist(this.posx-this.w/2,this.posy-this.h/2,mx,my)<Math.pow(this.w/4,2));

        //console.log(isHover);
        return isHover;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;

        //principal
        //ctx.moveTo(this.posx, this.posy);
        //começar a desenhar o urso
        //ctx.arc(0,0,this.w/2,0,2*Math.PI);

        //orelha esquerda
        //ctx.moveTo(this.posx-this.w/2,this.posy-this.h/2*1.2);

        ctx.beginPath();
        ctx.arc(this.posx-this.w/2,this.posy-this.h/2,this.w/4,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //orelha direita
        //ctx.moveTo(this.posx-this.w/2,this.posy-this.h/2*1.2);
        ctx.beginPath();
        ctx.arc(this.posx+this.w/2,this.posy-this.h/2,this.w/4,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //orelha esquerda cera
        ctx.beginPath();
        ctx.fillStyle="#000000";
        ctx.arc(this.posx-this.w/2,this.posy-this.h/2,this.w/6,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //orelha direita cera
        ctx.beginPath();
        ctx.fillStyle="#000000";
        ctx.arc(this.posx+this.w/2,this.posy-this.h/2,this.w/6,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //principal
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posx,this.posy,this.w/2,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //nariz
        ctx.beginPath();
        ctx.fillStyle="#000000";
        ctx.save();
        ctx.arc(this.posx,this.posy+this.h/10,this.w/12,0,2*Math.PI);
        ctx.restore();
        ctx.fill();
        ctx.closePath();

        //principal nariz parte branca
        ctx.beginPath();
        ctx.fillStyle="#ffffff";
        ctx.save();
        ctx.arc(this.posx-this.w/18,this.posy+this.h/8,this.w/35,0,2*Math.PI);
        ctx.restore();
        ctx.fill();
        ctx.closePath();

        //olho esquerdo
        ctx.beginPath();
        ctx.fillStyle="#000000";
        ctx.save();
        ctx.arc(this.posx-this.w/5,this.posy-this.w/5,this.w/20,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //olho direito
        ctx.beginPath();
        ctx.arc(this.posx+this.w/5,this.posy-this.w/5,this.w/20,0,2*Math.PI);
        ctx.restore();
        ctx.fill();
        ctx.closePath();

        //olho esquerdo branco
        ctx.beginPath();
        ctx.fillStyle="#ffffff";
        ctx.save();
        ctx.arc(this.posx-this.w/4.5,this.posy-this.w/5,this.w/55,0,2*Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.closePath();

        //olho direito branco
        ctx.beginPath();
        ctx.fillStyle="#ffffff";
        ctx.save();
        ctx.arc(this.posx+this.w/5.5,this.posy-this.w/5,this.w/55,0,2*Math.PI);
        ctx.restore();
        ctx.fill();
        ctx.closePath();

        //bigode
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.save();
        ctx.arcTo(this.posx,this.posy,150,70,50);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        //this.debugBoundingBox(ctx);
    }
}

class Ghost extends DrawingObjects {
    constructor (px,py,scale,color) {
        super(px, py, 'G');
        this.scale=scale;
        this.color=color;
    }

    mouseOver (mx, my) {
        let isHover=((mx >= this.posx +(- 50 * this.scale)) && (my<=(this.posy +(40 * this.scale))) && (mx <= this.posx+((100 * this.scale)*0.5)) && (my>=this.posy +(-50 * this.scale)));
        //console.log(isHover);
        return isHover;
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 0.1:-0.1;
        this.scale+=valueReshape;
        console.log(this.scale);
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.translate(this.posx - 50 * this.scale, this.posy + 40 * this.scale);
        ctx.moveTo(0, 0);
        ctx.lineJoin = "bevel";
        ctx.lineTo(0, -50 * this.scale);
        ctx.bezierCurveTo(0, -80 * this.scale, 100 * this.scale, -80 * this.scale, 100 * this.scale, -50 * this.scale);
        ctx.lineTo(100 * this.scale, 0 );
        ctx.lineTo(80 * this.scale, -20 * this.scale);
        ctx.lineTo(64 * this.scale, 0);
        ctx.lineTo(48 * this.scale, -20 * this.scale);
        ctx.lineTo(32 * this.scale, 0);
        ctx.lineTo(16 * this.scale, -20 * this.scale);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // Eyes
        ctx.save();
        ctx.translate(this.posx - 50 * this.scale, this.posy + 40 * this.scale);
        ctx.moveTo(0, 0);
        ctx.fillStyle = "#FFFFFF";
        // Eyes  grande
        ctx.beginPath();
        ctx.arc(25 * this.scale, -40 * this.scale, 10 * this.scale, 0, 2 * Math.PI);
        ctx.arc(75 * this.scale, -40 * this.scale, 10 * this.scale, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "black";
        // Eyes  pequeno
        ctx.beginPath();
        ctx.arc(22 * this.scale, -37 * this.scale, 4 * this.scale, 0, 2 * Math.PI);
        ctx.arc(72 * this.scale, -37 * this.scale, 4 * this.scale, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        //this.debugBoundingBox(ctx);
    }
}

class rectangleFace extends DrawingObjects{
    constructor(px,py,scale,color){
        super(px,py,'RE');
        this.color = color;
        this.scale = scale;
        this.w=50;
        this.h=50;
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w*this.scale)) && (my >= this.posy) && (my <= (this.posy + this.h*this.scale)));
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 0.5:-0.1;
        this.scale += valueReshape;
    }

    draw(cnv){
        let ctx = cnv.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.posx+((this.w*this.scale)/2),this.posy+((this.h*this.scale)/2));
        ctx.rotate(30*Math.PI/180);
        ctx.beginPath();
        ctx.rect(this.posx,this.posy,this.w*this.scale,this.h*this.scale);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        //eyes
        ctx.beginPath();
        ctx.arc(this.posx-(20*this.scale),this.posy-(20*this.scale),3*this.scale,0,Math.PI*2);
        ctx.arc(this.posx+(20*this.scale),this.posy-(20*this.scale),3*this.scale,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }

}


class smileyFace extends DrawingObjects{

    constructor(px,py,r,scale,color){
        super(px,py,'S');
        this.color = color;
        this.r = r * scale;
        this.scale = scale;
        this.radsq = r*r
    }

    mouseOver(mx,my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx);
        let y2 = (my - this.posy);
        return (this.sqDist(x1, y1, x2, y2) <= (this.radsq));
    }


    resize(isGrowUp){
        let valueReshape=isGrowUp? 0.5:-0.1;
        this.scale += valueReshape;
    }

    draw(cnv){
        let ctx = cnv.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posx ,this.posy,this.r*this.scale,0,Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        //eye
        ctx.moveTo(this.posx - 20 * this.scale , this.posy - 20 * this.scale);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx - 20* this.scale , this.posy - 20 * this.scale , 4* this.scale, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        ctx.moveTo(this.posx + 20 * this.scale, this.posy - 20 * this.scale);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx + 20* this.scale, this.posy - 20* this.scale , 4 * this.scale, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        //boca
        ctx.moveTo(this.posx - 20, this.posy + 20 * this.scale);
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.posx, this.posy + 10 * this.scale ,30* this.scale, 0, Math.PI, false);
        ctx.closePath();
        ctx.fill();

    }
}

class Text extends DrawingObjects{

    constructor(px,py,color,text){
        super(px,py,'T');
        this.color = color;
        this.text = text;


    }

    resize(isGrowUp){


    }

    mouseOver (mx, my) {
        let c = document.getElementById("drawingCanvas");
        let ctx = c.getContext('2d');
        this.width = ctx.measureText(this.text).width;
        this.height = 30;
        if ((mx >= this.posx - this.width) && (mx <= (this.posx + this.width)) && (my >= this.posy - this.height) && (my <= (this.posy + this.height))){
            return true;
        }
        else return false;

    }

    draw(cnv){
        // let input = prompt("Insira o texto pretendido:");
        let ctx = cnv.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillStyle = this.color;
        ctx.fillText(this.text,this.posx,this.posy);
        }

}

class newImage extends DrawingObjects{
    constructor(px,py,w,h,impath){
        super(px,py, 'I');
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = impath;
    }

    resize(isGrowUp){
        let valueReshape=isGrowUp? 10:-10;
        //console.log(valueReshape);
        this.w += valueReshape;
        this.h += valueReshape;
        //console.log(this.w);
    }

    mouseOver (mx, my) {
        if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))){
            return true;
        }
        else return false;
    }


    draw (cnv) {
        let ctx = cnv.getContext("2d");
        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            //console.log("Debug: N Time");
        } else {
            //console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

}



