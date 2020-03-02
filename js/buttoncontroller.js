function ButtonController(parent, io, structure, onColor="rgba(255,255,0,0.5)", offColor="transparent") {
    this.io = io;
    this.onColor = onColor;
    this.offColor = offColor;
    this._parent = document.getElementById(parent);
    this._node = {};
    this._handlerUP = (a) => {
        this.io[a.target.name] = 0;
    };
    this._handlerDOWN = (a) => {
        this.io[a.target.name] = 1;
    };
    structure.forEach((line)=>{
        line.forEach((btn)=>{
            let nd = document.createElement("button");
            nd.className = "btn";
            nd.innerHTML = btn.symbol;
            nd.name = btn.name;
            nd.onmousedown = this._handlerDOWN;
            nd.onmouseup = this._handlerUP;
            this._parent.appendChild(nd);
            this._node[btn.name] = nd;
        });
        this._parent.appendChild(document.createElement("br"));
    });
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