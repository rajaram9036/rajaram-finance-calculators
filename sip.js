/*=================================================
 RAJARAM FINANCE CALCULATORS
 SIP Calculator JS - Part 1
==================================================*/

"use strict";

// ================================
// INPUTS
// ================================

const monthlyInvestment =
document.getElementById("monthlyInvestment");

const annualReturn =
document.getElementById("annualReturn");

const investmentYears =
document.getElementById("investmentYears");

const sipDate =
document.getElementById("sipDate");

// ================================
// RANGE SLIDERS
// ================================

const sipRange =
document.getElementById("sipRange");

const returnRange =
document.getElementById("returnRange");

const yearRange =
document.getElementById("yearRange");

// ================================
// RESULT ELEMENTS
// ================================

const investedAmount =
document.getElementById("investedAmount");

const estimatedReturns =
document.getElementById("estimatedReturns");

const maturityAmount =
document.getElementById("maturityAmount");

const totalValue =
document.getElementById("totalValue");

// ================================
// BUTTONS
// ================================

const calculateBtn =
document.getElementById("calculateBtn");

const resetBtn =
document.getElementById("resetBtn");

const pdfBtn =
document.getElementById("downloadPDF");

const printBtn =
document.getElementById("printResult");

const copyBtn =
document.getElementById("copyResult");

const shareBtn =
document.getElementById("shareResult");

const saveBtn =
document.getElementById("saveHistory");

// ================================
// FORMAT MONEY
// ================================

function formatMoney(value){

return new Intl.NumberFormat("en-IN",{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}).format(value);

}

// ================================
// RANGE SYNC
// ================================

if(sipRange){

sipRange.addEventListener("input",()=>{

monthlyInvestment.value=sipRange.value;

calculateSIP();

});

}

if(returnRange){

returnRange.addEventListener("input",()=>{

annualReturn.value=returnRange.value;

calculateSIP();

});

}

if(yearRange){

yearRange.addEventListener("input",()=>{

investmentYears.value=yearRange.value;

calculateSIP();

});

}

// Manual Inputs

monthlyInvestment.addEventListener("input",()=>{

sipRange.value=monthlyInvestment.value;

});

annualReturn.addEventListener("input",()=>{

returnRange.value=annualReturn.value;

});

investmentYears.addEventListener("change",()=>{

yearRange.value=investmentYears.value;

});

// ================================
// DEFAULT VALUES
// ================================

monthlyInvestment.value=5000;

annualReturn.value=12;

investmentYears.value=20;

sipRange.value=5000;

returnRange.value=12;

if(yearRange){

yearRange.value=20;

}
/*=================================================
 SIP Calculator
 Part 2
 Calculation Engine
==================================================*/

// =====================================
// CALCULATE BUTTON
// =====================================

calculateBtn.addEventListener("click", calculateSIP);

function calculateSIP(){

const P = parseFloat(monthlyInvestment.value);

const annual = parseFloat(annualReturn.value);

const years = parseFloat(investmentYears.value);

// Validation

if(isNaN(P) || isNaN(annual) || isNaN(years)){

return;

}

const r = annual / 12 / 100;

const n = years * 12;

// SIP Formula

const maturity =

P *

((Math.pow(1 + r, n) - 1) / r) *

(1 + r);

const invested = P * n;

const returns = maturity - invested;

// =============================
// RESULT UPDATE
// =============================

investedAmount.innerHTML =

formatMoney(invested);

estimatedReturns.innerHTML =

formatMoney(returns);

maturityAmount.innerHTML =

formatMoney(maturity);

totalValue.innerHTML =

formatMoney(maturity);

// =============================
// UPDATE CHART
// =============================

updateChart(

invested,

returns,

maturity

);

// =============================
// UPDATE TABLE
// =============================

generateProjection(

P,

annual,

years

);

}

// =====================================
// RESET BUTTON
// =====================================

