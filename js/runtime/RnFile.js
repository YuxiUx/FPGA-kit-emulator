function RnFile(source) {
    this.line = 0;
    this.pos = -1;
    this.char = "";
    this.EOF = "_EOF_";
    this._length = 0;
    this.SetSource = (source) => {
        this._text = source;
        this._maxIndex = this._text.length-1;
        this.line = 0;
        this.pos = -1;
        this.char = "";
    };
    this.ResetCursor = () => {
        this.line = 0;
        this.pos = -1;
        this.char = "";
    };
    this.GetChar = () => {
        if(this.pos>=this._maxIndex) {
            this.line++;
            this.char = this.EOF;
            return this.EOF;
        }
        this.pos++;
        this.char = this._text[this.pos];
        if(this.char == "\n") {
            this.line++;
        }
        return this.char;
    };
    this.StepBack = () => {
        if(this.pos<-1) {
            this.line--;
            return "";
        }
        this.pos--;
        this.char = this._text[this.pos];
        if(this.char == "\n") {
            this.line--;
        }
        return this.char;
    };
    this.SkipLine = () => {
        let lin = this.line;
        while (this.line === lin) {
            this.GetChar();
        }
    };
    this.toString = () => {
        return `Line ${this.line+1}`;
    };
    this.SetSource(source);
}