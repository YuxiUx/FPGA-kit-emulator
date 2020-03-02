function DisplayController(parent, count, io, onColor="yellow", offColor="transparent") {
    this.io = io;
    this._n = count;
    this.onColor = onColor;
    this.offColor = offColor;
    this._parent = document.getElementById(parent);
    this._node = {};
    let ptr = ["CA","CB","CC","CD","CE","CF","CG","DP"];
    for(let i = this._n; i >= 0; i--) {
        this._node[`AN${i}`] = new Digit(parent, this.io, {"cn" : ptr, "an" : `AN${i}`}, this.onColor, this.offColor);
    }
    this.ReDraw = () => {
        for(let key in this._node) {
            if(this._node.hasOwnProperty(key))
                this._node[key].ReDraw();
        }
    };
    this.Update = (name) => {
        if(this.io.hasOwnProperty(name)) {
            for(let key in this._node) {
                this._node[key].Update(name);
            }
        }
    };
    this.ReDraw();
    //subscribe
    this.events = Object.keys(this._node).concat(ptr);
    this.callback = this.Update;
}

function Digit(parent, io, controls, onColor, offColor, backColor="rgb(32, 34, 37)", segDA = 50, segDB = 10) {
    this.io = io;
    this._parent = document.getElementById(parent);
    this.anode = controls.an;
    this.seg   = controls.cn;
    this.onColor = onColor;
    this.offColor = offColor;
    this.backColor = backColor;
    this.segDA = segDA>segDB?segDA:segDB;
    this.segDB = segDA>segDB?segDB:segDA;
    this.pad   = Math.round(this.segDA/10);
    this._node = {};
    this._sg = [
        [this.segDB,this.segDA,this.pad,this.pad],                      //top
        [this.segDA,this.segDB,this.segDA-this.pad,this.pad],            //right1
        [this.segDA,this.segDB,this.segDA-this.pad,this.segDA+this.pad], //right2
        [this.segDB,this.segDA,this.pad,(this.segDA*2)+this.pad],       //bottom
        [this.segDA,this.segDB,this.pad,this.segDA+this.pad],            //left1
        [this.segDA,this.segDB,this.pad,this.pad],                       //left2
        [this.segDB,this.segDA,this.pad,this.segDA+this.pad]            //middle
    ];
    //create graphic
    let nd = document.createElement("div");
    nd.className = "digit";
    nd.style.height = `${Math.round(this.segDA*2.6)}px`;
    nd.style.width  = `${Math.round(this.segDA*1.4)}px`;
    nd.style.background = this.backColor;
    nd.style.border = "1px solid black";
    this._sg.forEach((v,k)=>{
        let seg = document.createElement("div");
        seg.style.height = `${v[0]}px`;
        seg.style.width  = `${v[1]}px`;
        seg.style.left   = `${v[2]}px`;
        seg.style.top    = `${v[3]}px`;
        seg.style.border = "1px solid black";
        seg.className    = "segment";
        nd.appendChild(seg);
        this._node[this.seg[k]] = seg;
    });
    let dp = document.createElement("div");
    dp.style.height = `${this.segDB}px`;
    dp.style.width  = `${this.segDB}px`;
    dp.style.borderRadius = "100%";
    dp.style.right  = `${this.pad}px`;
    dp.style.bottom = `${this.pad}px`;
    dp.style.border = "1px solid black";
    dp.className    = "segment";
    nd.appendChild(dp);
    this._node[this.seg[7]] = dp;
    this._parent.appendChild(nd);
    this.shine = (name) => {
        return this.io[this.anode].value == 0 && this.io[name].value == 0;
    };
    this.gColor = (value) => {
        return value?this.onColor:this.offColor;
    };
    this.ReDraw = () => {
        for(let key in this._node) {
            if(this._node.hasOwnProperty(key))
                this.Update(key);
        }
    };
    this.Update = (name) => {
        if(this.io.hasOwnProperty(name) && this._node.hasOwnProperty(name)) {
            this._node[name].style.background = this.gColor(this.shine(name));
        } else if(this.anode === name) {
            this.ReDraw();
        }
    };
    this.ReDraw();
}
