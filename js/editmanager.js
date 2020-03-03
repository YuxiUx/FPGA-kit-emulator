//manager or garbage collection? :P
function EditManager(editor, id, runtime, io, hwmanager) {
    this.io = io;
    this.editor = editor;
    this.text = "";
    this.runtime = runtime;
    this.name = null;
    this.project = {};
    this.hwmanager = hwmanager;
    this._tex = document.getElementById(id);
    this.storage =  new YStorage("vhdl-storage");
    this.update = () =>{
        this.editor.save();
        this.text = this._tex.value;
    };
    this.updateProject = () => {
        this.update();
        this.project.name = this.name;
        this.project.config = this.runtime.config;
        this.project.code = this.text;
    };
    this.getFileName = () => {
        if(!this.name) {
            this.name = prompt("Save file as (select name)", "untitled");
        }
        if(this.name) {
            this.project.name = this.name;
            return this.name;
        }
        return "untitled";
    };
    this.SaveFile = ()=>{
        this.update();
        this.storage.file.save(`${this.getFileName()}.vhdl`, this.text, "application/octet-stream"); //for sure?
    };
    this.SaveProject = ()=>{
        this.updateProject();
        this.storage.file.save(`${this.getFileName()}.json`, JSON.stringify(this.project), "application/json")
    };
    this.SaveLocal = ()=>{
        this.updateProject();
        this.storage.local.save("project", JSON.stringify(this.project));
    };
    this.Run = ()=>{
        this.update();
        this.runtime.compile(this.text);
        this.runtime.runCode();
    };
    this.overrideText = (text) => {
        this.text = text;
        this.editor.setValue(text);
    };
    this.NetworkOpenDialog = () => {
        let file = prompt("Enter file url");
        if(!file) return;
        this.NetworkOpen(file);
    };
    this.NetworkOpen = (url) => {
        let request = this._createCORSRequest("get", url);
        request.onload  = this._networkHandle;
        request.onerror = (c) => {
            console.log(c);
            alert("Error while loading file\nProbably cross-origin policy. Gonna fix this latter.");
        };
        request.send();

    };
    this._networkHandle = (call) => {
        if(call.target.responseURL.endsWith(".json")) {
            this.OpenProject(call.target.response);
        } else {
            this.OpenFile(call.target.response);
        }
    };
    this.Open = (e) => {
        let file = e.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        if(file.name.endsWith(".json")) {
            reader.onload = (e) => {this.OpenProject(e.target.result);};
        } else {
            reader.onload = (e) => {this.OpenFile(e.target.result);};
        }
        reader.readAsText(file);
    };
    this.OpenProject = (text)=>{
        this.project = JSON.parse(text);
        this.load();
    };
    this.OpenFile = (text)=>{
        this.overrideText(text);
        this.project.code = text;
    };
    this.Restore = () => {
        this.project = JSON.parse(this.storage.local.open("project"));
        this.load();
    };
    this.load = () => {
        this.hwmanager.reset();
        this.runtime.config = this.project.config;
        this.name = this.project.name;
        this.overrideText(this.project.code);
        this.hwmanager.update();
    };
    this._createCORSRequest = (method, url) => { //polyfill
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR has 'withCredentials' property only if it supports CORS
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") { // if IE use XDR
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }
    this.autoOpen = ()=> {
        let url = new URLSearchParams(window.location.search);
        if(url) {
            this.NetworkOpen(decodeURIComponent(url.get("open")));
        }
    }
}