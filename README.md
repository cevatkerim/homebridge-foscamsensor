# homebridge-foscamsensor

[![npm version](https://badge.fury.io/js/homebridge-foscamsensor.svg)](https://badge.fury.io/js/homebridge-foscamsensor)

Motion sensor plugin for [Homebridge](https://github.com/nfarina/homebridge).

This plugin is heavily influenced by the work of [SphtKr](https://github.com/SphtKr) [homebridge-filesensor](https://github.com/SphtKr/homebridge-filesensor).

This plugin creates a motion sensor accessory based on reading the log file of the foscam ip camera. Currently I only tested this with FI8918W.


## Configuration

| Key | Description |
| --- | --- |
| `ip` | Ip address of the camera ip:port |
| `interval` | How many milliseconds it should query the camera log |
| `user` | Username for the camera. |
| `pwd` | Password for the camera. |


Enjoy!

Kerim Incedayi