resetBtn.addEventListener("click",()=>{

monthlyInvestment.value = 5000;

annualReturn.value = 12;

investmentYears.value = 20;

sipRange.value = 5000;

returnRange.value = 12;

if(yearRange){

yearRange.value = 20;

}

calculateSIP();

});

// =====================================
// AUTO CALCULATE
// =====================================

monthlyInvestment.addEventListener(

"input",

calculateSIP

);

annualReturn.addEventListener(

"input",

calculateSIP

);

investmentYears.addEventListener(

"change",

calculateSIP

);

// =====================================
// FIRST LOAD
// =====================================

window.addEventListener(

"load",

()=>{

calculateSIP();

}

);
/*=================================================
 SIP Calculator
 Part 3
 Growth Chart + Projection Table + Pie Chart
==================================================*/

let growthChart;
let allocationChart;

// =====================================
// GROWTH CHART
// =====================================

function updateChart(invested, returns, maturity){

const chartCanvas=document.getElementById("sipChart");

if(!chartCanvas) return;

if(growthChart){

growthChart.destroy();

}

growthChart=new Chart(chartCanvas,{

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

maturity*0.43,

maturity*0.72,

maturity

],

borderColor:"#1565C0",

backgroundColor:"rgba(21,101,192,.12)",

fill:true,

borderWidth:4,

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

}

}

});

// ===============================
// PIE CHART
// ===============================

const pie=document.getElementById("allocationChart");

if(!pie) return;

if(allocationChart){

allocationChart.destroy();

}

allocationChart=new Chart(pie,{

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

cutout:"70%"

}

});

}

// =====================================
// YEAR WISE PROJECTION
// =====================================

function generateProjection(

P,

annual,

years

){

const tbody=document.getElementById("growthTable");

if(!tbody) return;

tbody.innerHTML="";

const r=annual/12/100;

for(let y=1;y<=years;y++){

const months=y*12;

const invested=P*months;

const maturity=

P*

((Math.pow(1+r,months)-1)/r)

*

(1+r);

const returns=

maturity-invested;

tbody.innerHTML+=`

<tr>

<td>${y}</td>

<td>${formatMoney(invested)}</td>

<td>${formatMoney(returns)}</td>

<td>${formatMoney(maturity)}</td>

</tr>

`;

}

}
/*=================================================
 SIP Calculator
 Part 4
 PDF • Print • Copy • Share • Save
==================================================*/

// ======================================
// DOWNLOAD PDF
// ======================================

if(pdfBtn){

pdfBtn.addEventListener("click",downloadPDF);

}

async function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf=new jsPDF("p","mm","a4");

pdf.setFont("helvetica","bold");

pdf.setFontSize(20);

pdf.text("SIP Investment Report",20,20);

pdf.setFontSize(11);

pdf.text(

"Generated by Rajaram Finance Calculators",

20,

28

);

pdf.line(20,32,190,32);

// Investment Details

pdf.setFontSize(14);

pdf.text("Investment Details",20,42);

pdf.setFontSize(11);

pdf.text(

"Monthly Investment : ₹"+

monthlyInvestment.value,

20,

52

);

pdf.text(

"Expected Return : "+

annualReturn.value+"%",

20,

60

);

pdf.text(

"Investment Period : "+

investmentYears.value+

" Years",

20,

68

);

pdf.text(

"SIP Date : "+

sipDate.value,

20,

76

);

// Results

pdf.setFontSize(14);

pdf.text("Results",20,92);

pdf.setFontSize(11);

pdf.text(

"Total Investment : "+

investedAmount.innerText,

20,

102

);

pdf.text(

"Estimated Returns : "+

estimatedReturns.innerText,

20,

110

);

pdf.text(

"Maturity Amount : "+

maturityAmount.innerText,

20,

118

);

// Disclaimer

pdf.setFontSize(12);

pdf.text("Disclaimer",20,138);

pdf.setFontSize(10);

