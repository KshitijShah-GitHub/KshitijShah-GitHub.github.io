// Get canvas from html
var canvas = document.getElementById('nn_anim');
var c = canvas.getContext('2d');  // get context for canvas

//LOWER CASE CONSTANTS INCOMING, KEEP CALM
// Set useful scaling constants
const canvasWidthRatio = 0.7;  // Canvas width to window width ratio
const canvasHeightRatio = 1.3;  // Canvas height to window height ratio
const cLShiftRatio = (1 - canvasWidthRatio)/2;  // Canvas hshift rel window
const cTShiftRatio = 0.30;  // Canvas vshift rel window height

// Set standard colors
const blue = "rgba(33, 133, 197, 1)";
const white = "rgba(255, 255, 255, 0.8)";
const halfwhite = "rgba(255, 255, 255, 0.3)";

// Set some relative size variables
var windowWidth = $(window).width();  // Window width
var windowHeight = $(window).height();  // Window height
var canvasWidth = windowWidth * canvasWidthRatio;  // Width of canvas
var canvasHeight = windowHeight * canvasHeightRatio;  // Height of Canvas
var cSideShift = windowWidth * cLShiftRatio;  // Shift of Canvas from left
var cTopShift = windowHeight * cTShiftRatio;  // Shift of Canvas from top

// Set quanitity constants for nodes
const numNodes = 25;  // number of generated moving nodes
const r = 4;  // radius of each node
const startang = 0; // init angle (radians)
const endang = 2*Math.PI; // end angle for full circle (radians)
const rotdir = false; // draw counterclockwiae bool
const nodeGenBoxRatio = 0.9;

// Initialize some variables for node control
var nodeArray = [];
var convx = 0.5*canvasWidth; // convergence point on scroll (x)
var convy = canvasHeight - 2*r; // convergence point on scroll (y)
var runAnimation = true;
var x, y, dx, dy;
var converging = false;
var converged = false;

var isMobile;

// Set initial values for sizing
init();
remake_nodes();  // Make initial nodes
animate();  // run animation if runAnimation is true

// Initial settings for canvas sizes
function init() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    if (windowWidth < 760) {
        isMobile = true;
    }
    $(canvas).css('top', cTopShift);
    $(canvas).css('left', cSideShift);
}

// Redo calculations and sizing on window resize
$(window).resize(function () {
    windowWidth = $(window).width();
    windowHeight = $(window).height();
    canvasWidth = windowWidth * canvasWidthRatio;
    canvasHeight = windowHeight * canvasHeightRatio;
    cSideShift = windowWidth * cLShiftRatio;
    cTopShift = windowHeight * cTShiftRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    $(canvas).css('left', cSideShift);
    $(canvas).css('top', cTopShift);

    convx = 0.5*canvasWidth; // convergence point on scroll (x)
    convy = canvasHeight - r;

    if (isMobile === false) {
        runAnimation = false;
        nodeArray = [];
        c.clearRect(0, 0, canvasWidth, canvasHeight);
        remake_nodes();
    }
})

// Remake all Nodes
function remake_nodes() {
    runAnimation = false;
    nodeArray = [];
    for (var i = 0; i < numNodes; i++){
        x = (Math.random()*(canvasWidth - 2*r)) + r; // cur x
        y = (Math.random()*(windowHeight - 2*r)) + r; // cur y
        dx = (Math.random() - 0.5)*canvasWidth/250; // velocity of h motion
        dy = (Math.random() - 0.5)*canvasHeight/250; // velocity of v motion
        nodeArray.push(new Node(x, y, r, dx, dy))
    }
    runAnimation = true;
}

// Run node animation
function animate() {
    requestAnimationFrame(animate);  // recursion with js func
    if (runAnimation === true) {
        c.clearRect(0, 0, canvasWidth, canvasHeight);
        // Draw all the lines first so nodes appear over lines
        for (var i = 0; i < numNodes; i++) {
            nodeArray[i].update();
            drawLines(nodeArray[i].x, nodeArray[i].y, i);
        }
        for (var i = 0; i < numNodes; i++) {
            nodeArray[i].drawNodes();
        }
    }
}

// Function to draw lines between nodes
function drawLines(x, y, index) {
    c.lineWidth = 0.5;
    for (var i = index; i < numNodes; i += 3) {
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(nodeArray[i].x, nodeArray[i].y);
        c.strokeStyle = halfwhite;
        c.stroke();
    }
}

// Node class to generate nodes
function Node(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.holdx = x;
    this.holdy = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;

    this.drawNodes = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, startang, endang, rotdir);
        c.fillStyle = blue;
        c.fill();
    }
    this.update = function() {
        if ((this.x + this.r) > canvasWidth || (this.x - this.r) < 0) {
            this.dx = -this.dx;
        }
        if ((this.y + this.r) > canvasHeight || (this.y - this.r) < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
        if (converging === false && converged === false){
            this.holdx = this.x;
            this.holdy = this.y;
        }
    }
}

function converge(scale) {
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    let ratio = scale;
    for (var i = 0; i < numNodes; i++) {
        let node = nodeArray[i];
        node.x = ((ratio) * (convx - node.holdx)) + node.holdx;
        node.y = ((ratio) * (convy - node.holdy)) + node.holdy;
        if (converged === false) {
            drawLines(node.x, node.y, i)
        }
        node.drawNodes();
    }
}

$(window).scroll(function() {
    let position = $(this).scrollTop();
    let convergeCompletion;
    let convStart = nodeGenBoxRatio*windowHeight;
    let convEnd = (canvasHeight);
    let opacity = -1*(((position - 0.8*windowHeight)/(windowHeight)) - 1);
    let stropacity = opacity.toString()

    if ((opacity >= 0) && (position < (canvasHeight + cTopShift))) {
        $('.nn_animation').css('opacity', stropacity);
    }
    else {
        $('.nn_animation').css('opacity', '0');
    }

    if (position < convEnd && position > convStart) {
        runAnimation = false;
        convergeCompletion = -1*(position - convStart)/(convStart - convEnd);
        converging = true;
        converged = false;
        converge(convergeCompletion);
    }
    if (position <= convStart) {
        convergeCompletion = 0;
        runAnimation = true;
        if (converged === true) {
            converged = false;
        }
        converging = false;
    }
    if (position >= convEnd) {
        convergeCompletion = 1;
        runAnimation = false;
        converging = false;
        converged = true;
        converge(convergeCompletion)
    }
})
