/*
 * subscriber format {
 *     name : name of listener/can be used to unsubscribe/optional
 *     events : "all" | ["array of", "properties", "to watch"]
 *     callback: function
 * }
 */
function IO() {
    this.interface = {
        "CA"   : {"type":"output", "value": 1},
        "CB"   : {"type":"output", "value": 1},
        "CC"   : {"type":"output", "value": 1},
        "CD"   : {"type":"output", "value": 1},
        "CE"   : {"type":"output", "value": 1},
        "CF"   : {"type":"output", "value": 1},
        "CG"   : {"type":"output", "value": 1},
        "DP"   : {"type":"output", "value": 1},

        "AN3"  : {"type":"output", "value": 1},
        "AN2"  : {"type":"output", "value": 1},
        "AN1"  : {"type":"output", "value": 1},
        "AN0"  : {"type":"output", "value": 1},

        "BTNL" : {"type":"input",  "value": 0},
        "BTNR" : {"type":"input",  "value": 0},
        "BTNU" : {"type":"input",  "value": 0},
        "BTND" : {"type":"input",  "value": 0},
        "BTNC" : {"type":"input",  "value": 0},

        "SW0"  : {"type":"input",  "value": 0},
        "SW1"  : {"type":"input",  "value": 0},
        "SW2"  : {"type":"input",  "value": 0},
        "SW3"  : {"type":"input",  "value": 0},
        "SW4"  : {"type":"input",  "value": 0},
        "SW5"  : {"type":"input",  "value": 0},
        "SW6"  : {"type":"input",  "value": 0},
        "SW7"  : {"type":"input",  "value": 0},
        "SW8"  : {"type":"input",  "value": 0},
        "SW9"  : {"type":"input",  "value": 0},
        "SW10" : {"type":"input",  "value": 0},
        "SW11" : {"type":"input",  "value": 0},
        "SW12" : {"type":"input",  "value": 0},
        "SW13" : {"type":"input",  "value": 0},
        "SW14" : {"type":"input",  "value": 0},
        "SW15" : {"type":"input",  "value": 0},

        "LD0"  : {"type":"output", "value": 0},
        "LD1"  : {"type":"output", "value": 0},
        "LD2"  : {"type":"output", "value": 0},
        "LD3"  : {"type":"output", "value": 0},
        "LD4"  : {"type":"output", "value": 0},
        "LD5"  : {"type":"output", "value": 0},
        "LD6"  : {"type":"output", "value": 0},
        "LD7"  : {"type":"output", "value": 0},
        "LD8"  : {"type":"output", "value": 0},
        "LD9"  : {"type":"output", "value": 0},
        "LD10" : {"type":"output", "value": 0},
        "LD11" : {"type":"output", "value": 0},
        "LD12" : {"type":"output", "value": 0},
        "LD13" : {"type":"output", "value": 0},
        "LD14" : {"type":"output", "value": 0},
        "LD15" : {"type":"output", "value": 0}
    };
    this.onHwChange = [];
    this.onChange = [];
    this.interface.emitChange = (prop, value) => {
        this.onChange.forEach((v)=>{
            if(v.events === "all" || (v.events.indexOf(prop) > -1))
                v.callback(prop, value);
        });
    };
    this.interface.emitHwChange = (prop, value) => {
        this.onHwChange.forEach((v)=>{
            if(v.events === "all" || (v.events.indexOf(prop) > -1))
                v.callback(prop, value);
        });
    };
    this._boardHandler = {
        set(obj, prop, value) {
            if(obj.hasOwnProperty(prop)) {
                if(obj[prop].type === "input") {
                    //if(obj[prop].value != value) {
                        obj[prop].value = value;
                        obj.emitChange(prop, value);
                    //}
                }
                else {
                    console.log(`HW err: attempt to change output port value '${prop}' to '${value}'`);
                }
            } else console.log(`HW err: attempt to change value of undefined port '${prop}'`);
        }
    };
    this._softHandler = {
        set(obj, prop, value) {
            if(obj.hasOwnProperty(prop)) {
                if(obj[prop].type === "output") {
                    //if(obj[prop].value != value) {
                        obj[prop].value = value;
                        obj.emitHwChange(prop, value);
                    //}
                }
                else {
                    console.log(`SW err: attempt to change input '${prop}' value to '${value}'`);
                }
            } else console.log(`SW err: attempt to change value of undefined port '${prop}'`);
        }
    };

    this.hwio = new Proxy(this.interface, this._boardHandler);
    this.swio = new Proxy(this.interface, this._softHandler);
}