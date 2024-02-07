
figma.showUI(__html__, { visible: false });



figma.ui.onmessage = (message) => {

  var xReceived = parseFloat(message[0]);
  var yReceived = parseFloat(message[1]);
  var speed = 100;
  var yIncrement = speed*yReceived;

  const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

  var xIncrement = map(xReceived, 0,1,-1,1)*speed;
  var yIncrement = map(yReceived, 0,1,1,-1)*speed;

  console.log(xIncrement, " ", yIncrement);

if(xReceived < 1 && xReceived > 0 && yReceived > 0 && yReceived < 1){
  figma.viewport.center = {x: xIncrement+figma.viewport.center.x, y: yIncrement+figma.viewport.center.y};
}

}
