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
        if(this.name == "") {
            this.name = prompt("Save file as (select name)", "untitled");
        }
        return this.name ? this.name : "untitled";
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
    }
}