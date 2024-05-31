class Rectangle {
  constructor(x, y, width, height, r, g, b) {
    this.x = x;
    this.baseY = y; // Store the initial y-coordinate
    this.y = y;
    this.width = width;
    this.height = height;
    this.originalColor = color(r, g, b); // Store the initial color
    this.color = this.originalColor; // Current color of the rectangle
  }

  // Set the color of the rectangle
  setColor(r, g, b) {
    this.color = color(r, g, b);
  }

  // Reset the color to the original color
  resetColor() {
    this.color = this.originalColor;
  }

  display(offset = 0) {
    fill(this.color);
    noStroke();
    push(); // Save the current transformation and style settings
    translate(0, offset); // Move the y-coordinate
    rect(this.x, this.baseY, this.width, this.height);
    pop(); // Restore the previous transformation and style settings
  }
}

class Car {
  constructor(rectangles) {
    this.rectangles = rectangles;
  }

  display(offset = 0) {
    for (let rectangle of this.rectangles) {
      rectangle.display(offset);
    }
  }
}

class YellowBlock {
  constructor(x, y, w, h, r, g, b) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color(r, g, b);
  }

  // Display the yellow block
  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

class SmallBlock {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

   // Display the small block
  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

class Light {
  constructor(rectangle) {
    this.rectangle = rectangle;
  }