pdf.text(

"The calculations shown in this report are estimates for educational purposes only.",

20,

146

);

pdf.text(

"Mutual Fund investments are subject to market risks.",

20,

154

);

pdf.text(

"Please read all scheme related documents carefully before investing.",

20,

162

);

// Footer

pdf.setFontSize(10);

pdf.text(

"Generated on : "+

new Date().toLocaleString(),

20,

280

);

pdf.save("SIP_Report.pdf");

showToast("PDF Downloaded");

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

const text=

`Monthly SIP : ₹${monthlyInvestment.value}

Expected Return : ${annualReturn.value}%

Years : ${investmentYears.value}

Total Investment : ${investedAmount.innerText}

Estimated Returns : ${estimatedReturns.innerText}

Maturity Amount : ${maturityAmount.innerText}`;

navigator.clipboard.writeText(text);

showToast("Copied Successfully");

};

}

// ======================================
// SHARE
// ======================================

if(shareBtn){

shareBtn.onclick=async()=>{

const shareText=

`SIP Calculator Result

Monthly SIP : ₹${monthlyInvestment.value}

Expected Return : ${annualReturn.value}%

Investment Period : ${investmentYears.value} Years

Maturity Amount : ${maturityAmount.innerText}`;

if(navigator.share){

await navigator.share({

title:"SIP Calculator",

text:shareText,

url:location.href

});

}else{

navigator.clipboard.writeText(shareText);

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

returnRate:annualReturn.value,

years:investmentYears.value,

investment:investedAmount.innerText,

returns:estimatedReturns.innerText,

maturity:maturityAmount.innerText

});

localStorage.setItem(

"sipHistory",

JSON.stringify(history)

);

showToast("Saved Successfully");

};

}
/*=================================================
 SIP Calculator
 Part 5 (Final)
 History • Dark Mode • Welcome • Back To Top
==================================================*/

// ======================================
// HISTORY
// ======================================

const historyModal=document.getElementById("historyModal");
const historyList=document.getElementById("historyList");
const closeHistory=document.getElementById("closeHistory");
const clearHistory=document.getElementById("clearHistory");

function loadHistory(){

if(!historyList) return;

const data=JSON.parse(localStorage.getItem("sipHistory"))||[];

historyList.innerHTML="";

if(data.length===0){

historyList.innerHTML="<p>No saved calculations found.</p>";

return;

}

data.forEach(item=>{

historyList.innerHTML+=`

<div class="history-card">

<h3>${item.date}</h3>

<p><b>Monthly SIP:</b> ₹${item.sip}</p>

<p><b>Return:</b> ${item.returnRate}%</p>

<p><b>Years:</b> ${item.years}</p>

<p><b>Maturity:</b> ${item.maturity}</p>

<hr>

</div>

`;

});

}

if(saveBtn){

saveBtn.addEventListener("dblclick",()=>{

loadHistory();

historyModal.style.display="flex";

});

}

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

if(clearHistory){

clearHistory.onclick=()=>{

localStorage.removeItem("sipHistory");

loadHistory();

showToast("History Cleared");

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

const backBtn=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

backBtn.style.display="block";

}else{

backBtn.style.display="none";

}

});

if(backBtn){

backBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}

// ======================================
// TOAST
// ======================================

function showToast(msg){

const toast=document.getElementById("toast");

if(!toast) return;

toast.innerHTML=msg;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

// ======================================
// WELCOME SCREEN
// ======================================

window.addEventListener("load",()=>{

setTimeout(()=>{

const welcome=document.getElementById("welcomeScreen");

if(welcome){

welcome.style.opacity="0";

setTimeout(()=>{

welcome.style.display="none";

},500);

}

},2500);

});

// ======================================
// KEYBOARD SHORTCUTS
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
// INITIAL LOAD
// ======================================

window.onload=()=>{

calculateSIP();

console.log("Rajaram Finance SIP Calculator Loaded");

};
