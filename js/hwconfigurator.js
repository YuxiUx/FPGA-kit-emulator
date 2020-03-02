function HwConfigurator(parent, io, runtime) {
    this.io = io;
    this.runtime = runtime;
    this._parent = document.getElementById(parent);
    this._node = {};
    this._nodeC = {};
    this._map = {};
    this._handle = (cel) => {
        this.ChName(cel.target.name, cel.target.value.trim());
    };
    let nd = document.createElement("table");
    nd.className = "hwcfgy";
    nd.innerHTML = "<tr><th>Port name</th><th>Type</th><th>D.Value</th><th>Name</th><th>Active</th></tr>"; //like a pig :D
    for(let port in this.io.interface) {
        if(this.io.interface.hasOwnProperty(port) && typeof this.io.interface[port] == "object") {
            let tr = document.createElement("tr");
            nd.appendChild(tr);

            let td1 = document.createElement("td");
            tr.appendChild(td1);
            td1.innerText = port;

            let td2 = document.createElement("td");
            tr.appendChild(td2);
            td2.innerText = this.io.interface[port].type;

            let td3 = document.createElement("td");
            tr.appendChild(td3);
            td3.innerText = this.io.interface[port].value;

            let td4 = document.createElement("td");
            tr.appendChild(td4);
            let inp = document.createElement("input");
            inp.placeholder = "Mapped name";
            inp.name = port;
            inp.onchange = this._handle;
            td4.appendChild(inp);
            this._node[port] = inp;

            let td5 = document.createElement("td");
            tr.appendChild(td5);
            let ch = document.createElement("input");
            ch.type="checkbox";
            ch.disabled = true;
            ch.checked = false;
            td5.appendChild(ch);
            this._nodeC[port] = ch;
        }
    }
    this._parent.appendChild(nd);
    this.ChName = (port, name) => {
        if(this.runtime.config.variable.hasOwnProperty(name) && this.runtime.config.variable[name] != port) {
            alert(`Name "${name}" is already used for port "${this.runtime.config.variable[name].code}"`);
            return;
        }
        delete this.runtime.config.variable[this._map[port]];
        if(name != "") {
            if(typeof run.config.variable[name] == "undefined")
                this.runtime.config.variable[name] = {};
            this.runtime.config.variable[name].code = port;
        }
        this._map[port] = name;
        this._nodeC[port].checked = name != "";
    };
}