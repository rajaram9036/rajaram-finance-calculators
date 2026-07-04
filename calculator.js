/* ======================================
   Rajaram Finance Calculators
   calculator.js - Part 1
====================================== */

let memory = 0;
let lastAnswer = 0;

const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

function press(value){

    display.value += value;

    updateMini();

}

function clearDisplay(){

    display.value = "";

    updateMini();

}

function backspace(){

    display.value = display.value.slice(0,-1);

    updateMini();

}

function calculate(){

    if(display.value.trim()=="") return;

    try{

        let expression = display.value;

        expression = expression.replace(/×/g,"*");

        expression = expression.replace(/÷/g,"/");

        let result = eval(expression);

        if(!isFinite(result)){

            throw "Math Error";

        }

        result = Number(result.toFixed(10));

        addHistory(display.value,result);

        lastAnswer = result;

        display.value = result;

        updateMini();

    }

    catch(e){

        display.value = "Error";

    }

}

function addHistory(exp,result){

    if(historyList.innerHTML.includes("No calculations")){

        historyList.innerHTML="";

    }

    let li=document.createElement("li");

    li.innerHTML="<b>"+exp+"</b> = "+result;

    historyList.prepend(li);

}

function updateMini(){

    let mini=document.getElementById("miniDisplay");

    if(mini){

        mini.innerHTML=display.value;

    }

}
/* ======================================
   Scientific Functions - Part 2
====================================== */

function squareRoot(){

    if(display.value=="") return;

    try{

        let value=parseFloat(display.value);

        if(value<0){

            display.value="Error";

            return;

        }

        let result=Math.sqrt(value);

        result=Number(result.toFixed(10));

        addHistory("√("+value+")",result);

        lastAnswer=result;

        display.value=result;

        updateMini();

    }catch(e){

        display.value="Error";

    }

}

function square(){

    if(display.value=="") return;

    try{

        let value=parseFloat(display.value);

        let result=value*value;

        result=Number(result.toFixed(10));

        addHistory(value+"²",result);

        lastAnswer=result;

        display.value=result;

        updateMini();

    }catch(e){

        display.value="Error";

    }

}

function power(){

    let base=prompt("Enter Base Number");

    if(base===null) return;

    let exponent=prompt("Enter Power");

    if(exponent===null) return;

    base=parseFloat(base);

    exponent=parseFloat(exponent);

    let result=Math.pow(base,exponent);

    result=Number(result.toFixed(10));

    addHistory(base+"^"+exponent,result);

    lastAnswer=result;

    display.value=result;

    updateMini();

}

function inverse(){

    if(display.value=="") return;

    let value=parseFloat(display.value);

    if(value===0){

        display.value="Error";

        return;

    }

    let result=1/value;

    result=Number(result.toFixed(10));

    addHistory("1/"+value,result);

    lastAnswer=result;

    display.value=result;

    updateMini();

}

function insertAns(){

    display.value+=lastAnswer;

    updateMini();

}

function insertPi(){

    display.value+=Math.PI.toFixed(10);

    updateMini();

}
/* ======================================
   Memory Functions - Part 3
====================================== */

function memoryClear(){

    memory = 0;

    alert("Memory Cleared");

}

function memoryRecall(){

    display.value += memory;

    updateMini();

}

function memoryAdd(){

    let value = parseFloat(display.value);

    if(isNaN(value)) value = 0;

    memory += value;

    addHistory("M+ " + value, memory);

}

function memorySubtract(){

    let value = parseFloat(display.value);

    if(isNaN(value)) value = 0;

    memory -= value;

    addHistory("M- " + value, memory);

}

function memoryStore(){

    let value = parseFloat(display.value);

    if(isNaN(value)) value = 0;

    memory = value;

    addHistory("MS " + value, memory);

}

function memoryStatus(){

    alert("Current Memory : " + memory);

}

/* ======================================
   Extra Utilities
====================================== */

function percent(){

    if(display.value=="") return;

    let value=parseFloat(display.value);

    value=value/100;

    value=Number(value.toFixed(10));

    display.value=value;

    lastAnswer=value;

    addHistory("Percent",value);

    updateMini();

}

function changeSign(){

    if(display.value=="") return;

    let value=parseFloat(display.value);

    value=value*(-1);

    display.value=value;

    updateMini();

}
/* ======================================
   PDF, Print, Copy, Dark Mode
   calculator.js - Part 4
====================================== */

function copyResult(){

    if(display.value==""){

        alert("Nothing to copy.");

        return;

    }

    navigator.clipboard.writeText(display.value);

    alert("Result copied successfully.");

}

function clearHistory(){

    historyList.innerHTML="<li>No calculations yet.</li>";

}

function toggleDarkMode(){

    document.body.classList.toggle("dark");

}

function printHistory(){

    let content="<h2>Calculation History</h2><hr>";

    let items=document.querySelectorAll("#historyList li");

    items.forEach(function(item){

        content+="<p>"+item.innerHTML+"</p>";

    });

    let win=window.open("","","width=800,height=700");

    win.document.write(content);

    win.document.close();

    win.print();

}

async function downloadPDF(){

    if(typeof window.jspdf==="undefined"){

        alert("jsPDF library not found.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc=new jsPDF();

    doc.setFont("helvetica");

    doc.setFontSize(18);

    doc.text("Rajaram Finance Calculators",20,20);

    doc.setFontSize(14);

    doc.text("Calculation History",20,32);

    doc.setFontSize(10);

    doc.text("Generated: "+new Date().toLocaleString(),20,40);

    let y=55;

    const items=document.querySelectorAll("#historyList li");

    if(items.length===0){

        doc.text("No calculation history available.",20,y);

    }else{

        items.forEach(function(item,index){

            doc.text((index+1)+". "+item.innerText,20,y);

            y+=10;

            if(y>280){

                doc.addPage();

                y=20;

            }

        });

    }

    doc.save("Calculation-History.pdf");

}

/* ======================================
   History Date & Time
====================================== */

function addHistory(exp,result){

    if(historyList.innerHTML.includes("No calculations")){

        historyList.innerHTML="";

    }

    const now=new Date();

    const time=now.toLocaleString();

    let li=document.createElement("li");

    li.innerHTML=
    "<b>"+exp+"</b> = <b>"+result+
    "</b><br><small>"+time+"</small>";

    historyList.prepend(li);

}
/* ======================================
   Keyboard Support & Final
   calculator.js - Part 5
====================================== */

document.addEventListener("keydown",function(e){

const key=e.key;

// Numbers
if((key>="0" && key<="9")){
press(key);
}

// Operators
if(key==="+" || key==="-" || key==="*" || key==="/" || key==="." || key==="%"){
press(key);
}

// Brackets
if(key==="(" || key===")"){
press(key);
}

// Enter = Calculate
if(key==="Enter"){
e.preventDefault();
calculate();
}

// Backspace
if(key==="Backspace"){
backspace();
}

// Escape = AC
if(key==="Escape"){
clearDisplay();
}

});

/* ===========================
   Prevent Invalid Expression
=========================== */

function isValidExpression(exp){

try{

exp=exp.replace(/×/g,"*");
exp=exp.replace(/÷/g,"/");

Function('"use strict";return ('+exp+')')();

return true;

}catch{

return false;

}

}

/* ===========================
   Auto Focus
=========================== */

window.onload=function(){

display.focus();

updateMini();

};

/* ===========================
   Welcome Message
=========================== */

console.log("Rajaram Finance Calculators Loaded Successfully");

/* ===========================
   Version
=========================== */

const calculatorVersion="1.0 Premium Casio Edition";

console.log(calculatorVersion);
