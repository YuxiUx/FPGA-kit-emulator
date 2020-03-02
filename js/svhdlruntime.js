function SVhdlRuntime(io) {
    this.io = io;
    this.config = {};
    this.config.variable = {};
    this.code = [];
    this._commads = [["and", "&&"],["xor", "^"], ["or", "||"], ["not","!"], ["<=","="]];
    /*this.transpileNM = (cm) => {
        if(this._commads.hasOwnProperty(cm))
            return this._commads[cm];
        if(this.config.variable.hasOwnProperty(cm))
            return this.config.variable[cm];
        else return -1;
    };*/
    this.compile = (src) => {
        this.code = src.split("\n");
        let v;
        for (let i = 0; i < this.code.length; i++) {
            v = " "+this.code[i]+" ";
            v = v.replace(/--.*/g, ""); //rm comments
            v = v.replace(/[^a-zA-Z0-9 ()!&|_;<>=]/g, " "); //rm unwanted characters
            this._commads.forEach((cmd) => {  //translate commands
                v = v.replace(new RegExp(`${cmd[0]}`, "gi"), cmd[1]);
            });
            for (k in this.config.variable) {   //translate variables
                if (this.config.variable.hasOwnProperty(k)) {
                    v = v.replace(new RegExp(` ${k} `, "g"), `runtime_${this.config.variable[k].code}`);
                }
            }
            this.code[i] = v;
        }
    };
    this.runLine = (n) => { // lol this is terrible
        for(k in this.config.variable) {
            if(this.config.variable.hasOwnProperty(k)) {
                eval(`runtime_${this.config.variable[k].code} = ${this.io[this.config.variable[k].code].value};`);
            }
        }
        eval(this.code[n]);
        for(k in this.config.variable) {
            if(this.config.variable.hasOwnProperty(k)) {
                if(this.io[this.config.variable[k].code].type == "output")
                eval(`this.io[this.config.variable[k].code] = runtime_${this.config.variable[k].code};`);
            }
        }
    };
    this.runCode = ()=>{
        for(let i = 0; i < this.code.length; i++) {
            this.runLine(i);
        }
    };
    this.events = "all";
    this.callback = this.runCode;
}