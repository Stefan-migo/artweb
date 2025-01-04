import dynamic from 'next/dynamic';
const Sketch = dynamic(() => import('react-p5'), { ssr: false });

const HeroAnimation = () => {
  let table; // To store the loaded CSV file
  let palette; // To store the selected palette (row) from the CSV
  let bgColor, strokeColor; // To store the background and stroke colors
  let paletteColors = []; // Array to store all colors from the selected palette
  let _minW, _maxW, _count, _aryRing = [], _aryRotate = [], rProg = 0.2;

  const preload = (p5) => {
    // Load the colors.csv file before the sketch starts
    table = p5.loadTable('/colors.csv', 'csv', 'header');
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, 500, p5.WEBGL).parent(canvasParentRef);
    // Select a random palette (row) from the CSV file
    palette = p5.floor(p5.random(table.getRowCount()));
    updateColors(p5); // Initialize bgColor and strokeColor

    setObject(p5);
  };

  const setObject = (p5) => {
    _count = 0;
    _minW = p5.min(p5.width, p5.height) * 1;
    _maxW = p5.max(p5.width, p5.height);
    p5.rectMode(p5.CENTER);
    p5.ellipseMode(p5.RADIUS);
    p5.noFill();
    p5.stroke(0, 60, 90);
    p5.strokeWeight(_minW / 400 * p5.pixelDensity());

    let numRing = 100;
    let posXy = p5.createVector(0, 0);
    let posZNoiseInit_0 = [p5.random(100), p5.random(100), p5.random(100)];
    let rNoiseInit_0 = [p5.random(10), p5.random(10), p5.random(10)];
    let posRNoiseInit_0 = [p5.random(100), p5.random(100), p5.random(100)];
    let posZNoiseThetaInit = p5.random(2 * p5.PI * p5.log(p5.PI));
    let rNoiseThetaInit = p5.random(2 * p5.log(p5.PI));
    let posRNoiseThetaInit = p5.random(0.5 * p5.PI);
    let posZNoiseStep = 0.1 / 7;
    let rNoiseStep = 0.01 / 2;
    let posRNoiseStep = 0.001 / 0.2;
    let posZNoiseSpeed = 0.004 / 2;
    let rNoiseSpeed = 0.004 / 2;
    let posRNoiseSpeed = 0.004 / 3;
    let hi = _minW / 1;
    p5.shuffle(paletteColors, true);
    _aryRing = [];
    for (let i = 0; i < numRing; i++) {
      let posZInit = hi / numRing * i;
      let posZNoiseInit = [posZNoiseInit_0[0], posZNoiseInit_0[1], posZNoiseInit_0[2] + posZNoiseStep * p5.cos(hi) * i];
      let rNoiseInit = [rNoiseInit_0[0], rNoiseInit_0[1], rNoiseInit_0[2] + rNoiseStep * i];
      let posRNoiseInit = [posRNoiseInit_0[0], posRNoiseInit_0[1], posRNoiseInit_0[2] + posRNoiseStep * i];

      _aryRing[i] = new Ring(p5, posXy, hi, posZInit, posZNoiseInit, posZNoiseThetaInit, posZNoiseSpeed, rNoiseInit, rNoiseThetaInit, rNoiseSpeed, posRNoiseInit, posRNoiseThetaInit, posRNoiseSpeed, paletteColors);
    }

    _aryRotate = [[p5.random(2 * p5.PI), p5.random(0.01)], [p5.random(2 * p5.PI), p5.random(0.01)], [p5.random(2 * p5.PI), p5.random(0.01)]];
  };

  const draw = (p5) => {
    p5.ortho(-p5.width / 2, p5.width / 2, -p5.height / 2, p5.height / 2, -_maxW, _maxW * p5.log(3.5));
    p5.background(bgColor); // Use the background color from the palette

    // Automatically rotate the scene
    p5.rotateX(p5.PI / 2 * p5.log(_maxW * rProg));
    p5.rotateY(p5.PI / rProg * p5.log(_maxW * rProg) * p5.cos(3));

    for (let i = 0; i < _aryRing.length; i++) {
      _aryRing[i].draw(p5);
    }
    rProg += 0.00001;
  };

  const updateColors = (p5) => {
    // Extract all colors from the selected palette
    paletteColors = [];
    let row = table.getRow(palette);
    for (let i = 0; i < row.arr.length; i += 3) {
      let r = row.getNum(i);
      let g = row.getNum(i + 1);
      let b = row.getNum(i + 2);
      paletteColors.push(p5.color(r, g, b)); // Create a color object from RGB values
    }

    // Set the background and stroke colors
    bgColor = paletteColors[0];
    strokeColor = paletteColors[1];

    adjustContrast(p5); // Ensure sufficient contrast
  };

  const adjustContrast = (p5) => {
    // Calculate the luminance of the background and stroke colors
    const bgLuminance = 0.299 * p5.red(bgColor) + 0.587 * p5.green(bgColor) + 0.114 * p5.blue(bgColor);
    const strokeLuminance = 0.299 * p5.red(strokeColor) + 0.587 * p5.green(strokeColor) + 0.114 * p5.blue(strokeColor);

    // Ensure sufficient contrast between the background and stroke colors
    if (p5.abs(bgLuminance - strokeLuminance) < 100) {
      if (bgLuminance > 128) {
        strokeColor = p5.color(0); // Use black for the stroke
      } else {
        strokeColor = p5.color(255); // Use white for the stroke
      }
    }
  };

  class Ring {
    constructor(p5, posXy, hi, posZInit, posZNoiseInit, posZNoiseThetaInit, posZNoiseSpeed, rNoiseInit, rNoiseThetaInit, rNoiseSpeed, posRNoiseInit, posRNoiseThetaInit, posRNoiseSpeed, palette) {
      this.p5 = p5;
      this.posXy = posXy;
      this.hi = hi;

      this.posZInit = posZInit;
      this.posZNoiseInit = posZNoiseInit;
      this.posZNoiseThetaInit = posZNoiseThetaInit;
      this.rNoiseInit = rNoiseInit;
      this.rNoiseThetaInit = rNoiseThetaInit;
      this.posRNoiseInit = posRNoiseInit;
      this.posRNoiseThetaInit = posRNoiseThetaInit;

      this.posZNoiseSpeed = posZNoiseSpeed;
      this.posZMax = hi / 2;
      this.posZMin = -this.posZMax;
      this.posZGap = this.posZMax - this.posZMin;
      this.posZNoiseFreq = 2;

      this.rNoiseSpeed = rNoiseSpeed;
      this.rMax = _minW / 4;
      this.rMin = this.rMax / 100;
      this.rGap = this.rMax - this.rMin;
      this.rNoiseFreq = 5;

      this.posRNoiseSpeed = posRNoiseSpeed;

      this.colNoiseFreq = 4;

      this.rotZ = p5.random(2 * p5.PI);

      this.palette = palette;
      this.aryCol = [];
      for (let i = 0; i < this.palette.length; i++) {
        this.aryCol[i] = this.palette[i]; // Use the color directly from the palette
      }

      this.numCol = this.aryCol.length;

      this.count = 0;
    }

    draw(p5) {
      let posZNoiseVal = p5.sin(this.posZNoiseThetaInit + 2 * p5.PI * p5.log(p5.PI / 2) * this.posZNoiseFreq *
        p5.noise(this.posZNoiseInit[0] + this.posZNoiseSpeed * this.count, this.posZNoiseInit[1] + this.posZNoiseSpeed * this.count, this.posZNoiseInit[2])) * 0.5 + 0.5;
      let posZ = this.posZInit + this.posZMin + this.posZGap * posZNoiseVal;

      let rNoiseVal = p5.sin(this.rNoiseThetaInit + 2 * p5.PI * this.rNoiseFreq *
        p5.noise(this.rNoiseInit[0] + this.rNoiseSpeed * this.count, this.rNoiseInit[1] + this.rNoiseSpeed * this.count, this.rNoiseInit[2])) * 0.5 + 0.5;
      let r = this.rMin + this.rGap * rNoiseVal;

      let colNoiseVal = p5.sin(this.posRNoiseThetaInit + 2 * p5.PI * this.colNoiseFreq *
        p5.noise(this.posRNoiseInit[0] + this.posRNoiseSpeed * this.count + 1000, this.posRNoiseInit[1] + this.posRNoiseSpeed * this.count + 1000, this.posRNoiseInit[2] + 1000)) * 0.5 + 0.5;
      let col_i1 = p5.int(colNoiseVal * this.numCol);
      let col_i2 = (col_i1 + 1) % this.numCol;
      let colAmp = (colNoiseVal - col_i1 / this.numCol) * this.numCol;
      let col = p5.lerpColor(this.aryCol[col_i1], this.aryCol[col_i2], colAmp);

      p5.push();
      p5.stroke(col);
      p5.translate(this.posXy.x, this.posXy.y, posZ - this.hi / 4);
      p5.rotateZ(this.rotZ);

      p5.ellipse(0, 0, r, r, 50);
      p5.pop();

      this.count++;
    }
  }

  return <Sketch preload={preload} setup={setup} draw={draw} />;
};

export default HeroAnimation;