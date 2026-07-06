/*=========================================
 Rajaram Finance Calculators
 SIP Calculator
 Part 1
==========================================*/

"use strict";

// ==========================================
// INPUT ELEMENTS
// ==========================================

const monthlyInvestment = document.getElementById("monthlyInvestment");
const annualReturn = document.getElementById("annualReturn");
const investmentYears = document.getElementById("investmentYears");
const startDate = document.getElementById("startDate");

const sipRange = document.getElementById("sipRange");
const returnRange = document.getElementById("returnRange");
const yearRange = document.getElementById("yearRange");

// ==========================================
// RESULT ELEMENTS
// ==========================================

const investedAmount = document.getElementById("investedAmount");
const estimatedReturns = document.getElementById("estimatedReturns");
const totalValue = document.getElementById("totalValue");
const xirrResult = document.getElementById("xirrResult");

// Summary

const summaryInvestment = document.getElementById("summaryInvestment");
const summaryReturns = document.getElementById("summaryReturns");
const summaryCorpus = document.getElementById("summaryCorpus");
const summaryYears = document.getElementById("summaryYears");

// Sidebar

const sideInvestment = document.getElementById("sideInvestment");
const sideReturn = document.getElementById("sideReturn");
const sideYears = document.getElementById("sideYears");
const sideInvested = document.getElementById("sideInvested");
const sideReturns = document.getElementById("sideReturns");
const sideTotal = document.getElementById("sideTotal");

// Goal

const goalProgress = document.getElementById("goalProgress");
const goalPercent = document.getElementById("goalPercent");

// ==========================================
// BUTTONS
// ==========================================

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

// ==========================================
// FORMATTER
// ==========================================

function formatMoney(value){

return new Intl.NumberFormat("en-IN",{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}).format(value);

}

// ==========================================
// RANGE SYNC
// ==========================================

if(sipRange){

sipRange.addEventListener("input",()=>{

monthlyInvestment.value=sipRange.value;

});

}

if(returnRange){

returnRange.addEventListener("input",()=>{

annualReturn.value=returnRange.value;

});

}

if(yearRange){

yearRange.addEventListener("input",()=>{

investmentYears.value=yearRange.value;

});

}

monthlyInvestment.addEventListener("input",()=>{

sipRange.value=monthlyInvestment.value;

});

annualReturn.addEventListener("input",()=>{

returnRange.value=annualReturn.value;

});

investmentYears.addEventListener("input",()=>{

yearRange.value=investmentYears.value;

});

// ==========================================
// INITIAL VALUES
// ==========================================

monthlyInvestment.value=5000;
annualReturn.value=12;
investmentYears.value=20;

sipRange.value=5000;
returnRange.value=12;
yearRange.value=20;
/*=========================================
 SIP Calculator
 Part 2
 Professional Calculation Engine
==========================================*/

// ==========================================
// CALCULATE SIP
// ==========================================

calculateBtn.addEventListener("click",calculateSIP);

function calculateSIP(){

const P=parseFloat(monthlyInvestment.value);

const annualRate=parseFloat(annualReturn.value);

const years=parseFloat(investmentYears.value);

// Validation

if(

isNaN(P) ||

isNaN(annualRate) ||

isNaN(years) ||

P<=0 ||

annualRate<=0 ||

years<=0

){

alert("Please enter valid values.");

return;

}

// Monthly Rate

const r=annualRate/12/100;

// Total Months

const n=years*12;

// SIP Formula

const maturity=

P*

((Math.pow(1+r,n)-1)/r)

*

(1+r);

// Investment

const invested=P*n;

// Profit

const returns=maturity-invested;

// ==========================================
// RESULT UPDATE
// ==========================================

investedAmount.innerHTML=

formatMoney(invested);

estimatedReturns.innerHTML=

formatMoney(returns);

totalValue.innerHTML=

formatMoney(maturity);

xirrResult.innerHTML=

annualRate.toFixed(2)+"%";

// ==========================================
// SUMMARY UPDATE
// ==========================================

summaryInvestment.innerHTML=

formatMoney(invested);

summaryReturns.innerHTML=

formatMoney(returns);

summaryCorpus.innerHTML=

formatMoney(maturity);

summaryYears.innerHTML=

years+" Years";

// ==========================================
// SIDEBAR UPDATE
// ==========================================

sideInvestment.innerHTML=

formatMoney(P);

sideReturn.innerHTML=

annualRate+"%";

sideYears.innerHTML=

years+" Years";

sideInvested.innerHTML=

formatMoney(invested);

sideReturns.innerHTML=

formatMoney(returns);

sideTotal.innerHTML=

formatMoney(maturity);

// ==========================================
// GOAL TRACKER
// ==========================================

let progress=

Math.min(

(maturity/10000000)*100,

100

);

goalProgress.style.width=

progress+"%";

goalPercent.innerHTML=

progress.toFixed(1)+"% Goal Achieved";

// ==========================================
// NEXT PART
// ==========================================

updateCharts(

invested,

returns

);

generateGrowthTable(

P,

annualRate,

years

);

}
/*=========================================
 SIP Calculator
 Part 3
 Charts + Growth Table
==========================================*/

