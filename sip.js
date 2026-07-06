/*=========================================
 SIP Calculator
 Part 1
=========================================*/

"use strict";

// ======================================
// INPUTS
// ======================================

const monthlyInvestment =
document.getElementById("monthlyInvestment");

const annualReturn =
document.getElementById("annualReturn");

const investmentYears =
document.getElementById("investmentYears");

const startDate =
document.getElementById("startDate");

const sipDate =
document.getElementById("sipDate");

// Sliders

const sipRange =
document.getElementById("sipRange");

const returnRange =
document.getElementById("returnRange");

// ======================================
// RESULT ELEMENTS
// ======================================

const investedAmount =
document.getElementById("investedAmount");

const estimatedReturns =
document.getElementById("estimatedReturns");

const totalValue =
document.getElementById("totalValue");

const summaryInvestment =
document.getElementById("summaryInvestment");

const summaryReturns =
document.getElementById("summaryReturns");

const summaryCorpus =
document.getElementById("summaryCorpus");

// ======================================
// BUTTONS
// ======================================

const calculateBtn =
document.getElementById("calculateBtn");

const resetBtn =
document.getElementById("resetBtn");

// ======================================
// FORMAT MONEY
// ======================================

function formatMoney(value){

return new Intl.NumberFormat("en-IN",{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}).format(value);

}

// ======================================
// RANGE SYNC
// ======================================

sipRange.addEventListener("input",()=>{

monthlyInvestment.value=sipRange.value;

});

returnRange.addEventListener("input",()=>{

annualReturn.value=returnRange.value;

});

monthlyInvestment.addEventListener("input",()=>{

sipRange.value=monthlyInvestment.value;

});

annualReturn.addEventListener("input",()=>{

returnRange.value=annualReturn.value;

});

// ======================================
// DEFAULT VALUES
// ======================================

monthlyInvestment.value=5000;

annualReturn.value=12;

sipRange.value=5000;

returnRange.value=12;
/*=========================================
 SIP Calculator
 Part 2
 Professional Calculation Engine
=========================================*/

// ======================================
// CALCULATE BUTTON
// ======================================

calculateBtn.addEventListener("click",calculateSIP);

function calculateSIP(){

const P=parseFloat(monthlyInvestment.value);

const annual=parseFloat(annualReturn.value);

const years=parseInt(investmentYears.value);

// Validation

if(isNaN(P)||isNaN(annual)||isNaN(years)){

alert("Please enter valid values.");

return;

}

if(P<=0||annual<=0||years<=0){

alert("Values must be greater than zero.");

return;

}

// Monthly Rate

const r=annual/12/100;

// Total Months

const n=years*12;

// SIP Formula

const maturity=

P*

((Math.pow(1+r,n)-1)/r)

*

(1+r);

// Total Investment

const invested=P*n;

// Estimated Returns

const returns=maturity-invested;

// ======================================
// UPDATE RESULT CARDS
// ======================================

investedAmount.innerHTML=

formatMoney(invested);

estimatedReturns.innerHTML=

formatMoney(returns);

totalValue.innerHTML=

formatMoney(maturity);

// ======================================
// UPDATE SUMMARY
// ======================================

summaryInvestment.innerHTML=

formatMoney(invested);

summaryReturns.innerHTML=

formatMoney(returns);

summaryCorpus.innerHTML=

formatMoney(maturity);

// ======================================
// UPDATE CHART
// ======================================

updateChart(

invested,

returns,

maturity

);

// ======================================
// YEAR TABLE
// ======================================

generateGrowthTable(

P,

annual,

years

);

}

// ======================================
// RESET BUTTON
// ======================================

resetBtn.addEventListener("click",()=>{

monthlyInvestment.value=5000;

annualReturn.value=12;

investmentYears.value=20;

sipRange.value=5000;

returnRange.value=12;

calculateSIP();

});

// ======================================
// AUTO CALCULATE
// ======================================

monthlyInvestment.addEventListener("input",calculateSIP);

annualReturn.addEventListener("input",calculateSIP);

investmentYears.addEventListener("change",calculateSIP);

// ======================================
// INITIAL LOAD
// ======================================

window.onload=()=>{

calculateSIP();

};
/*=========================================
 SIP Calculator
 Part 3
 Chart.js + Growth Table
=========================================*/

let sipChart;

// ======================================
// GROWTH CHART
// ======================================

function updateChart(invested,returns,maturity){

const chartCanvas=document.getElementById("sipChart");

if(!chartCanvas) return;

if(sipChart){

sipChart.destroy();

}

sipChart=new Chart(chartCanvas,{

type:"line",

data:{

labels:[

"Start",

"Year 5",

"Year 10",

"Year 15",

"Year 20"

],

datasets:[{

label:"Portfolio Value",

data:[

0,

maturity*0.18,

maturity*0.42,

maturity*0.71,

maturity

],

borderColor:"#1565C0",

backgroundColor:"rgba(21,101,192,.12)",

fill:true,

borderWidth:4,

pointRadius:5,

pointHoverRadius:7,

tension:.40

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:true,

position:"top"

}

},

interaction:{

mode:"index",

intersect:false

},

scales:{

y:{

beginAtZero:true

},

x:{

grid:{

display:false

}

}

}

}

});

}

// ======================================
// YEAR-WISE TABLE
// ======================================

function generateGrowthTable(

P,

annualRate,

years

){

const table=document.getElementById("growthTable");

if(!table) return;

table.innerHTML="";

const r=annualRate/12/100;

const points=[1,5,10,15,20];

points.forEach(year=>{

if(year>years) return;

const months=year*12;

const invested=P*months;

const maturity=

P*

((Math.pow(1+r,months)-1)/r)

*

(1+r);

const profit=maturity-invested;

table.innerHTML+=`

<tr>

<td>${year}</td>

<td>${formatMoney(invested)}</td>

<td>${formatMoney(profit)}</td>

<td>${formatMoney(maturity)}</td>

</tr>

`;

});

}
/*=========================================
 SIP Calculator
 Part 4
 PDF • Print • Share • Save History
=========================================*/

