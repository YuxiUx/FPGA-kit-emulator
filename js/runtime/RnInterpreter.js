function RnInterpreter(io, source ="") {
    this.io = io;
    this.src = new RnFile(source);
    this.tokenizer = new RnTokenizer(this.src);
    this.config = {};
    this.token = null;
    this._t = this.tokenizer.type;
    this.config.variable = {};
    this.compile = (source) => {
        this.src.SetSource(source);
        this.tokenizer.SetSource(this.src);
        this.tokenizer.variable = this.config.variable;
        this.tokens = [];
    };
    this.eat = (type) => {
        if(this.token.in(type)) {
            this.token = this.tokenizer.GetNext();
            return;
        }
        this.unexpected(this.token, type);
    };
    this.error = (token, expected = null) => {
        con.err(`Error on ${this.src}: ${token} ${expected?expected:""}`);
        throw "SyntaxErrorInterpreter";
    };
    this.unexpected = (token, expected) => {
        this.error(token, `expected ${expected}`);
    };
    this.getVal = (bracket=0) => {
        let a = this.token;
        this.eat([this._t.VARIABLE, this._t.OPERATOR, this._t.INTEGER, this._t.BRACKET_BEGIN]);
        let aVal = null;
        switch(a.type) {
            case this._t.OPERATOR:
                if(this.tokenizer.operator[a.value].nb !== 0) this.unexpected(this.token, "unary operator, const, or var");
                //this.eat(this._t.OPERATOR);
                aVal = this.tokenizer.operator[a.value].fn(this.getVal(bracket));
                break;
            case this._t.INTEGER:
                aVal = a.value;
                break;
            case this._t.VARIABLE:
                aVal = this.io[this.config.variable[a.value].code].value;
                break;
            case this._t.BRACKET_BEGIN:
                aVal = this.evaluate(bracket+1);
                break;
        }
        return aVal;
    };
    this.evaluate = (bracket = 0) => {
        console.log("wval",this.token, bracket);
        let out = this.getVal(bracket);
        let expect = bracket?this._t.BRACKET_END:this._t.SEMICOLON;
        while (!this.token.in(expect)) {
            console.log("while ",this.token, bracket);
            let operator = this.token;
            this.eat(this._t.OPERATOR);
            let val = this.getVal(bracket);
            out = this.tokenizer.operator[operator.value].fn(out, val);
        }
        this.eat(expect);
        return out;
    };
    this.Run = () => {
        this.tokenizer.tpoint = 0;
        this.token = this.tokenizer.GetNext();
        while (this.token.type !== this._t.EOF) {
            let tok = this.token;
            this.eat(this._t.VARIABLE);   //output variable
            this.eat(this._t.ASSIGNMENT); //<=
            if(this.config.variable.hasOwnProperty(tok.value)) {
                this.io[this.config.variable[tok.value].code] = this.evaluate();
            } else {
                this.error(`Undefined variable ${tok.value}`);
            }
        }
    };
    //register
    this.events = "all";
    this.callback = this.Run;
}