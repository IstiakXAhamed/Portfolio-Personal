var canvas = document.querySelector("#wrapper-canvas");

var dimensions = {
  width: window.innerWidth,
  height: window.innerHeight,
};

Matter.use("matter-attractors");
Matter.use("matter-wrap");

// Theme-aware color scheme
function getThemeColors() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  
  if (theme === 'light') {
    return {
      particle1: '#e2e8f0',
      particle2: '#cbd5e0',
      particle3: '#a0aec0',
      particle4: '#718096',
      stroke: '#4a5568'
    };
  } else {
    return {
      particle1: '#222222',
      particle2: '#333333',
      particle3: '#444444',
      particle4: '#27292d',
      stroke: '#000000'
    };
  }
}

let currentTheme = getThemeColors();

function runMatter() {
  // module aliases
  var Engine = Matter.Engine,
    Events = Matter.Events,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Common = Matter.Common,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Bodies = Matter.Bodies;

  // create engine
  var engine = Engine.create();

  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;
  engine.world.gravity.scale = 0.1;

  // create renderer
  var render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      showVelocity: false,
      width: dimensions.width,
      height: dimensions.height,
      wireframes: false,
      background: "transparent",
    },
  });

  // create runner
  var runner = Runner.create();

  // Runner.run(runner, engine);
  // Render.run(render);

  // create demo scene
  var world = engine.world;
  world.gravity.scale = 0;

  // create a body with an attractor
  var attractiveBody = Bodies.circle(
    render.options.width / 2,
    render.options.height / 2,
    Math.max(dimensions.width / 25, dimensions.height / 25) / 2,
    {
      render: {
        fillStyle: `#000`,
        strokeStyle: `#000`,
        lineWidth: 0,
      },

      isStatic: true,
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            };
          },
        ],
      },
    }
  );

  World.add(world, attractiveBody);

  // add some bodies that to be attracted
  for (var i = 0; i < 60; i += 1) {
    let x = Common.random(0, render.options.width);
    let y = Common.random(0, render.options.height);
    let s =
      Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
    let poligonNumber = Common.random(3, 6);
    var body = Bodies.polygon(
      x,
      y,
      poligonNumber,
      s,

      {
        mass: s / 20,
        friction: 0,
        frictionAir: 0.02,
        angle: Math.round(Math.random() * 360),
        render: {
          fillStyle: currentTheme.particle1,
          strokeStyle: currentTheme.stroke,
          lineWidth: 2,
        },
      }
    );

    World.add(world, body);

    let r = Common.random(0, 1);
    var circle = Bodies.circle(x, y, Common.random(2, 8), {
      mass: 0.1,
      friction: 0,
      frictionAir: 0.01,
      render: {
        fillStyle: r > 0.3 ? currentTheme.particle4 : currentTheme.particle3,
        strokeStyle: currentTheme.stroke,
        lineWidth: 2,
      },
    });

    World.add(world, circle);

    var circle = Bodies.circle(x, y, Common.random(2, 20), {
      mass: 6,
      friction: 0,
      frictionAir: 0,
      render: {
        fillStyle: r > 0.3 ? currentTheme.particle3 : currentTheme.particle1,
        strokeStyle: currentTheme.stroke,
        lineWidth: 4,
      },
    });

    World.add(world, circle);

    var circle = Bodies.circle(x, y, Common.random(2, 30), {
      mass: 0.2,
      friction: 0.6,
      frictionAir: 0.8,
      render: {
        fillStyle: currentTheme.particle2,
        strokeStyle: currentTheme.stroke,
        lineWidth: 3,
      },
    });

    World.add(world, circle);
  }

  // add mouse control
  var mouse = Mouse.create(render.canvas);

  Events.on(engine, "afterUpdate", function () {
    if (!mouse.position.x) return;
    // smoothly move the attractor body towards the mouse
    Body.translate(attractiveBody, {
      x: (mouse.position.x - attractiveBody.position.x) * 0.12,
      y: (mouse.position.y - attractiveBody.position.y) * 0.12,
    });
  });

  // return a context for MatterDemo to control
  let data = {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
    play: function () {
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);
    },
  };

  Matter.Runner.run(runner, engine);
  Matter.Render.run(render);
  return data;
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function setWindowSize() {
  let dimensions = {};
  dimensions.width = $(window).width();
  dimensions.height = $(window).height();

  m.render.canvas.width = $(window).width();
  m.render.canvas.height = $(window).height();
  return dimensions;
}

let m = runMatter();
setWindowSize();
$(window).resize(debounce(setWindowSize, 250));

// Function to update Matter.js colors when theme changes
window.updateMatterColors = function(theme) {
  currentTheme = getThemeColors();
  
  if (m && m.engine && m.engine.world) {
    const bodies = Matter.Composite.allBodies(m.engine.world);
    bodies.forEach(body => {
      if (body.render && body.render.fillStyle) {
        // Update body colors based on current fillStyle pattern
        const currentFill = body.render.fillStyle;
        
        if (currentFill.includes('#222') || currentFill.includes('#e2e')) {
          body.render.fillStyle = currentTheme.particle1;
        } else if (currentFill.includes('#333') || currentFill.includes('#cbd')) {
          body.render.fillStyle = currentTheme.particle2;
        } else if (currentFill.includes('#444') || currentFill.includes('#a0a')) {
          body.render.fillStyle = currentTheme.particle3;
        } else if (currentFill.includes('#272') || currentFill.includes('#718')) {
          body.render.fillStyle = currentTheme.particle4;
        }
        
        body.render.strokeStyle = currentTheme.stroke;
      }
    });
  }
};
