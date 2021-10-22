const ws = new WebSocket("ws://" + location.host + "/");
let NB_LED = 20;
const colors = [];

const leds = [];

const CIRCLE_RADIUS = 250;

ws.onmessage = (evt) => {
    const msg = evt.data
    const json = JSON.parse(msg);

    if (!json.cmd) {
        console.error("Invalid message recieved");
        return;
    }

    switch (json.cmd) {
        case 'configure': {
            const config = json.data;
            configure(config);
            break;
        }

        case 'render': {
            const newColors = json.data;
            render(newColors)
            break;
        }
    }
}

ws.addEventListener('open', (event) => {
    ws.send(JSON.stringify({ cmd: "hi" }));
});

function render(newColors) {
    /*
    for (let i = 0; i < newColors.length; i += 4) {
         [i / 4] = {
            r: newColors[i],
            g: newColors[i + 1],
            b: newColors[i + 2],
            w: newColors[i + 3],
        }

        if (lights[i / 4]) {
            lights[i / 4].color = colors[i / 4];
            lightsMats[i / 4].emissive = colors[i / 4];
        }
    }
     */
}

function configure(config) {
    NB_LED = config.leds;

    console.log(config);
}

const lights = [];

let app;
let container;

init();

function init() {

    app = new PIXI.Application({ backgroundColor: 0x1099bb });
    document.getElementById('webgl').appendChild(app.view);

    container = new PIXI.Container();
    app.stage.addChild(container);

    const texture = PIXI.Texture.from('/static/led.png');
    texture.defaultAnchor.x = 0.5;
    texture.defaultAnchor.y = 0.5;
    console.log(texture);

    for (let i = 0; i < NB_LED; i++) {
        const led = new PIXI.Sprite(texture);
        const led_percent = i / NB_LED;
        const led_rad = 2 *led_percent * Math.PI;
        led.x = 400 + Math.cos(led_rad) * CIRCLE_RADIUS;
        led.y = 300 + Math.sin(led_rad) * CIRCLE_RADIUS;
        led.rotation = led_rad;
        leds[i] = led;
        container.addChild(led);
    }

    const brt = new PIXI.BaseRenderTexture(0, 0, PIXI.SCALE_MODES.LINEAR, 1);
    const rt = new PIXI.RenderTexture(brt);

    const sprite = new PIXI.Sprite(rt);

    sprite.x = 0;
    sprite.y = 0;
    app.stage.addChild(sprite);

    /*
     * All the bunnies are added to the container with the addChild method
     * when you do this, all the bunnies become children of the container, and when a container moves,
     * so do all its children.
     * This gives you a lot of flexibility and makes it easier to position elements on the screen
     */
    container.x = 0;
    container.y = 0;

    app.ticker.add(() => {
        app.renderer.render(container, rt);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < NB_LED; i++) {
        const led = leds[i];
        // led.rotation += 0.05;
    }

    app.renderer.render(container);
}
