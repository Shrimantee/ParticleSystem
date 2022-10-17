/* VIZA 659 : Assignment 2 - Part 1
Particle System 
- emitter : disk surface
- forces : under the influence of gravitational attractors
The number of attractors and emitters can be controlled using slider 1
The decay rate can be controlled using slider 2
The particle size can be controlled by clicking on the 'play music' button, 
the ampltiude of the music determines the size of particles

Shrimantee Roy, 09/29/2022

 *  Inspired by
 *   - Dan Shiffman https://natureofcode.com/book/chapter-4-particle-systems/
*/



particles = [];
n = 0;

particleLimit = 3;
attractors = [];
function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
    button.html('pause');
  } else {
    song.stop();
    button.html('play');
  }
}
function loaded() {
  button = createButton('Play Music');
  button.position(10,100)
  button.mousePressed(togglePlaying);
}
function mousePressed() {
  userX = mouseX;
  userY = mouseY
  redraw();
}
function setup() {
  frameRate(24)

 

  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  /*-------------- ONLY if attractors are used----------------- */

  // for (var i = 0; i < limit; i++) {
  //   var x = randomGaussian(0, width / 4);
  //   var y = randomGaussian(0, height / 2);
  //   var z = randomGaussian(0, 200);
  //   attractors.push(createVector(x, y, z));
  // }
  /* ----------------------------------------------------------- */
  slider = createSlider(2, 30, 1,1);
  slider.position(10, 10);
  slider.style('width', '50px');
  slider1name = createElement('p', 'Number of Attractors and Emitters');
  slider1name.position(10, 20);
  slider1name.style('fontSize',"x-small")

  slider1name.style('color',"white")

  slider2 = createSlider(1, 4, 1,1 );
  slider2.position(10, 50);
  slider2.style('width', '50px');
  slider2name = createElement('p', 'Decay Rate');
  slider2name.position(10, 60);
  slider2name.style('fontSize',"x-small")
  slider2name.style('color',"white")

 

  particledisplay = createElement('h2', "Particle Count");
  particledisplay.id('particleCount')

  song = loadSound('music/music.mp3', loaded);
  amp = new p5.Amplitude();

}
angle = 0
drawCount = 0
deadCount = 0
showcount = 0
decayRate = 1
function updateLimit() {
  particleLimit = slider.value();

  attractors.splice(0, attractors.length)
  print(attractors.length)
}
function updateDecayRate() {
  decayRate = slider2.value();
}

function draw() {

  background(0, 0, 50);
  slider.input(updateLimit);
  slider2.input(updateDecayRate);

  drawCount = drawCount + 1


  directionalLight([255], createVector(sin(frameCount / 6) * 360, cos(frameCount / 6) * 360, 0));
  directionalLight([150], createVector(0, 0, -1));

  scale(0.5)


  if (attractors.length == 0) {
    print("At attractor")
    for (var i = 0; i < particleLimit; i++) {

      var x = randomGaussian(0, width / 4);


      var y = randomGaussian(0, height / 2);
      var z = randomGaussian(0, 200);
      attractors.push(createVector(x, y, z));
    }
  }

  var x = randomGaussian(0, width / 4);
  var y = randomGaussian(0, height / 2);
  var z = randomGaussian(0, 200);
  var pos = createVector(x, y, z);
  for (var i = 0; i < particleLimit; i++) {
    var r = map(sin(frameCount), -1, 1, 0, 255) + random(-50, 50);
    var g = map(sin(frameCount / 2), -1, 1, 255, 0) + random(-50, 50);
    var b = map(cos(frameCount / 4), -1, -1, 0, 255) + random(-50, 50);

    var c = color(r, g, b);

    var p = new Particle(pos, c);
    particles.push(p);
  }

  for (var i = particles.length - 1, n = 0; i > -0; i--, n++) {
    /*-------------- ONLY if attractors are used----------------- */
    for (var j = attractors.length - 1; j > 0; j--) {
      if(song.isPlaying()){
        var vol = amp.getLevel();
        var diam = map(vol, 0, 0.3, 3, 100);
        particles[i].w = diam/2
      }
      particles[i].attracted(attractors[j])

      if (particles[i].lifespan > 0) {
        showcount = showcount + 1

        particles[i].update();
        particles[i].show();

      } else {
        print("DEADDDDD!")
        deadCount = deadCount + 1

        particles.splice(i, 1);

      }
      print(deadCount)
      document.getElementById("particleCount").innerHTML = (showcount - deadCount);

    }

  }

}

h = 1;


class Particle {
  constructor(pos, c) {


    this.x = [];
    this.v = [];

    this.emission(pos);

    this.x.push(this.pos)
    this.vel.x = this.vel.x * h
    this.vel.y = this.vel.y * h
    this.vel.z = this.vel.z * h
    this.v.push(this.vel)



    this.lifespan = 255
    this.c = c;
    this.w = random(5, 6);

    this.Ga = 1000;//6.67408
    this.p = 2
  }


  update() {

    this.vel.add(this.aclr);
    this.v.push(this.vel)

    this.pos.add(this.vel);
    this.x.push(this.pos)

    this.aclr = createVector(0, 1, 0)

    this.lifespan = this.lifespan - decayRate;
  }
  show() {

    push();
    noStroke();
    fill(map(sin(frameCount), -1, 1, 0, 255) + random(-50, 50), map(sin(frameCount / 2), -1, 1, 255, 0) + random(-50, 50), 255, this.lifespan)
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(this.w);
    pop();
  }
  emission(pos) {
    var theta = random(-PI, PI);
    var y = random(-1, 1)
    var r = sqrt(1 - y * y);
    var delta = 360;
    var v_dir = createVector(r * cos(theta * 2 * PI), y, r * sin(theta * 2 * PI) * -1)


    var a = createVector(1, 0, 0)
    var uz;
    var w = uz = createVector(0, 1, 0)

    var ux = a.cross(uz).div(a.cross(uz).mag())
    var uy = uz.cross(ux);

    var M = createVector(ux, uy, uz)
    // var f = randomGaussian(w, delta / 3);
    var f = random(0, 1)
    var phi = sqrt(f) * delta

    var vel_unit = createVector(sin(phi * 2 * PI) * cos(theta * 2 * PI), sin(phi * 2 * PI) * sin(theta * 2 * PI), cos(phi * 2 * PI))

    var ucap = this.vel = createVector(M.x.x * vel_unit.x + M.x.y * vel_unit.y + M.x.z * vel_unit.z,
      M.y.x * vel_unit.x + M.y.y * vel_unit.y + M.y.z * vel_unit.z,
      M.z.x * vel_unit.x + M.z.y * vel_unit.y + M.z.z * vel_unit.z)


    var R = 5
    this.f = random(0, 1)
    var r = sqrt(f) * R

    var unit_pos = createVector(r * cos(theta * 2 * PI), r * sin(theta * 2 * PI), 0);
    var centre = createVector(pos.x, pos.y, pos.z)

    this.pos = centre.add(M.x.x * unit_pos.x + M.x.y * unit_pos.y + M.x.z * unit_pos.z,
      M.y.x * unit_pos.x + M.y.y * unit_pos.y + M.y.z * unit_pos.z,
      M.z.x * unit_pos.x + M.z.y * unit_pos.y + M.z.z * unit_pos.z);


  }
  attracted = function (target) {
    var force = p5.Vector.sub(target, this.pos);
    var dsquared = force.magSq();
    dsquared = constrain(dsquared, 5, 500)
    force.normalize();
    var strength = this.Ga / dsquared;
    force.setMag(strength)
    this.aclr = force

  }
}
