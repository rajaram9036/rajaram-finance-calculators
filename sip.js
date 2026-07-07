/*=========================================
 Rajaram Finance Calculators
 SIP Calculator
 Part 1
==========================================*/

"use strict";

//=============================
// INPUT ELEMENTS
//=============================

const monthlyInvestment = document.getElementById("monthlyInvestment");
const annualReturn = document.getElementById("annualReturn");
const investmentYears = document.getElementById("investmentYears");
const sipDate = document.getElementById("sipDate");

//=============================
// RANGE SLIDERS
//=============================

const sipRange = document.getElementById("sipRange");
const returnRange = document.getElementById("returnRange");
const yearRange = document.getElementById("yearRange");

//=============================
// RESULT ELEMENTS
//=============================

const investedAmount = document.getElementById("investedAmount");
const estimatedReturns = document.getElementById("estimatedReturns");
const maturityAmount = document.getElementById("maturityAmount");
const totalValue = document.getElementById("totalValue");

//=============================
// BUTTONS
//=============================

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const pdfBtn = document.getElementById("downloadPDF");
const printBtn = document.getElementById("printResult");
const copyBtn = document.getElementById("copyResult");
const shareBtn = document.getElementById("shareResult");
const saveBtn = document.getElementById("saveHistory");

//=============================
// FORMAT MONEY
//=============================

function formatMoney(amount){

return new Intl.NumberFormat("en-IN",{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}).format(amount);

}

//=============================
// RANGE SYNC
//=============================

sipRange.addEventListener("input",()=>{

monthlyInvestment.value=sipRange.value;

});

returnRange.addEventListener("input",()=>{

annualReturn.value=returnRange.value;

});

yearRange.addEventListener("input",()=>{

investmentYears.value=yearRange.value;

});

monthlyInvestment.addEventListener("input",()=>{

sipRange.value=monthlyInvestment.value;

});

annualReturn.addEventListener("input",()=>{

returnRange.value=annualReturn.value;

});

investmentYears.addEventListener("change",()=>{

yearRange.value=investmentYears.value;

});

//=============================
// DEFAULT VALUES
//=============================

monthlyInvestment.value=5000;
annualReturn.value=12;
investmentYears.value=20;

sipRange.value=5000;
returnRange.value=12;
yearRange.value=20;
/*=========================================
 SIP Calculation Engine
 Part 2
==========================================*/

//=============================
// CALCULATE SIP
//=============================

function calculateSIP(){

const P = parseFloat(monthlyInvestment.value) || 0;

const annualRate = parseFloat(annualReturn.value) || 0;

const years = parseFloat(investmentYears.value) || 0;

const monthlyRate = annualRate / 12 / 100;

const months = years * 12;

// Total Investment

const invested = P * months;

// SIP Future Value Formula

let maturity = 0;

if(monthlyRate > 0){

maturity =

P *

((Math.pow(1 + monthlyRate, months) - 1) /

monthlyRate) *

(1 + monthlyRate);

}else{

maturity = invested;

}

const returns = maturity - invested;

//=============================
// UPDATE RESULT CARDS
//=============================

investedAmount.innerHTML = formatMoney(invested);

estimatedReturns.innerHTML = formatMoney(returns);

maturityAmount.innerHTML = formatMoney(maturity);

totalValue.innerHTML = formatMoney(maturity);

//=============================
// UPDATE CHART & TABLE
//=============================

updateChart(invested, returns, maturity);

generateProjection(P, annualRate, years);

}

//=============================
// CALCULATE BUTTON
//=============================

calculateBtn.addEventListener("click", calculateSIP);

//=============================
// AUTO CALCULATE
//=============================

monthlyInvestment.addEventListener("input", calculateSIP);

annualReturn.addEventListener("input", calculateSIP);

investmentYears.addEventListener("change", calculateSIP);

sipRange.addEventListener("input", calculateSIP);

returnRange.addEventListener("input", calculateSIP);

yearRange.addEventListener("input", calculateSIP);

//=============================
// RESET
//=============================

resetBtn.addEventListener("click",()=>{

monthlyInvestment.value = 5000;

annualReturn.value = 12;

investmentYears.value = 20;

sipRange.value = 5000;

returnRange.value = 12;

yearRange.value = 20;

calculateSIP();

});

//=============================
// INITIAL LOAD
//=============================

window.addEventListener("load",()=>{

calculateSIP();

});
/*=========================================
 SIP Calculator
 Part 3
 Charts + Projection Table
==========================================*/

let sipChart;
let allocationChart;

//=============================
// GROWTH CHART
//=============================

function updateChart(invested, returns, maturity){

const chartCanvas=document.getElementById("sipChart");

if(chartCanvas){

if(sipChart){

sipChart.destroy();

}

sipChart=new Chart(chartCanvas,{

type:"line",

data:{

labels:["Start","5Y","10Y","15Y","20Y"],

datasets:[{

label:"Portfolio Value",

data:[

0,

maturity*0.18,

maturity*0.42,

maturity*0.70,

maturity

],

borderColor:"#1565C0",

backgroundColor:"rgba(21,101,192,.15)",

fill:true,

borderWidth:3,

tension:.4,

pointRadius:5,

pointBackgroundColor:"#1565C0"

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

scales:{

y:{

beginAtZero:true

}

}

}

});

}

//=============================
// PIE CHART
//=============================

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

cutout:"65%"

}

});

}

}

//=============================
// YEAR PROJECTION
//=============================

