const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

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

    if(display.value.trim()===""){
        return;
    }

    try{

        let exp = display.value;

        exp = exp.replace(/÷/g,"/");
        exp = exp.replace(/×/g,"*");

        let result = eval(exp);

        if(!Number.isFinite(result)){
            throw "Error";
        }

        result = Number(result.toFixed(8));

        addHistory(display.value,result);

        display.value = result;

    }catch(e){

        display.value = "Error";

    }

}

function addHistory(expression,result){

    if(historyList.firstElementChild &&
       historyList.firstElementChild.innerText==="No calculations yet."){

        historyList.innerHTML="";
    }

    const li=document.createElement("li");

    li.innerHTML=`${expression} = <b>${result}</b>`;

    historyList.prepend(li);

}

function copyResult(){

    navigator.clipboard.writeText(display.value);

    alert("Result Copied Successfully");

}

function toggleDarkMode(){

    document.body.classList.toggle("dark");

}

document.addEventListener("keydown",function(e){

    const key=e.key;

    if((key>="0" && key<="9") ||
       key==="+" ||
       key==="-" ||
       key==="*" ||
       key==="/" ||
       key==="." ||
       key==="%"){

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
