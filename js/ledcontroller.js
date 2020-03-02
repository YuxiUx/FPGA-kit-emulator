function LedController(parent, count, io, onColor="yellow", offColor="transparent") {
    this.onColor = onColor;
    this.offColor = offColor;
    this.io = io;
    this._n = count;
    this._parent = document.getElementById(parent);
    this._node = {};
    for(let i = this._n; i >= 0; i--) {
        let nd = document.createElement("span");
        nd.className = "led-container";
        nd.innerText = `D${i}`;
        let li = document.createElement("span");
        li.className = "led";
        this._parent.appendChild(nd);
        nd.appendChild(li);
        this._node[`LD${i}`] = li;
    }
    this.gColor = (val) => {return val?this.onColor:this.offColor};
    this.ReDraw = () => {
        for(let key in this._node) {
            if(this._node.hasOwnProperty(key))
                this.Update(key);
        }
    };
    this.Update = (name) => {
        if(this.io.hasOwnProperty(name) && this._node.hasOwnProperty(name)) {
            this._node[name].style.background = this.gColor(this.io[name].value);
        }
    };
    this.ReDraw();
    //subscribe
    this.events = Object.keys(this._node);
    this.callback = this.Update;
}