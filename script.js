//Select Elements

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

//Addition
function add(a,b){
    return a+b;
}

//Subtraction
function subtract(a,b){
    return a-b;
}

//Multiplication
function multiply(a,b){
    return a*b;
}

//Division 
function divide(a,b){
    if(b === 0){
        throw new Error("Cannot divide by Zero");
    }
    return a/b;
}

//Modulus 
function modulus(a,b){
    if(b === 0){
        throw new Error("Cannot divide by Zero");
    }
    return a%b;
}


//Append value to display
function appendValue(value){
    display.value += value;
}

//Clear display
function clearDisplay(){
    display.value="";
}

//Removes the last entered character
function removeLastCharacter(){
    display.value = display.value.slice(0,-1);
}

//Expressions
function precedence(op){
    if (op === "+" || op === "-") 
        return 1;
    if (op === "*" || op === "/" || op === "%") 
    return 2;
    return 0;
}

function applyOp(a, b, op){
    switch (op){
        case "+": return add(a, b);
        case "-": return subtract(a, b);
        case "*": return multiply(a, b);
        case "/": return divide(a, b);
        case "%": return modulus(a, b);
        default: return 0;
    }
}

function toTokens(expr) {
    return expr.match(/\d+(\.\d+)?|[+\-*/%]/g);
}

function evaluateExpression(expr){
    const values = [];
    const ops = [];

    const tokens = toTokens(expr);
    if(!tokens) throw new Error("Invalid expression");

    for(let token of tokens){

        if(!isNaN(token)){
            values.push(parseFloat(token));
        }

        else{
            while(
                ops.length &&
                precedence(ops[ops.length - 1]) >= precedence(token)
            ) {
                const op = ops.pop();
                const b = values.pop();
                const a = values.pop();
                values.push(applyOp(a, b, op));
            }
            ops.push(token);
        }
    }

    while(ops.length){
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        values.push(applyOp(a, b, op));
    }

    return values[0];
}

//calculate result
function calculateResult(){
    const expr = display.value.trim();

    if(!expr){
        alert("Enter a calculation");
        return;
    }
    try{
        const result = evaluateExpression(expr);

        if(!isFinite(result)){
            throw new Error("Math error");
        }

        display.value = result;

    }catch(err){
        alert(err.message);
    }
}


//Button events
buttons.forEach( button => {
    button.addEventListener("click", ()=>{
        const value = button.dataset.value;

        if(button.id ==="clear"){
            clearDisplay();
        }

        else if(button.id ==="backspace"){
            removeLastCharacter();
        }

        else if(button.id === "equals"){
            calculateResult();
        }
        else{
            appendValue(value);
        }

    });
});

//Handles keyboard input and blocks invalid keys
document.addEventListener("keydown",(event) => {
    const key = event.key;
    const allowedkeys = [ 
        "0","1","2","3","4","5",
        "6","7","8","9","+","-",
        "*","/","%","Backspace",
        "Enter", "."        
     ];

     if(!allowedkeys.includes(key) && key.length === 1){
        event.preventDefault();
        alert("Only numbers and Operators are allowed");
        return;
     }
     

    if (/^[0-9+\-*/%.]$/.test(key)){
        appendValue(key);
    }

    //Backspace
    if(key === "Backspace"){
        removeLastCharacter();
    }

    //Enter
    if(key === "Enter"){
        event.preventDefault();
        calculateResult();
    }
});