let growthChart;
let allocationChart;

// ==========================================
// UPDATE CHARTS
// ==========================================

function updateCharts(invested,returns){

const total=invested+returns;

// Destroy Old Charts

if(growthChart){

growthChart.destroy();

}

if(allocationChart){

allocationChart.destroy();

}

// ==============================
// Growth Line Chart
// ==============================

const growthCtx=
document.getElementById("sipChart");

if(growthCtx){

growthChart=new Chart(

growthCtx,{

type:"line",

data:{

labels:[

"0",

"5Y",

"10Y",

"15Y",

"20Y"

],

datasets:[{

label:"Portfolio Value",

data:[

0,

total*.18,

total*.42,

total*.71,

total

],

borderColor:"#1565C0",

backgroundColor:"rgba(21,101,192,.15)",

fill:true,

tension:.4,

borderWidth:4,

pointRadius:5

}]

},

options:{

responsive:true,

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

}

);

}

// ==============================
// Doughnut Chart
// ==============================

const pieCtx=
document.getElementById("allocationChart");

if(pieCtx){

allocationChart=new Chart(

pieCtx,{

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

"#10B981"

],

borderWidth:0

}]

},

options:{

responsive:true,

cutout:"70%",

plugins:{

legend:{

position:"bottom"

}

}

}

}

);

}

}

// ==========================================
// YEAR-WISE TABLE
// ==========================================

function generateGrowthTable(

P,

rate,

years

){

const table=

document.getElementById("growthTable");

if(!table) return;

table.innerHTML="";

const r=rate/12/100;

for(let y=1;y<=years;y++){

const months=y*12;

const invested=P*months;

const value=

P*

((Math.pow(

1+r,

months

)-1)/r)

*

(1+r);

const profit=value-invested;

table.innerHTML+=`

<tr>

<td>${y}</td>

<td>${formatMoney(invested)}</td>

<td>${formatMoney(value)}</td>

<td>${formatMoney(profit)}</td>

</tr>

`;

}

}
/*=========================================
 SIP Calculator
 Part 4
 PDF • Print • Share • Copy • History
==========================================*/

// ==========================================
// Buttons
// ==========================================

const pdfBtn=document.getElementById("downloadPDF");
const printBtn=document.getElementById("printResult");
const copyBtn=document.getElementById("copyResult");
const shareBtn=document.getElementById("shareResult");
const saveBtn=document.getElementById("saveHistory");

// ==========================================
// Download Report
// ==========================================

if(pdfBtn){

pdfBtn.addEventListener("click",downloadReport);

}

function downloadReport(){

const report=`

RAJARAM FINANCE CALCULATORS

----------------------------

Monthly SIP :
${monthlyInvestment.value}

Expected Return :
${annualReturn.value} %

Investment Years :
${investmentYears.value}

----------------------------

Total Investment
${investedAmount.innerText}

Estimated Returns
${estimatedReturns.innerText}

Final Corpus
${totalValue.innerText}

XIRR
${xirrResult.innerText}

Generated :
${new Date().toLocaleString()}

`;

const blob=new Blob([report],{

type:"text/plain"

});

const link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="SIP-Report.txt";

link.click();

showToast("Report Downloaded");

}

// ==========================================
// Print
// ==========================================

