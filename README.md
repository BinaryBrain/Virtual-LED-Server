# Virtual LED Server

# :warning: **DEPRECATED** :warning:

This whole tool is now part of https://github.com/BinaryBrain/Rpi-SK6812-ws2812b-RGBW-http-server

<hr>

This is an express server that exposes an API to drive virtual RGBW LED strips in your browser.

It can be used as a dummy server for [Rpi-SK6812-ws2812b-RGBW-http-server](https://github.com/BinaryBrain/Rpi-SK6812-ws2812b-RGBW-http-server).

## Software Install

Run the server with:

```sh
npm install
npm start
```

## API

### HTTP

Do an HTTP POST with this JSON body:

```json
{
    "colors": [
        { "r": 255, "g": 255, "b": 255, "w": 255 },
        { "r": 255, "g": 0, "b": 0, "w": 0 },
        { "r": 0, "g": 255, "b": 0 },
        { "r": 0, "g": 0, "b": 255 },
        { "r": 0, "g": 0, "b": 0, "w": 255 }
    ]
}
```

Or this JSON body:

```json
{
    "colors": [
        "FF995522",
        "FF9955",
        "FF995500",
    ]
}
```

_Note that the "white" value is optionnal. It will default to 0._
_With as many element in the array as your LED strip is. Usually 30, **60** or 120 LED/m._

### UDP

The UDP server runs on port `13334` by default.

First byte is header: 0x03 for RGB, 0x04 for RGBW. Rest is payload, each byte is a color value.

For instance:

```
Head R    G    B    R    G    B   
0x03 0xFF 0x99 0x55 0xFF 0x99 0x55
```

```
Head R    G    B    W    R    G    B    W   
0x04 0xFF 0x99 0x55 0x22 0xFF 0x99 0x55 0x22
```

You can also send a JSON on UDP.
If the first character is a curly bracket (`{`) it will behave like the HTTP API.

```json
{"colors": ["FF9955", "FF9955FF"]}
```

## curl Example

```sh
curl -X POST \
  http://<raspberry-ip-address>:13334 \
  -H 'Content-Type: application/json' \
  -d '{ "colors": [{"r": 255, "g": 255, "b": 255, "w": 255}]}'
```

## What we send to ws281x lib

Each line is an UInt32.

### RGBW

```
2^ | 3 2 1 0
i+ | - 0 1 2
---+--------
0  | - r g b
1  | - w r g
2  | - b w r
3  | - g b w
4  | - r g b
5  | - w r g
6  | - b w r
7  | - g b w
```

### GRBW

```
2^ | 3 2 1 0
i+ | - 0 1 2
---+--------
0  | - g r b
1  | - w g r
2  | - b w g
3  | - r b w
4  | - g r b
5  | - w g r
6  | - b w g
7  | - r b w
```