function generateProjection(

P,

annual,

years

){

const table=document.getElementById("growthTable");

if(!table) return;

table.innerHTML="";

const r=annual/12/100;

for(let year=1;year<=years;year++){

const months=year*12;

const invested=P*months;

let maturity;

if(r>0){

maturity=

P*

((Math.pow(1+r,months)-1)/r)

*(1+r);

}else{

maturity=invested;

}

const returns=maturity-invested;

table.innerHTML+=`

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
 PDF • Print • Copy • Share • Save
==========================================*/

//=============================
// DOWNLOAD PDF
//=============================

pdfBtn.addEventListener("click", downloadPDF);

function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

pdf.setFont("helvetica","bold");

pdf.setFontSize(20);

pdf.text("SIP Investment Report",20,20);

pdf.setFontSize(11);

pdf.text("Generated by Rajaram Finance Calculators",20,30);

pdf.line(20,35,190,35);

pdf.setFontSize(14);

pdf.text("Investment Details",20,48);

pdf.setFontSize(11);

pdf.text("Monthly SIP : ₹"+monthlyInvestment.value,20,60);

pdf.text("Expected Return : "+annualReturn.value+"%",20,70);

pdf.text("Investment Period : "+investmentYears.value+" Years",20,80);

pdf.text("SIP Date : "+sipDate.value,20,90);

pdf.setFontSize(14);

pdf.text("Results",20,110);

pdf.setFontSize(11);

pdf.text("Total Investment : "+investedAmount.innerText,20,122);

pdf.text("Estimated Returns : "+estimatedReturns.innerText,20,132);

pdf.text("Maturity Amount : "+maturityAmount.innerText,20,142);

pdf.setFontSize(12);

pdf.text("Disclaimer",20,165);

pdf.setFontSize(10);

pdf.text("This report is generated for educational purposes only.",20,175);

pdf.text("Mutual Fund investments are subject to market risks.",20,183);

pdf.text("Please read all scheme related documents carefully.",20,191);

pdf.save("SIP_Report.pdf");

showToast("PDF Downloaded");

}

//=============================
// PRINT
//=============================

printBtn.addEventListener("click",()=>{

window.print();

});

//=============================
// COPY RESULT
//=============================

copyBtn.addEventListener("click",()=>{

const result=

`SIP Calculator Result

Monthly SIP : ₹${monthlyInvestment.value}

Return : ${annualReturn.value}%

Years : ${investmentYears.value}

Investment : ${investedAmount.innerText}

Returns : ${estimatedReturns.innerText}

Maturity : ${maturityAmount.innerText}`;

navigator.clipboard.writeText(result);

showToast("Copied Successfully");

});

//=============================
// SHARE
//=============================

shareBtn.addEventListener("click",async()=>{

const text=

`SIP Calculator

Monthly SIP ₹${monthlyInvestment.value}

Maturity ${maturityAmount.innerText}`;

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

//=============================
// SAVE HISTORY
//=============================

saveBtn.addEventListener("click",()=>{

const history=

JSON.parse(localStorage.getItem("sipHistory"))||[];

history.unshift({

date:new Date().toLocaleString(),

sip:monthlyInvestment.value,

rate:annualReturn.value,

years:investmentYears.value,

investment:investedAmount.innerText,

returns:estimatedReturns.innerText,

maturity:maturityAmount.innerText

});

localStorage.setItem(

"sipHistory",

JSON.stringify(history)

);

showToast("Calculation Saved");

});
/*=========================================
 SIP Calculator
 Part 5 (Final)
==========================================*/

//=============================
// HISTORY MODAL
//=============================

const historyModal=document.getElementById("historyModal");
const historyList=document.getElementById("historyList");
const closeHistory=document.getElementById("closeHistory");
const clearHistory=document.getElementById("clearHistory");

function loadHistory(){

if(!historyList) return;

const data=JSON.parse(localStorage.getItem("sipHistory"))||[];

historyList.innerHTML="";

if(data.length===0){

historyList.innerHTML="<p>No Saved Calculations</p>";

return;

}

data.forEach(item=>{

historyList.innerHTML+=`

<div class="history-item">

<h4>${item.date}</h4>

<p><strong>Monthly SIP:</strong> ₹${item.sip}</p>

<p><strong>Return:</strong> ${item.rate}%</p>

<p><strong>Years:</strong> ${item.years}</p>

<p><strong>Maturity:</strong> ${item.maturity}</p>

<hr>

</div>

`;

});

}

saveBtn.addEventListener("dblclick",()=>{

loadHistory();

historyModal.style.display="flex";

});

closeHistory.onclick=()=>{

historyModal.style.display="none";

};

window.onclick=(e)=>{

if(e.target===historyModal){

historyModal.style.display="none";

}

};

clearHistory.onclick=()=>{

localStorage.removeItem("sipHistory");

loadHistory();

showToast("History Cleared");

};

//=============================
// TOAST
//=============================

function showToast(message){

const toast=document.getElementById("toast");

toast.innerHTML=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

//=============================
// DARK MODE
//=============================

const darkBtn=document.getElementById("darkBtn");

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

darkBtn.addEventListener("click",()=>{

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

//=============================
// BACK TO TOP
//=============================

const backBtn=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

backBtn.style.display="block";

}else{

backBtn.style.display="none";

}

});

backBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

//=============================
// WELCOME SCREEN
//=============================

window.addEventListener("load",()=>{

setTimeout(()=>{

const welcome=document.getElementById("welcomeScreen");

welcome.style.opacity="0";

setTimeout(()=>{

welcome.style.display="none";

},500);

},2000);

});

//=============================
// KEYBOARD SHORTCUTS
//=============================

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

calculateSIP();

}

if(e.key==="Escape"){

resetBtn.click();

}

});

//=============================
// INITIAL LOAD
//=============================

calculateSIP();

console.log("Rajaram Finance SIP Calculator Loaded Successfully");
