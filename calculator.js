const display = document.getElementById("display");

function press(value){
    display.value += value;
}

function clearDisplay(){
    display.value = "";
}

function backspace(){
    display.value = display.value.slice(0,-1);
}

function calculate(){

    if(display.value===""){
        return;
    }

    try{

        let exp = display.value;

        // Calculator Symbols को JavaScript Symbols में बदलें
        exp = exp.replace(/÷/g,"/");
        exp = exp.replace(/×/g,"*");

        let result = eval(exp);

        // दशमलव होने पर 6 अंकों तक दिखाएँ
        if(Number.isFinite(result)){
            display.value = Number(result.toFixed(6)).toString();
    
        addHistory(exp, result);
        }else{
            display.value = "Error";
        }

    }catch(e){

        display.value = "Error";

    }

}

// Keyboard Support
document.addEventListener("keydown",function(e){

    const key = e.key;

    if(
        (key>="0" && key<="9") ||
        key==="+" ||
        key==="-" ||
        key==="*" ||
        key==="/" ||
        key==="." ||
        key==="%"
    ){
        press(key);
    }

    if(key==="Enter"){
        e.preventDefault();
        calculate();
    }

    if(key==="Backspace"){
        backspace();
    }

    if(key==="Escape"){
        clearDisplay();
    }

});
function copyResult(){

navigator.clipboard.writeText(display.value);

alert("Result Copied!");

}

function toggleDarkMode(){

document.body.classList.toggle("dark");

}

function addHistory(exp,result){

let list=document.getElementById("historyList");

if(list.children.length==1 &&
list.children[0].innerText=="No calculations yet."){

list.innerHTML="";

}

let li=document.createElement("li");

li.innerHTML=exp+" = <b>"+result+"</b>";

list.prepend(li);

}
