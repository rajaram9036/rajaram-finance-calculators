function calculateMath(){

let num1 = parseFloat(document.getElementById("num1").value);
let num2 = parseFloat(document.getElementById("num2").value);
let op = document.getElementById("operation").value;

let answer = "";
let formula = "";

if(op=="+" ){

answer = num1 + num2;
formula = num1 + " + " + num2;

}

else if(op=="-"){

answer = num1 - num2;
formula = num1 + " - " + num2;

}

else if(op=="*"){

answer = num1 * num2;
formula = num1 + " × " + num2;

}

else if(op=="/"){

if(num2==0){

answer = "Cannot divide by zero";

}else{

answer = num1 / num2;

}

formula = num1 + " ÷ " + num2;

}

else if(op=="%"){

answer = (num1 * num2) / 100;
formula = num2 + "% of " + num1;

}

else if(op=="square"){

answer = num1 * num1;
formula = num1 + "²";

}

else if(op=="sqrt"){

answer = Math.sqrt(num1);
formula = "√" + num1;

}

else if(op=="power"){

answer = Math.pow(num1,num2);
formula = num1 + "^" + num2;

}

document.getElementById("result").innerHTML = answer;

document.getElementById("formula").innerHTML = formula;

}

function resetCalculator(){

document.getElementById("num1").value="";

document.getElementById("num2").value="";

document.getElementById("operation").selectedIndex=0;

document.getElementById("result").innerHTML="0";

document.getElementById("formula").innerHTML="Waiting...";

}