  // Display the light
  display() {
    this.rectangle.display();
  }
}

const SMALL_BLOCK_SIZE = 12;
const SMALL_BLOCK_COLORS = [
  '#385799', // blue
  '#B23D2F', // red
  '#D5D5CB'  // white/gray
];

let yellowBlocks = [];
let smallBlocks = [];
let cars = [];
let lights = [];
let song; // Make a variate to hold the audio file
let fft; // Make a variate to hold the FFT object
let numBins = 128; //  Make a variate for the number of bins in the FFT object
let smoothing = 0.8; // Make a variable for the smoothing of the FFT
let button; // Button to control play/pause functionality
let drum;

// Load sound file before setup() function runs
function preload() {
  song = loadSound("audio/723287__migfus20__relaxing-jazz-music-loop.mp3");
  drum = loadSound("audio/599221__stoltingmediagroup__smg_sound_drum_kick_0919721660.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a new instance of p5.FFT() object
  fft = new p5.FFT(smoothing, numBins);
  song.connect(fft);

  createCars();
  createYellowBlocks();
  createLights();

  // Create play/pause button
  button = createButton("Play/Pause");
  button.position((width - button.width) / 2 + 60, height - button.height - 10);
  button.mousePressed(play_pause);
}

function draw() {
  background(242, 243, 239);

  // Get audio spectrum data
  if (song.isPlaying()) {
    let spectrum = fft.analyze();
    for (let i = 0; i < cars.length; i++) {
      // Calculate a separate offset for each car by mapping the spectrum values to the movement range
      let offset = map(spectrum[i], 0, 255, -150, 150);
      // Move and display each car based on the FFT offset
      cars[i].display(offset);
    }

    // Change the color of the lights based on the spectrum data
    for (let i = 0; i < lights.length; i++) {
      let r = 255;
      let g = map(spectrum[i], 0, 255, 255, 50);
      let b = 0;
      lights[i].rectangle.setColor(r, g, b);
    }
  } else {
    // If the song is not playing, display all cars in their initial positions
    for (let car of cars) {
      car.display(0); // Display each car without any offset
    }

    // Reset the color of all lights
    for (let light of lights) {
      light.rectangle.resetColor();
    }
  }

  // Display all yellow blocks
  for (let block of yellowBlocks) {
    block.display();
  }

  // Display all small blocks
  for (let block of smallBlocks) {
    block.display();
  }

  // Display all lights
  for (let light of lights) {
    light.display();
  }
}

function mousePressed() {
  // Check if a light was clicked when the mouse is pressed
  for (let light of lights) {
    let rect = light.rectangle;
    // Check if the mouse's X and Y coordinates are within the current light's rectangle area
    if (mouseX >= rect.x && mouseX <= rect.x + rect.width && mouseY >= rect.baseY && mouseY <= rect.baseY + rect.height) {
      if (!drum.isPlaying()) {
        drum.play();
      }
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createCars();
  createYellowBlocks();
  createLights();
  button.position((width - button.width) / 2 + 60, height - button.height - 10);
}

function createYellowBlocks() {
  yellowBlocks = [];
  smallBlocks = [];
  let scaleFactor = min(windowWidth / 715, windowHeight / 715);

  let horizontalLines = [
    { y: 15, w: 715, h: 15 },
    { y: 115, w: 715, h: 15 },
    { y: 250, w: 715, h: 15 },
    { y: 310, w: 715, h: 15 },
    { y: 405, w: 715, h: 15 },
    { y: 445, w: 715, h: 15 },
    { y: 485, w: 55, h: 15 },
    { x: 39, y: 515, w: 360, h: 15 },
    { y: 555, w: 55, h: 15 },
    { y: 615, w: 715, h: 15 },
    { y: 635, w: 55, h: 15 },
    { y: 675, w: 715, h: 15 },
    { y: 580, w: 85, h: 15, x: 615 }
  ];

  for (let line of horizontalLines) {
    let yellowBlock = new YellowBlock((line.x || 0) * scaleFactor, line.y * scaleFactor, line.w * scaleFactor, line.h * scaleFactor, 232, 210, 39);
    yellowBlocks.push(yellowBlock);
    createSmallBlocks(yellowBlock, 'horizontal');
  }

  let verticalLines = [
    { x: 15, h: 265 },
    { x: 40, h: 715 },
    { x: 80, h: 690 },
    { x: 155, h: 715 },
    { x: 385, h: 715 },
    { x: 410, h: 260 },
    { x: 410, y: 315, h: 400 },
    { x: 460, y: 325, h: 135 },
    { x: 615, h: 715 },
    { x: 640, h: 260 },
    { x: 665, h: 85 },
    { x: 665, y: 115, h: 200 },
    { x: 665, y: 460, h: 130 },
    { x: 690, h: 715 }
  ];

  for (let line of verticalLines) {
    let yellowBlock = new YellowBlock(line.x * scaleFactor, (line.y || 0) * scaleFactor, 15 * scaleFactor, line.h * scaleFactor, 232, 210, 39);
    yellowBlocks.push(yellowBlock);
    createSmallBlocks(yellowBlock, 'vertical');
  }

  let additionalBlocks = [
    { x: 85, y: 45, w: 75, h: 25 },
    { x: 85, y: 185, w: 75, h: 50 },
    { x: 110, y: 250, w: 30, h: 60 },
    { x: 85, y: 555, w: 80, h: 60 },
    { x: 200, y: 325, w: 50, h: 15 },
    { x: 615, y: 350, w: 80, h: 35 },
    { x: 615, y: 520, w: 80, h: 30 }
  ];

  for (let block of additionalBlocks) {
    let yellowBlock = new YellowBlock(block.x * scaleFactor, block.y * scaleFactor, block.w * scaleFactor, block.h * scaleFactor, 232, 210, 39);
    yellowBlocks.push(yellowBlock);
  }
}

function createSmallBlocks(yellowBlock, type) {
  let numberOfSmallBlocks = int(random(5, 10)); // Increase the random number of small blocks per yellow line
  let placedBlocks = [];
  let scaleFactor = min(windowWidth / 715, windowHeight / 715);

  for (let i = 0; i < numberOfSmallBlocks; i++) {
    let x, y;
    let attempts = 0;
    let maxAttempts = 100; // Max attempts to avoid infinite loops

    // Attempt to place the small block without overlapping
    do {
      if (type === 'horizontal') {
        x = random(yellowBlock.x, yellowBlock.x + yellowBlock.w - SMALL_BLOCK_SIZE * scaleFactor);
        y = yellowBlock.y + (yellowBlock.h - SMALL_BLOCK_SIZE * scaleFactor) / 2;
      } else if (type === 'vertical') {
        x = yellowBlock.x + (yellowBlock.w - SMALL_BLOCK_SIZE * scaleFactor) / 2;
        y = random(yellowBlock.y, yellowBlock.y + yellowBlock.h - SMALL_BLOCK_SIZE * scaleFactor);
      }

      var overlapping = false;
      for (let block of placedBlocks) {
        if (dist(x, y, block.x, block.y) < SMALL_BLOCK_SIZE * scaleFactor + 10) {
          overlapping = true;
          break;
        }
      }
      attempts++;
    } while (overlapping && (attempts < maxAttempts));

    // If no overlap, add the small block
    if (!overlapping) {
      let blockColor = color(random(SMALL_BLOCK_COLORS));
      let smallBlock = new SmallBlock(x, y, SMALL_BLOCK_SIZE * scaleFactor, blockColor);
      smallBlocks.push(smallBlock);
      placedBlocks.push({ x: x, y: y });
    }
  }
}

function createCars() {
  cars = [];
  let scaleFactor = min(windowWidth / 715, windowHeight / 715);

  let carData = [
    [
      { x: 470, y: 130, w: 70, h: 120, r: 66, g: 103, b: 185 },
      { x: 470, y: 170, w: 70, h: 55, r: 177, g: 61, b: 48 },
      { x: 490, y: 187, w: 33, h: 25, r: 225, g: 195, b: 11 }
    ],
    [
      { x: 185, y: 30, w: 55, h: 85, r: 178, g: 61, b: 46 },
      { x: 198, y: 50, w: 28, h: 26, r: 216, g: 216, b: 212 },
      { x: 185, y: 95, w: 55, h: 20, r: 216, g: 216, b: 212 }
    ],
    [
      { x: 201, y: 325, w: 55, h: 80, r: 227, g: 203, b: 24 },
      { x: 201, y: 345, w: 55, h: 60, r: 66, g: 103, b: 185 },
      { x: 211, y: 363, w: 34, h: 28, r: 227, g: 203, b: 24 }
    ],
    [
      { x: 495, y: 325, w: 75, h: 120, r: 178, g: 61, b: 46 },
      { x: 495, y: 429, w: 75, h: 17, r: 216, g: 216, b: 212 },
      { x: 512, y: 350, w: 42, h: 32, r: 216, g: 216, b: 212 }
    ],
    [
      { x: 290, y: 265, w: 50, h: 145, r: 232, g: 210, b: 39 },
      { x: 290, y: 340, w: 50, h: 35, r: 216, g: 216, b: 212 }
    ]
  ];

  // Create cars from car data
  for (let carRects of carData) {
    let rectangles = carRects.map(rect => new Rectangle(rect.x * scaleFactor, rect.y * scaleFactor, rect.w * scaleFactor, rect.h * scaleFactor, rect.r, rect.g, rect.b));
    cars.push(new Car(rectangles));
  }
}

function createLights() {
  lights = [];
  let scaleFactor = min(windowWidth / 715, windowHeight / 715);

  let lightData = [
    { x: 55, y: 480, w: 40, h: 40, r: 66, g: 103, b: 185 },
    { x: 54, y: 140, w: 40, h: 40, r: 66, g: 103, b: 185 },
    { x: 655, y: 80, w: 36, h: 25, r: 66, g: 103, b: 185 },
    { x: 630, y: 480, w: 38, h: 42, r: 66, g: 103, b: 185 },
    { x: 640, y: 140, w: 40, h: 40, r: 177, g: 61, b: 48 },
    { x: 630, y: 550, w: 38, h: 30, r: 177, g: 61, b: 48 },
    { x: 330, y: 675, w: 40, h: 40, r: 177, g: 61, b: 48 },
    { x: 95, y: 360, w: 60, h: 45, r: 177, g: 61, b: 48 },
    { x: 108, y: 30, w: 35, h: 85, r: 177, g: 61, b: 48 },
    { x: 650, y: 350, w: 20, h: 36, r: 177, g: 61, b: 48 },
    { x: 110, y: 200, w: 30, h: 20, r: 216, g: 216, b: 212 },
    { x: 115, y: 275, w: 20, h: 20, r: 216, g: 216, b: 212 },
    { x: 290, y: 310, w: 50, h: 15, r: 216, g: 216, b: 212 },
    { x: 108, y: 70, w: 35, h: 15, r: 216, g: 216, b: 212 },
    { x: 120, y: 570, w: 20, h: 20, r: 216, g: 216, b: 212 }
  ];

  for (let lightRect of lightData) {
    let rect = new Rectangle(lightRect.x * scaleFactor, lightRect.y * scaleFactor, lightRect.w * scaleFactor, lightRect.h * scaleFactor, lightRect.r, lightRect.g, lightRect.b);
    lights.push(new Light(rect));
  }
}

// Function to switch play/pause for the song
function play_pause() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.loop();
  }
}