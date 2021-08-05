const ws = new WebSocket("ws://" + location.host + "/");
let NB_LED = 100;

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
            NB_LED = config.leds;
            break;
        }
    
        case 'render': {
            const pixels = json.data;
            render(pixels)
            break;
        }
    }
}

ws.addEventListener('open', (event) => {
    ws.send(JSON.stringify({ cmd: "hi" }));
});

function render(pixels) {
    // TODO
    console.log(pixels);
}