if(printBtn){

printBtn.addEventListener("click",()=>{

window.print();

});

}

// ==========================================
// Copy Result
// ==========================================

if(copyBtn){

copyBtn.addEventListener("click",()=>{

const result=`

Monthly SIP :
${monthlyInvestment.value}

Expected Return :
${annualReturn.value}%

Years :
${investmentYears.value}

Investment :
${investedAmount.innerText}

Returns :
${estimatedReturns.innerText}

Corpus :
${totalValue.innerText}

`;

navigator.clipboard.writeText(result);

showToast("Result Copied");

});

}

// ==========================================
// Share Result
// ==========================================

if(shareBtn){

shareBtn.addEventListener("click",shareResult);

}

async function shareResult(){

const text=`

SIP Result

Monthly SIP :
${monthlyInvestment.value}

Expected Return :
${annualReturn.value}%

Investment :
${investedAmount.innerText}

Returns :
${estimatedReturns.innerText}

Corpus :
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

}

// ==========================================
// Save History
// ==========================================

if(saveBtn){

saveBtn.addEventListener("click",saveHistory);

}

function saveHistory(){

let history=

JSON.parse(

localStorage.getItem("sipHistory")

)||[];

history.unshift({

date:new Date().toLocaleString(),

sip:monthlyInvestment.value,

returnRate:annualReturn.value,

years:investmentYears.value,

investment:investedAmount.innerText,

returns:estimatedReturns.innerText,

corpus:totalValue.innerText

});

localStorage.setItem(

"sipHistory",

JSON.stringify(history)

);

showToast("Calculation Saved");

}

// ==========================================
// Toast
// ==========================================

function showToast(message){

const toast=

document.getElementById("toast");

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
 History • Dark Mode • Auto Calculate
==========================================*/

// ==========================================
// History Modal
// ==========================================

const historyBtn=document.getElementById("historyBtn");
const historyModal=document.getElementById("historyModal");
const historyList=document.getElementById("historyList");
const closeHistory=document.getElementById("closeHistory");
const clearHistory=document.getElementById("clearHistory");

if(historyBtn){

historyBtn.addEventListener("click",loadHistory);

}

function loadHistory(){

if(!historyModal) return;

historyModal.style.display="flex";

const data=

JSON.parse(

localStorage.getItem("sipHistory")

)||[];

historyList.innerHTML="";

if(data.length===0){

historyList.innerHTML="<p>No History Available</p>";

return;

}

data.forEach(item=>{

historyList.innerHTML+=`

<div class="history-card">

<h3>${item.date}</h3>

<p><b>SIP :</b> ₹${item.sip}</p>

<p><b>Return :</b> ${item.returnRate}%</p>

<p><b>Years :</b> ${item.years}</p>

<p><b>Investment :</b> ${item.investment}</p>

<p><b>Returns :</b> ${item.returns}</p>

<p><b>Corpus :</b> ${item.corpus}</p>

</div>

`;

});

}

// ==========================================
// Close History
// ==========================================

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

// ==========================================
// Clear History
// ==========================================

if(clearHistory){

clearHistory.onclick=()=>{

if(confirm("Delete All History?")){

localStorage.removeItem("sipHistory");

loadHistory();

showToast("History Deleted");

}

};

}

// ==========================================
// Dark Mode
// ==========================================

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

// ==========================================
// Auto Calculate
// ==========================================

[

monthlyInvestment,

annualReturn,

investmentYears

].forEach(input=>{

input.addEventListener("input",()=>{

if(

monthlyInvestment.value&&

annualReturn.value&&

investmentYears.value

){

calculateSIP();

}

});

});

// ==========================================
// Keyboard Shortcut
// ==========================================

document.addEventListener("keydown",e=>{

if(e.key==="Enter"){

calculateSIP();

}

if(e.key==="Escape"){

resetBtn.click();

}

});

// ==========================================
// Back To Top
// ==========================================

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

// ==========================================
// Default Calculation
// ==========================================

window.onload=()=>{

calculateSIP();

showToast(

"Welcome to Rajaram Finance Calculators"

);

};

// ==========================================
// Console
// ==========================================

console.log(

"Rajaram Finance SIP Calculator Loaded Successfully"

);
