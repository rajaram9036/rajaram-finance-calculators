/*=========================================
 Rajaram Finance Calculators
 SIP Calculator
 Part 1
=========================================*/

"use strict";

/*=============================
 INPUTS
=============================*/

const sipAmount = document.getElementById("sipAmount");
const returnRate = document.getElementById("returnRate");
const years = document.getElementById("years");
const sipDate = document.getElementById("sipDate");

/*=============================
 RANGE SLIDERS
=============================*/

const sipSlider = document.getElementById("sipSlider");
const returnSlider = document.getElementById("returnSlider");
const yearSlider = document.getElementById("yearSlider");

/*=============================
 RESULT IDS
=============================*/

const totalInvestment =
document.getElementById("totalInvestment");

const estimatedReturns =
document.getElementById("estimatedReturns");

const maturityAmount =
document.getElementById("maturityAmount");

const grandTotal =
document.getElementById("grandTotal");

/*=============================
 BUTTONS
=============================*/

const calculateBtn =
document.getElementById("calculateBtn");

const resetBtn =
document.getElementById("resetBtn");

const pdfBtn =
document.getElementById("downloadPDF");

const copyBtn =
document.getElementById("copyResult");

const shareBtn =
document.getElementById("shareResult");

const saveBtn =
document.getElementById("saveHistory");

const themeBtn =
document.getElementById("themeBtn");

/*=============================
 FORMAT MONEY
=============================*/

function formatMoney(value){

return new Intl.NumberFormat("en-IN",{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}).format(value);

}

/*=============================
 SYNC SLIDERS
=============================*/

sipSlider.oninput = function(){

sipAmount.value = this.value;

calculateSIP();

}

returnSlider.oninput = function(){

returnRate.value = this.value;

calculateSIP();

}

yearSlider.oninput = function(){

years.value = this.value;

calculateSIP();

}

sipAmount.oninput = function(){

sipSlider.value = this.value;

calculateSIP();

}

returnRate.oninput = function(){

returnSlider.value = this.value;

calculateSIP();

}

years.oninput = function(){

yearSlider.value = this.value;

calculateSIP();

}

/*=============================
 DEFAULT VALUES
=============================*/

sipAmount.value = 5000;

returnRate.value = 12;

years.value = 20;

sipSlider.value = 5000;

returnSlider.value = 12;

yearSlider.value = 20;
/*=========================================
 SIP Calculator
 Part 2
 Calculation Engine
=========================================*/

//=============================
// CALCULATE SIP
//=============================

function calculateSIP(){

const P = Number(sipAmount.value);

const annualRate = Number(returnRate.value);

const year = Number(years.value);

const monthlyRate = annualRate / 12 / 100;

const months = year * 12;

// Total Investment

const invested = P * months;

// SIP Formula

let maturity = 0;

if(monthlyRate > 0){

maturity = P *

(((Math.pow(1 + monthlyRate, months) - 1)

/ monthlyRate)

* (1 + monthlyRate));

}else{

maturity = invested;

}

const returns = maturity - invested;

//=============================
// UPDATE RESULTS
//=============================

totalInvestment.innerHTML =

formatMoney(invested);

estimatedReturns.innerHTML =

formatMoney(returns);

maturityAmount.innerHTML =

formatMoney(maturity);

grandTotal.innerHTML =

formatMoney(maturity);

//=============================
// PERCENTAGE
//=============================

const investPercent =

document.getElementById("investPercent");

const returnPercent =

document.getElementById("returnPercent");

if(investPercent){

investPercent.innerHTML =

((invested/maturity)*100).toFixed(1)+"%";

}

if(returnPercent){

returnPercent.innerHTML =

((returns/maturity)*100).toFixed(1)+"%";

}

//=============================
// UPDATE CHART
//=============================

updateChart(

invested,

returns,

maturity

);

//=============================
// UPDATE TABLE
//=============================

generateProjection(

P,

annualRate,

year

);

}

//=============================
// BUTTON EVENTS
//=============================

calculateBtn.addEventListener(

"click",

calculateSIP

);

resetBtn.addEventListener(

"click",

function(){

sipAmount.value=5000;

returnRate.value=12;

years.value=20;

sipSlider.value=5000;

returnSlider.value=12;

yearSlider.value=20;

calculateSIP();

}

);

//=============================
// AUTO LOAD
//=============================

window.addEventListener(

"load",

calculateSIP

);
/*=========================================
 SIP Calculator
 Part 3
 Charts + Projection Table
=========================================*/

let growthChart;
let allocationChart;

//=========================================
// UPDATE CHARTS
//=========================================

