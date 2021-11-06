let distanceInc = 10
let center
let step = 0.05
let zoomFactor = 1.1;
let maxIt = 30
let maxHeight = 50;
let angleX
let angleY

let rollingPower = false
let rollStep = 1
let rollAngle = 0
let filling_data = false
let filling_next = false

function controllerSetup(){
    setupSliders()
    angleX = PI/2
    angleY = PI
    canvas.mouseWheel(mouseWheel)
    canvas.drop(fileDropped)
    center = new Complex(0, 0)
    fillData()
}



function keyPressed(){
    if(key >= '0' && key <= '9'){
        let p = key - '0'
        let aux = 1E-16 / 0.05
        step = 0.05 * pow(aux, p / 9)
        fillData()
        return;
    }

    switch(key){
        case 'c':cameraOn()
        break;
        case 'r':rollingPower = !rollingPower
        break;
        case 'x':stopMedia()
        break;
    }
    //return false
}

function checkPressedKeys(){
    if(!mouseInside)
        return;

    if(keyIsDown(39))       maxHeight += 5;                 //ArrowRight

    if(keyIsDown(38))       dist -= distanceInc;            //ArrowUp
    
    if(keyIsDown(40))       dist += distanceInc;            //ArrowDown
    
    if(keyIsDown(37))       maxHeight -= 5;                 //ArrowLeft
    
    if(keyIsDown(65))      {data.moveXAndFill(2, maxIt); img = null}  //a
    
    if(keyIsDown(87))      {data.moveYAndFill(2, maxIt); img = null}  //w
    
    if(keyIsDown(83))      {data.moveYAndFill(-2, maxIt); img = null}  //s

    if(keyIsDown(68))      {data.moveXAndFill(-2, maxIt); img = null}  //d
    
    if(keyIsDown(171))      {maxIt = floor(maxIt * 1.05);fillData()}         //+
    
    if(keyIsDown(173))      {maxIt = floor(maxIt / 1.05);fillData()}         //-
}

function mouseWheel(e){
    e.preventDefault()
    if(e.deltaY < 0){
        step /= zoomFactor
    }else{
        step *= zoomFactor
    }
    fillData()
}

function adjustCamera(){
    if(mouseIsPressed && mouseInside){
        angleX += map(mouseX - pmouseX, 0, width, 0, TWO_PI)
        angleY += map(mouseY - pmouseY, 0, height, 0, PI)
        angleY = angleY > PI ? PI : angleY < 0 ? 0.0000001 : angleY;
    }
    camera(cos(angleX) * sin(angleY) * dist, sin(angleX) * sin(angleY) * dist, -cos(angleY) * dist, 0, 0, 0, 0, 0, -1)
  }

function stopMedia(){
    media?.stop?.();
    media = null;
}

function fillData(){
    if(!filling_data){
        filling_next = false
        filling_data = true
        data = new MandelbrotData(cols, rows, center, step, new Complex(textRE.value(), textIM.value()));
        let p = new Promise((res, rej) => {
            data.fillAllData(maxIt)
            res()
        })
        p.then((val) => {
            img = null
            filling_data = false
            if(filling_next)
                fillData()
        })
        
    }else
        filling_next = true
}

function fillImage(){
    img = data.toImage(defaultGradient)
    img.resize(w, h)
}

function fileDropped(file){
    if(file.type === 'image'){
        stopMedia()
        media = loadImage(file.data, () => {media.resize(w, h);})
    }else if(file.type === 'video'){
        stopMedia()
        media = createVideo(file.data, () => {media.size(w, h);media.hide();media.loop()})
    }
}

function cameraOn(){
    stopMedia()
    media = createCapture(VIDEO)
    media.size(w, h)
    media.hide()
}

function rollPower(){
    if(rollingPower){
        let c = fromAngle(rollAngle, step*5)

        let newRE = 2 + c.re  //parseFloat(textRE.value())
        textRE.value(newRE)

        let newIM = c.im
        textIM.value(newIM)

        rollAngle += 0.05
        fillData()
    }
}