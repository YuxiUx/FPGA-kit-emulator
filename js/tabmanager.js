function TabManager() {
    this._tabs = {};
    this.Add = (id)=>{
        this._tabs[id] = document.getElementById(id);
        document.getElementById(`${id}-tab`).onclick = this._handle;
    };
    this._handle = (cel) => {
        this.switch(cel.target.id.replace(/-tab$/g, ""));
    };
    this.switch = (name="default") => {
        for(let n in this._tabs) {
            if(this._tabs.hasOwnProperty(n)) {
                this._tabs[n].style.display = "none";
            }
        }
        this._tabs[name].style.display = "block";
    }
}