// ======================================
// BUTTONS
// ======================================

const pdfBtn=document.getElementById("downloadPDF");

const printBtn=document.getElementById("printResult");

const copyBtn=document.getElementById("copyResult");

const shareBtn=document.getElementById("shareResult");

const saveBtn=document.getElementById("saveHistory");

// ======================================
// DOWNLOAD REPORT
// ======================================

if(pdfBtn){

pdfBtn.addEventListener("click",downloadReport);

}

function downloadReport(){

const report=`

SIP CALCULATOR REPORT

===========================

Monthly SIP :
₹${monthlyInvestment.value}

Expected Return :
${annualReturn.value}%

Investment Period :
${investmentYears.value} Years

---------------------------

Invested Amount

${investedAmount.innerText}

Estimated Returns

${estimatedReturns.innerText}

Maturity Amount

${totalValue.innerText}

Generated On

${new Date().toLocaleString()}

`;

const blob=new Blob([report],{

type:"text/plain"

});

const link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="SIP_Report.txt";

link.click();

showToast("Report Downloaded");

}

// ======================================
// PRINT
// ======================================

if(printBtn){

printBtn.onclick=()=>{

window.print();

};

}

// ======================================
// COPY RESULT
// ======================================

if(copyBtn){

copyBtn.onclick=()=>{

const result=`

Monthly SIP : ₹${monthlyInvestment.value}

Expected Return : ${annualReturn.value}%

Investment Period : ${investmentYears.value} Years

Invested Amount

${investedAmount.innerText}

Estimated Returns

${estimatedReturns.innerText}

Maturity Amount

${totalValue.innerText}

`;

navigator.clipboard.writeText(result);

showToast("Result Copied");

};

}

// ======================================
// SHARE
// ======================================

if(shareBtn){

shareBtn.onclick=async()=>{

const text=`

SIP Calculation

Monthly SIP : ₹${monthlyInvestment.value}

Expected Return : ${annualReturn.value}%

Years : ${investmentYears.value}

Maturity Amount

${totalValue.innerText}

`;

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

};

}

// ======================================
// SAVE HISTORY
// ======================================

if(saveBtn){

saveBtn.onclick=()=>{

let history=

JSON.parse(

localStorage.getItem("sipHistory")

)||[];

history.unshift({

date:new Date().toLocaleString(),

sip:monthlyInvestment.value,

returns:annualReturn.value,

years:investmentYears.value,

investment:investedAmount.innerText,

profit:estimatedReturns.innerText,

maturity:totalValue.innerText

});

localStorage.setItem(

"sipHistory",

JSON.stringify(history)

);

showToast("Saved Successfully");

};

}

// ======================================
// TOAST
// ======================================

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
 History • Dark Mode • Back To Top
=========================================*/

// ======================================
// HISTORY
// ======================================

const historyBtn=document.getElementById("saveHistory");
const historyModal=document.getElementById("historyModal");
const historyList=document.getElementById("historyList");
const closeHistory=document.getElementById("closeHistory");
const clearHistory=document.getElementById("clearHistory");

// Load History

function loadHistory(){

if(!historyList) return;

let data=JSON.parse(

localStorage.getItem("sipHistory")

)||[];

historyList.innerHTML="";

if(data.length===0){

historyList.innerHTML="<p>No Saved Calculations</p>";

return;

}

data.forEach(item=>{

historyList.innerHTML+=`

<div class="history-card">

<h3>${item.date}</h3>

<p><b>Monthly SIP:</b> ₹${item.sip}</p>

<p><b>Return:</b> ${item.returns}%</p>

<p><b>Years:</b> ${item.years}</p>

<p><b>Investment:</b> ${item.investment}</p>

<p><b>Profit:</b> ${item.profit}</p>

<p><b>Maturity:</b> ${item.maturity}</p>

<hr>

</div>

`;

});

}

// Open History

if(historyBtn){

historyBtn.addEventListener("dblclick",()=>{

loadHistory();

historyModal.style.display="flex";

});

}

// Close

if(closeHistory){

closeHistory.onclick=()=>{

historyModal.style.display="none";

};

}

window.onclick=(e)=>{

if(e.target===historyModal){

historyModal.style.display="none";

}

};

// Clear

if(clearHistory){

clearHistory.onclick=()=>{

if(confirm("Delete all saved history?")){

localStorage.removeItem("sipHistory");

loadHistory();

showToast("History Cleared");

}

};

}

// ======================================
// DARK MODE
// ======================================

const darkBtn=document.getElementById("darkBtn");

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

if(darkBtn){

darkBtn.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList.contains("dark")

?

"dark"

:

"light"

);

};

}

// ======================================
// BACK TO TOP
// ======================================

const topBtn=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

if(!topBtn) return;

topBtn.style.display=

window.scrollY>300

?

"block"

:

"none";

});

if(topBtn){

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}

// ======================================
// KEYBOARD SHORTCUT
// ======================================

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

calculateSIP();

}

if(e.key==="Escape"){

resetBtn.click();

}

});

// ======================================
// AUTO CALCULATE
// ======================================

[
monthlyInvestment,
annualReturn,
investmentYears
].forEach(el=>{

el.addEventListener("input",calculateSIP);

});

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load",()=>{

calculateSIP();

showToast("Welcome to SIP Calculator");

});

// ======================================
// CONSOLE
// ======================================

console.log(

"Rajaram Finance SIP Calculator Loaded Successfully"

);
