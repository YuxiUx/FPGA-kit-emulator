function RnTokenizer(source) {
    this.src = source;
    this.tokens = [];
    this.type = {
        "INTEGER" : "INTEGER",
        "OPERATOR": "OPERATOR",
        "VARIABLE": "VARIABLE",
        "UNKNOWN" : "UNKNOWN",
        "BRACKET_BEGIN" : "BRACKET_BEGIN",
        "BRACKET_END"   : "BRACKET_END",
        "ASSIGNMENT"    : "ASSIGNMENT",
        "SEMICOLON"     : "SEMICOLON"
    };
    this.tpoint = 0;
    this.done = false;
    this.type.EOF = this.src.EOF;
    this.operator = {
        "and" : {
            fn:(a,b)=>{return a && b;},
            nb :1,
            na :1
        },
        "nand": {
            fn:(a,b)=>{return !(a && b);},
            nb :1,
            na :1
        },
        "or"  : {
            fn:(a,b)=>{return a || b;},
            nb :1,
            na :1
        },
        "nor" : {
            fn:(a,b)=>{return !(a || b);},
            nb :1,
            na :1
        },
        "xor" : {
            fn:(a,b)=>{return (a && !b)||(!a && b);},
            nb :1,
            na :1
        },
        "xnor": {
            fn:(a,b)=>{return !((a && !b)||(!a && b));},
            nb :1,
            na :1
        },
        "not" : {
            fn:(a)=>{return !a;},
            na :1,
            nb :0
        }
    };
    this.variable = {};
    this.skipWhitespace = () => {
        while (this.src.char !== this.src.EOF && /\s/.test(this.src.char)) {
            this.src.GetChar();
        }
    };
    this.INTEGER = () => {
        let res = [];
        while (this.src.char !== this.src.EOF && /[0-9]/.test(this.src.char)) {
            res.push(this.src.char);
            this.src.GetChar();
        }
        return res.join("");
    };
    this.TERM = () => {
        let res = [];
        while (this.src.char !== this.src.EOF && /[a-zA-Z0-9_]/.test(this.src.char)) {
            res.push(this.src.char);
            this.src.GetChar();
        }
        return res.join("");
    };
    this.GetNext = () => { //caching system
        if(this.done) {
            if(this.tokens.length>this.tpoint) {
                this.tpoint++;
                return this.tokens[this.tpoint-1];
            }
            return new RnToken(this.type.EOF, null);
        } else  {
            let l = this._GetNext();
            this.tokens.push(l);
            return l;
        }
    };
    this._GetNext = () => {
        while (this.src.char !== this.src.EOF) {
           if(/\s/.test(this.src.char)) {
               this.skipWhitespace();
               continue;
           }
           if(/[0-9]/.test(this.src.char)) {
                return new RnToken(this.type.INTEGER, this.INTEGER())
           }
           if(/[a-zA-Z]/.test(this.src.char)) {
               let trm = this.TERM();
               if(this.operator.hasOwnProperty(trm))
                   return new RnToken(this.type.OPERATOR, trm);
               if(this.variable.hasOwnProperty(trm))
                   return new RnToken(this.type.VARIABLE, trm);
               this.error(new RnToken(this.type.UNKNOWN, trm));
           }
           if(this.src.char === "(") {
               this.src.GetChar();
               return new RnToken(this.type.BRACKET_BEGIN, "(");
           }
           if(this.src.char === ")") {
               this.src.GetChar();
               return new RnToken(this.type.BRACKET_END, ")");
           }
            if(this.src.char === ";") {
                this.src.GetChar();
                return new RnToken(this.type.SEMICOLON, ";");
            }
           if(this.src.char === "<") {
               if(this.src.GetChar() === "=") {
                   this.src.GetChar();
                   return new RnToken(this.type.ASSIGNMENT, "<=");
               }
               this.src.StepBack();
           }
           if(this.src.char === "-") {
               if(this.src.GetChar() === "-") {
                   this.src.SkipLine();
                   continue;
               }
               this.src.StepBack();
           }
           this.error(`Something weird near to "${this.src.char}"`);
        }
        this.done = true;
        return new RnToken(this.type.EOF, null);
    };
    this.error = (token)=> {
        con.err(`Syntax error on ${this.src}: ${token}`);
        throw "SyntaxErrorTokenizer";
    };
    this.SetSource = (source)=> {
        this.tokens = [];
        this.src = source;
        this.done = false;
        this.src.GetChar(); //first
    };
}