function updateChart(invested, returns, maturity){

//-------------------------------
// LINE CHART
//-------------------------------

const growthCanvas=document.getElementById("growthChart");

if(growthCanvas){

if(growthChart){

growthChart.destroy();

}

growthChart=new Chart(growthCanvas,{

type:"line",

data:{

labels:["Start","5 Years","10 Years","15 Years","20 Years"],

datasets:[{

label:"Portfolio Value",

data:[

0,

maturity*0.18,

maturity*0.43,

maturity*0.72,

maturity

],

borderColor:"#1565C0",

backgroundColor:"rgba(21,101,192,.12)",

fill:true,

borderWidth:3,

pointRadius:5,

pointBackgroundColor:"#1565C0",

tension:.4

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:true

}

},

animation:{

duration:1200

}

}

});

}

//-------------------------------
// DONUT CHART
//-------------------------------

const pieCanvas=document.getElementById("allocationChart");

if(pieCanvas){

if(allocationChart){

allocationChart.destroy();

}

allocationChart=new Chart(pieCanvas,{

type:"doughnut",

data:{

labels:[

"Investment",

"Returns"

],

datasets:[{

data:[

invested,

returns

],

backgroundColor:[

"#1565C0",

"#22C55E"

],

borderWidth:0

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

cutout:"70%",

plugins:{

legend:{

position:"bottom"

}

}

}

});

}

}

//=========================================
// YEAR WISE TABLE
//=========================================

function generateProjection(

P,

annualRate,

years

){

const tbody=document.getElementById("projectionTable");

if(!tbody) return;

tbody.innerHTML="";

const monthlyRate=annualRate/12/100;

for(let year=1;year<=years;year++){

const months=year*12;

const invested=P*months;

let maturity;

if(monthlyRate>0){

maturity=

P*

((Math.pow(1+monthlyRate,months)-1)

/

monthlyRate)

*

(1+monthlyRate);

}else{

maturity=invested;

}

const returns=maturity-invested;

tbody.innerHTML+=`

<tr>

<td>${year}</td>

<td>${formatMoney(invested)}</td>

<td>${formatMoney(returns)}</td>

<td>${formatMoney(maturity)}</td>

</tr>

`;

}

}
/*=========================================
 SIP Calculator
 Part 4
 PDF • Copy • Share • Save
=========================================*/

//=========================================
// DOWNLOAD PDF
//=========================================

pdfBtn.addEventListener("click",downloadPDF);

function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

pdf.setFont("helvetica","bold");
pdf.setFontSize(20);
pdf.text("SIP Calculator Report",20,20);

pdf.setFontSize(11);

pdf.text("Rajaram Finance Calculators",20,30);

pdf.line(20,35,190,35);

pdf.text("Monthly SIP : ₹"+sipAmount.value,20,50);

pdf.text("Expected Return : "+returnRate.value+"%",20,60);

pdf.text("Investment Period : "+years.value+" Years",20,70);

pdf.text("SIP Date : "+sipDate.value,20,80);

pdf.text("Total Investment : "+totalInvestment.innerText,20,100);

pdf.text("Estimated Returns : "+estimatedReturns.innerText,20,110);

pdf.text("Maturity Amount : "+maturityAmount.innerText,20,120);

pdf.setFontSize(10);

pdf.text("Generated on : "+new Date().toLocaleDateString(),20,145);

pdf.text("For educational purposes only.",20,155);

pdf.save("SIP_Report.pdf");

showToast("PDF Downloaded");

}

//=========================================
// COPY RESULT
//=========================================

copyBtn.addEventListener("click",()=>{

const text=

`SIP Calculator

Monthly SIP : ₹${sipAmount.value}

Expected Return : ${returnRate.value}%

Investment Period : ${years.value} Years

Total Investment : ${totalInvestment.innerText}

Estimated Returns : ${estimatedReturns.innerText}

Maturity Amount : ${maturityAmount.innerText}`;

navigator.clipboard.writeText(text);

showToast("Copied Successfully");

});

//=========================================
// SHARE RESULT
//=========================================

shareBtn.addEventListener("click",async()=>{

const text=

`SIP Result

Monthly SIP : ₹${sipAmount.value}

Maturity Amount : ${maturityAmount.innerText}`;

if(navigator.share){

await navigator.share({

title:"SIP Calculator",

text:text,

url:location.href

});

}else{

navigator.clipboard.writeText(text);

showToast("Copied for Sharing");

}

});

//=========================================
// SAVE HISTORY
//=========================================

saveBtn.addEventListener("click",()=>{

let history=

JSON.parse(

localStorage.getItem("sipHistory")

)||[];

history.unshift({

date:new Date().toLocaleString(),

sip:sipAmount.value,

return:returnRate.value,

years:years.value,

investment:totalInvestment.innerText,

returns:estimatedReturns.innerText,

maturity:maturityAmount.innerText

});

localStorage.setItem(

"sipHistory",

JSON.stringify(history)

);

showToast("Calculation Saved");

});

//=========================================
// TOAST
//=========================================

function showToast(message){

const toast=document.getElementById("toast");

if(!toast) return;

toast.innerHTML=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}
/*=========================================
 SIP Calculator
 Part 5 (Final)
 Dark Mode • Back To Top • History
=========================================*/

//==============================
// DARK MODE
//==============================

if(localStorage.getItem("theme")==="dark"){
document.body.classList.add("dark");
}

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
?
"dark"
:
"light"
);

});

//==============================
// BACK TO TOP
//==============================

const backToTop=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

backToTop.style.display="block";

}else{

backToTop.style.display="none";

}

});

backToTop.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

//==============================
// VIEW HISTORY
//==============================

saveBtn.addEventListener("dblclick",()=>{

const history=

JSON.parse(

localStorage.getItem("sipHistory")

)||[];

if(history.length===0){

alert("No saved history found.");

return;

}

let message="Saved Calculations\n\n";

history.forEach((item,index)=>{

message+=

(index+1)+". "

+

item.date+

"\n"

+

"Monthly SIP : ₹"+item.sip+

"\n"

+

"Return : "+item.return+"%"

+

"\n"

+

"Years : "+item.years+

"\n"

+

"Maturity : "+item.maturity+

"\n\n";

});

alert(message);

});

//==============================
// CLEAR HISTORY
//==============================

function clearHistory(){

if(confirm("Delete all saved calculations?")){

localStorage.removeItem("sipHistory");

showToast("History Cleared");

}

}

//==============================
// KEYBOARD SHORTCUTS
//==============================

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

calculateSIP();

}

if(e.key==="Escape"){

resetBtn.click();

}

});

//==============================
// FIRST LOAD
//==============================

window.addEventListener("load",()=>{

calculateSIP();

});

//==============================
// CONSOLE MESSAGE
//==============================

console.log(
"Rajaram Finance Calculators - SIP Calculator Loaded Successfully"
);
