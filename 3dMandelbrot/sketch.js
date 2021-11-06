let canvas;
let w = 300;
let h = 300;
let scale = 2;
let dist = 400
let cols;
let rows;
let data;
let media
let defaultGradient
let mouseInside

let img

function setDimensions(width, height, s){
  w = width
  h = height
  scale = s
  cols = floor(h / scale);
  rows = floor(w / scale);
}

function setup() {

  //frameRate(10)
  colorMode(HSB, 1)
  defaultGradient = (percent) => color(percent, 1, 1)
  canvas = createCanvas(innerWidth, innerHeight - 200, WEBGL);
  canvas.mouseOver(() => mouseInside = true)
  canvas.mouseOut(() => mouseInside = false)
  setDimensions(300, 300, 2)
  controllerSetup()
}

function draw() {
  background(100);
  
  noFill();
  noStroke()
  
  checkPressedKeys()
  adjustCamera()
  rollPower()
  
  //pointLight(0,0,255, 0, maxHeight * 2, maxHeight * 2)
  translate(-w/2, -h/2)


  //ambientMaterial(255)
  if(media){
    texture(media)
  }else{
    if(!img){
      fillImage()
    }
    texture(img)
  }
    
  for(let y = 0 ; y < rows - 1 ; y++){
    beginShape(TRIANGLE_STRIP)
    for(let x = 0 ; x < cols ; x++){
      vertex(x*scale, y*scale, data.getValueAt(x, y) * maxHeight, x/cols*w, y/rows*h);
      vertex(x*scale, (y+1)*scale, data.getValueAt(x, y + 1) * maxHeight, x/cols*w, (y+1)/rows*h);
    }
    endShape();
  }
    /*fill(255)
    pointLight(255,255,255, 0, 0, maxHeight * 3)

    for(let y = 0 ; y < rows - 1 ; y++){
      beginShape(TRIANGLE_STRIP)
      for(let x = 0 ; x < cols ; x++){
        vertex(x*scale, y*scale, data.getValueAt(x, y) * maxHeight);
        vertex(x*scale, (y+1)*scale, data.getValueAt(x, y + 1) * maxHeight);
      }
      endShape();
    }

  }*/
  
  
  
  
}