function RnToken(type, value) {
    this.type = type;
    this.value = value;
    this.toString = ()=>{
        return `Token(${this.type}, ${this.value})`;
    };
    this.in = (match) => {
        return match.indexOf(this.type)>-1;
    };
}