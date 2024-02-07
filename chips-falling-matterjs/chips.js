window.addEventListener("load",init);




function init(){
    var body = document.querySelector("body");
   // module aliases
    var Engine = Matter.Engine;
    var Render = Matter.Render;
    var Runner = Matter.Runner;
    var Bodies = Matter.Bodies;
    var Composite = Matter.Composite;
    var Mouse = Matter.Mouse;
    var Events = Matter.Events;
    var MouseConstraint = Matter.MouseConstraint;


    // create a Matter.js engine
    var engine = Engine.create();

    var globalWidth = 600;
    var globalHeight = 400;

    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: globalWidth,
            height: globalHeight,
            wireframes: false
        }
    });
    

    // Create references for each chip and its corresponding body
    const chipElements = document.querySelectorAll('.chip');
    const chipBodies = Array.from(chipElements).map(chip => {
        const width = chip.offsetWidth;
        const height = chip.offsetHeight;
        const body = Bodies.rectangle(Math.random()*100 + 300, Math.random()*100 + 100, width, height, { render: { visible: false } }); // Set body rendering to false
        return { body: body, element: chip };
    });

    // Add the bodies to the world
    chipBodies.forEach(chip => Composite.add(engine.world, chip.body));
    
    const groundHeight = 20; // You can adjust the ground height
    const ground = Bodies.rectangle(globalWidth / 2, globalHeight - groundHeight / 2, globalWidth, groundHeight, { isStatic: true, label: 'ground' });
    const wallThickness = 20; // Thickness of the walls
    const leftWall = Bodies.rectangle(wallThickness / 2, globalHeight / 2, wallThickness, globalHeight, { isStatic: true });
    const rightWall = Bodies.rectangle(globalWidth - wallThickness / 2, globalHeight / 2, wallThickness, globalHeight, { isStatic: true });
    const topWall = Bodies.rectangle(globalWidth / 2, wallThickness / 2, globalWidth, wallThickness, { isStatic: true });

    // add all of the bodies to the world
    // Composite.add(engine.world, bodies);
    Composite.add(engine.world, [ground, leftWall, rightWall, topWall]);

    


    // Add mouse control
    const mouse = Mouse.create(render.element),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    
    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;


       // Update the position of the div elements on each engine update
    Events.on(engine, 'afterUpdate', function() {
        chipBodies.forEach(chip => {
            const { body, element } = chip;
            const angleDegrees = body.angle * (180 / Math.PI);
            element.style.transform = `translate(${body.position.x - (element.offsetWidth / 2)}px, ${body.position.y - (element.offsetHeight / 2)}px) rotate(${angleDegrees}deg)`;
        });
    });


    // run the engine
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
}