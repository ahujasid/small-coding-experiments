// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { visible: false })


var points = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]

var circles = [];

var scale = 250;

var circleSize = 5;

function createCircles(){
  for (let i = 0; i < 72; i++) {
    const nodes: SceneNode[] = [];

    var circle = figma.createEllipse();
    circle.x = points[i][0];
    circle.y = points[i][1];
    circle.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];

    figma.currentPage.appendChild(circle);
    nodes.push(circle);
    circle.resize(circleSize,circleSize);

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    circles.push(circle);
  }
}

function moveCircles(){
  for (let i = 0; i < 72; i++) {
      circles[i].x = points[i][0]*scale;
      circles[i].y = points[i][1]*scale;
  }
}

function updatePoints(newPoints){
  points = newPoints;
}


createCircles();


var movingCircles = 
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {


  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-circles') {

    updatePoints(msg.updatedPoints)
    moveCircles();
   
  }

  // figma.closePlugin();
};
