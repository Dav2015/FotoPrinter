'use strict';

let app = null;

let selectedObject = null;

function main() {
    let cnv = document.getElementById('drawingCanvas');
    drawCanvasRect(cnv);
    app = new FotoPrint();
    app.init();
    app.drawObj(cnv);
    cnv.addEventListener('mousedown', drag, false);
    cnv.addEventListener('dblclick', makenewitem, false);


    //2parte
    let cnvObject = document.getElementById('objectCanvas');
    //fazer scale ao desenhos
    cnv.addEventListener('wheel', scaleObject, false);
    //
    drawCanvasRect(cnvObject);
    FotoPrint.prototype.init=function () {
        let margin=10;
        let center=cnvObject.height/2;
        let objectSpace=cnvObject.width/8;

        let pos_x=margin;
        let r = new Rect(pos_x,center-cnvObject.height/4,objectSpace,center, "red");
        app.staticObject.insert(r);
        // r.draw(cnvObject);

        pos_x+=objectSpace*2-(margin*4);
        let o = new Oval(pos_x,center,objectSpace/2, 1, 1, "blue");
        app.staticObject.insert(o);
        //  o.draw(cnvObject);

        pos_x+=objectSpace;
        let h = new Heart(pos_x,center-(margin*2), objectSpace, "pink");
        app.staticObject.insert(h);
        //  h.draw(cnvObject);

        pos_x+=objectSpace-(margin*4);
        let dad = new Picture(pos_x,center-(margin*4), objectSpace-margin, objectSpace-margin, "imgs/allison1.jpg");
        app.staticObject.insert(dad);
        //  dad.draw(cnvObject);

        pos_x+=objectSpace+(margin*5);
        let ghost = new Ghost(pos_x,center,1,"#425cf4");
        app.staticObject.insert(ghost);
        // ghost.draw(cnvObject);

        pos_x+=objectSpace+(margin*3);
        let bear = new Bear(pos_x,center,objectSpace,"#239b3d");
        app.staticObject.insert(bear);
        //bear.draw(cnvObject);

        pos_x+=objectSpace+(margin*4);
        let smiley = new smileyFace(pos_x,center,objectSpace/2,1,"yellow");
        app.staticObject.insert(smiley);

        for (let object of app.staticObject.stuff) {
            object.draw(cnvObject);
        }

    }
    app.init();
    cnvObject.addEventListener('click', selectObject, false);
}

function drawCanvasRect(cnv) {
    let ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

//2 parte selecionar o objeto da parte de cima para depois colocar em baixo
function selectObject(ev) {
    let mx = null;
    let my = null;
    let cnvObject = document.getElementById('objectCanvas');

    if ( ev.layerX ||  ev.layerX === 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }

    cnvObject.style.cursor = "pointer";
    selectedObject = app.selectObject(mx, my);

    //teste
    //   if(selectedObject!=null){
    //app.shpinDrawing.insert(selectedObject);
    // app.drawObj(cnv);
    //  }

    // cnvObject.style.cursor = "crosshair";
}

function scaleObject(ev) {
    let mx = null;
    let my = null;
    let cnv = null;
    let isGrowUp=null;

    if ( ev.layerX ||  ev.layerX === 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    cnv = document.getElementById('drawingCanvas');
    console.log(ev.wheelDelta);

    if( ev.wheelDelta>=120){
        isGrowUp=true;
    }
    else if (ev.wheelDelta<=-120){
        isGrowUp=false;
    }
    //if provavelmente nao necessario
    if(app.scaleObj(mx, my,isGrowUp)){
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    }


}

//Drag & Drop operation
//drag
function drag(ev) {
    let mx = null;
    let my = null;
    let cnv = null;

    if ( ev.layerX ||  ev.layerX === 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    if (app.dragObj(mx, my)) {
        cnv = document.getElementById('drawingCanvas');
        cnv.style.cursor = "pointer";
        cnv.addEventListener('mousemove', move, false);
        cnv.addEventListener('mouseup', drop, false);
    }
}

//Drag & Drop operation
//move
function move(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('drawingCanvas');

    if ( ev.layerX ||  ev.layerX === 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    app.moveObj(mx, my);
    drawCanvasRect(cnv);
    app.drawObj(cnv);

}

//Drag & Drop operation
//drop
function drop() {
    let cnv = document.getElementById('drawingCanvas');
    cnv.removeEventListener('mousemove', move, false);
    cnv.removeEventListener('mouseup', drop, false);
    cnv.style.cursor = "crosshair";
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('drawingCanvas');

    if ( ev.layerX ||  ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    if (app.insertObj(mx, my)) {
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    }
}

//Delete button
//Onclick Event
function remove() {
    let cnv = document.getElementById('drawingCanvas');
    app.removeObj();
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
    try {
        let cnv = document.getElementById('drawingCanvas');

        window.open(cnv.toDataURL("image/png"));


    }
    catch(err) {
        alert("You need to change browsers OR upload the file to a server.");
    }
}



function insertText(){

    let color = document.getElementById('myColor');

    let cnv = document.getElementById('drawingCanvas');

    let input = prompt("Insira aqui o texto desejado:");


    let text = new Text(150,150,color.value,input);

    app.shpinDrawing.insert(text);

    app.drawObj(cnv);


}


function reader(){

        let file = document.getElementById("file").files[0];

        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.addEventListener("load", function () {

            let test = reader.result;

            insertImage(test);


        });




}


function insertImage(e) {

        let cnv = document.getElementById('drawingCanvas');

        let img = new newImage(150,150,400,200,e);

        app.shpinDrawing.insert(img);

        app.drawObj(cnv);




}

function backgroundColor(){

    let cnv = document.getElementById('drawingCanvas');

    let color = document.getElementById('myBckColor');

    cnv.style.backgroundColor = color.value;
}
