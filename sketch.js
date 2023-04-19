/*This weekly assignment is to control the movement of the balls by using computer vision.
reference: becky week9-optical flow https://kylemcdonald.github.io/cv-examples/
          example fram : https://openprocessing.org/sketch/1521039
//collebrator: Jing Wang / Yifan Hang
*/

let capture;
let previousPixels;
let flow;
let step = 8;
let totalPhase = 0;

let i, r, g, b;
let sz = 5;
let space = 2;

////////////////////////////////////////////////////////
function setup() {
    capture = createCapture(VIDEO);
    capture.size(640,480);
	capture.hide();

    flow = new FlowCalculator(step);
	canvasElement = createCanvas(windowWidth, windowHeight);

	background(0);
}

////////////////////////////////////////////////////////
function windowResized() {
	canvasElement = createCanvas(windowWidth, windowHeight);
}

////////////////////////////////////////////////////////
function same(a1, a2, stride, n) {
    for (let i = 0; i < n; i += stride) {
        if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}

////////////////////////////////////////////////////////
function draw() {
    //make sure the width and height is in line with the screen
    background(0, 5);
		let w = capture.width;//640
		let h = capture.height;//480

	bg = createGraphics(w - (sz * 2), h - (sz * 2));

	bg.noStroke();

	if (width / height >= w / h) {

		nW = width;
		nH = width / (w / h);
		oX = 0;
		oY = (height - nH) / 2;

	} else {

		nW = height * (w / h);
		nH = height;
		oX = (width - nW) / 2;
		oY = 0;

	}

    capture.loadPixels();

    //movements 
    if (capture.pixels.length > 0) {
        if (previousPixels) {
            previousPixels.loadPixels();
            // cheap way to ignore duplicate frames
            if (same(previousPixels.pixels, capture.pixels, 4, width)) {
                return;
            }
            // calculate optical flow
            flow.calculate(previousPixels.pixels, capture.pixels, capture.width, capture.height);
        }else {
            previousPixels = createImage(capture.width, capture.height);
        }

        previousPixels.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
        //draw frame of video to canvas
     
        // code to visualise optical flow grid
    if (flow.flow && flow.flow.u != 0 && flow.flow.v != 0) {
   
        //get the direction of the movements 
        let flowwww = createVector (flow.flow.u,flow.flow.v);
        flowwww.normalize ();

    for (let x = 0; x < w; x += sz + space) {
		for (let y = 0; y < h; y += sz + space) {
			i = ((y * w) + x) * 4;
			r = capture.pixels[i];
			g = capture.pixels[i + 1];
			b = capture.pixels[i + 2];
			bg.fill(r, g, b);
            bg.ellipse(x + flowwww.x *10 , y  +  flowwww.y*10, sz, sz);
          
		}
	}

    push();
    strokeWeight(2);
    stroke(255,0,0);
    translate(width/2, height/2);
    //show our avaerage direction
    line(0, 0, flowwww.x*50, flowwww.y*50);
    pop();

    push();
    translate(width, 0);
    scale(-1, 1);
    image(bg, oX, oY, nW, nH);
    pop();
    }
  }

}
 

///////////////////////////////////////////////////////////////
function mousePressed() {
	if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
		let fs = fullscreen();
		fullscreen(!fs);
	}
}