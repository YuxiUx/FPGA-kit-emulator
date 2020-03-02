function SwitchController(parent, count, io) {
    this.io = io;
    this._n = count;
    this._parent = document.getElementById(parent);
    this._node = {};
    this._handler = (a) => {
        this.io[a.target.name] = a.target.checked;
    };
    for(let i = this._n; i >= 0; i--) {
        let nd = document.createElement("span");
        nd.className = "swi-container";
        nd.innerText = `S${i}`;
        let sw = document.createElement("input");
        sw.className = "switch";
        sw.type = "checkbox";
        sw.name = `SW${i}`;
        sw.onchange = this._handler;
        this._parent.appendChild(nd);
        nd.appendChild(sw);
        this._node[`SW${i}`] = sw;
    }
    this.ReDraw = () => {
        for(let key in this._node) {
            if(this._node.hasOwnProperty(key))
                this.Update(key);
        }
    };
    this.Update = (name) => {
        if(this.io.hasOwnProperty(name) && this._node.hasOwnProperty(name)) {
            this._node[name].checked = this.io[name].value;
        }
    };
    this.ReDraw();
    //subscribe
    this.events = Object.keys(this._node);
    this.callback = this.Update;
}