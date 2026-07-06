/* ==========================================
   Rajaram Finance Calculators
   SIP Calculator
   Part 1
========================================== */

// Input Elements

const monthlyInvestment =
document.getElementById("monthlyInvestment");

const annualReturn =
document.getElementById("annualReturn");

const investmentYears =
document.getElementById("investmentYears");

// Result Elements

const investedAmount =
document.getElementById("investedAmount");

const estimatedReturns =
document.getElementById("estimatedReturns");

const totalValue =
document.getElementById("totalValue");

// Buttons

const calculateBtn =
document.getElementById("calculateBtn");

const resetBtn =
document.getElementById("resetBtn");

// Format Currency

function formatCurrency(number){

return new Intl.NumberFormat("en-IN",{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}).format(number);

}

// Calculate SIP

calculateBtn.addEventListener("click",calculateSIP);

function calculateSIP(){

const P=parseFloat(monthlyInvestment.value);

const R=parseFloat(annualReturn.value);

const Y=parseFloat(investmentYears.value);

// Validation

if(isNaN(P)||isNaN(R)||isNaN(Y)){

alert("Please enter all values.");

return;

}

const r=R/12/100;

const n=Y*12;

// SIP Formula

const maturity=P*
((Math.pow(1+r,n)-1)/r)*
(1+r);

const invested=P*n;

const returns=maturity-invested;

// Show Result

investedAmount.innerHTML=
formatCurrency(invested);

estimatedReturns.innerHTML=
formatCurrency(returns);

totalValue.innerHTML=
formatCurrency(maturity);

}
/* ==========================================
   SIP Calculator
   Part 2
========================================== */

// Reset Calculator

resetBtn.addEventListener("click", resetCalculator);

function resetCalculator(){

monthlyInvestment.value="";
annualReturn.value="";
investmentYears.value="";

investedAmount.innerHTML="₹0";
estimatedReturns.innerHTML="₹0";
totalValue.innerHTML="₹0";

if(window.sipChart){
window.sipChart.destroy();
}

}

// ==========================================
// Copy Result
// ==========================================

const copyBtn=document.getElementById("copyResult");

if(copyBtn){

copyBtn.addEventListener("click",function(){

const text=
"Monthly Investment : "+monthlyInvestment.value+
"\nExpected Return : "+annualReturn.value+"%"+
"\nInvestment Period : "+investmentYears.value+" Years"+
"\n\nInvested Amount : "+investedAmount.innerText+
"\nEstimated Returns : "+estimatedReturns.innerText+
"\nTotal Value : "+totalValue.innerText;

navigator.clipboard.writeText(text);

alert("Result copied successfully.");

});

}

// ==========================================
// Dark Mode
// ==========================================

const darkBtn=document.getElementById("darkBtn");

if(darkBtn){

darkBtn.addEventListener("click",function(){

document.body.classList.toggle("dark");

});

}

// ==========================================
// Share Result
// ==========================================

const shareBtn=document.getElementById("shareResult");

if(shareBtn){

shareBtn.addEventListener("click",async()=>{

if(navigator.share){

await navigator.share({

title:"SIP Calculator",

text:
"My SIP Maturity Value is "+
totalValue.innerText,

url:location.href

});

}else{

alert("Sharing is not supported on this device.");

}

});

}
/* ==========================================
   SIP Calculator
   Part 3
   Chart.js
========================================== */

let sipChart;

// Create / Update Chart

function updateChart(invested,total){

const canvas=document.getElementById("sipChart");

if(!canvas) return;

if(sipChart){

sipChart.destroy();

}

const ctx=canvas.getContext("2d");

sipChart=new Chart(ctx,{

type:"doughnut",

data:{

labels:[

"Invested Amount",

"Estimated Returns"

],

datasets:[{

data:[

invested,

total-invested

],

backgroundColor:[

"#1565C0",

"#43A047"

],

borderWidth:2,

borderColor:"#ffffff"

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

position:"bottom"

},

tooltip:{

enabled:true

}

},

cutout:"65%"

}

});

}

// ==========================================
// Update Chart After Calculation
// ==========================================

const oldCalculate=calculateSIP;

calculateSIP=function(){

oldCalculate();

const investedValue=parseFloat(
investedAmount.innerText.replace(/[₹,]/g,"")
)||0;

const totalValueNum=parseFloat(
totalValue.innerText.replace(/[₹,]/g,"")
)||0;

updateChart(

investedValue,

totalValueNum

);

};
/* ==========================================
   SIP Calculator
   Part 4
   PDF + Print + History
========================================== */

// ===============================
// Download PDF
// ===============================

const pdfBtn=document.getElementById("downloadPDF");

if(pdfBtn){

pdfBtn.addEventListener("click",downloadPDF);

}

function downloadPDF(){

const text=`

Rajaram Finance Calculators

----------------------------

Monthly Investment : ${monthlyInvestment.value}

Expected Return : ${annualReturn.value} %

Investment Years : ${investmentYears.value}

----------------------------

Invested Amount : ${investedAmount.innerText}

Estimated Returns : ${estimatedReturns.innerText}

Total Value : ${totalValue.innerText}

`;

const blob=new Blob([text],{type:"text/plain"});

const link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="SIP-Calculation.txt";

link.click();

}

// ===============================
// Print Result
// ===============================

const printBtn=document.getElementById("printResult");

if(printBtn){

printBtn.addEventListener("click",()=>{

window.print();

});

}

// ===============================
// Save History
// ===============================

const historyBtn=document.getElementById("historyBtn");

if(historyBtn){

historyBtn.addEventListener("click",saveHistory);

}

function saveHistory(){

const history=JSON.parse(

localStorage.getItem("sipHistory")

)||[];

history.unshift({

date:new Date().toLocaleString(),

investment:monthlyInvestment.value,

returnRate:annualReturn.value,

years:investmentYears.value,

invested:investedAmount.innerText,

returns:estimatedReturns.innerText,

total:totalValue.innerText

});

localStorage.setItem(

"sipHistory",

JSON.stringify(history)

);

alert("Calculation Saved Successfully.");

}

// ===============================
// Load History
// ===============================

function loadHistory(){

return JSON.parse(

localStorage.getItem("sipHistory")

)||[];

}
/* ==========================================
   SIP Calculator
   Part 5
   History Modal + Toast
========================================== */

// ===============================
// Show History
// ===============================

function showHistory(){

const history=loadHistory();

const container=document.getElementById("historyList");

if(!container) return;

container.innerHTML="";

if(history.length===0){

container.innerHTML=`
<p class="empty-history">
No calculation history found.
</p>
`;

return;

}

history.forEach((item,index)=>{

container.innerHTML+=`

<div class="history-card">

<h3>Calculation ${index+1}</h3>

<p><strong>Date:</strong> ${item.date}</p>

<p><strong>Monthly SIP:</strong> ₹${item.investment}</p>

<p><strong>Return:</strong> ${item.returnRate}%</p>

<p><strong>Years:</strong> ${item.years}</p>

<p><strong>Invested:</strong> ${item.invested}</p>

<p><strong>Returns:</strong> ${item.returns}</p>

<p><strong>Total:</strong> ${item.total}</p>

</div>

`;

});

}

// ===============================
// Open History
// ===============================

const historyModal=document.getElementById("historyModal");

const openHistory=document.getElementById("historyBtn");

const closeHistory=document.getElementById("closeHistory");

if(openHistory){

openHistory.addEventListener("click",()=>{

historyModal.style.display="flex";

showHistory();

});

}

if(closeHistory){

closeHistory.addEventListener("click",()=>{

historyModal.style.display="none";

});

}

window.onclick=function(e){

if(e.target===historyModal){

historyModal.style.display="none";

}

};

// ===============================
// Clear History
// ===============================

const clearHistory=document.getElementById("clearHistory");

if(clearHistory){

clearHistory.addEventListener("click",()=>{

if(confirm("Delete all calculation history?")){

localStorage.removeItem("sipHistory");

showHistory();

showToast("History Cleared");

}

});

}

// ===============================
// Toast Message
// ===============================

function showToast(message){

const toast=document.getElementById("toast");

if(!toast) return;

toast.innerText=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

// ===============================
// Auto Save After Calculation
// ===============================

calculateBtn.addEventListener("click",()=>{

setTimeout(()=>{

saveHistory();

showToast("Calculation Saved");

},500);

});
/* ==========================================
   SIP Calculator
   Part 6 (Final)
========================================== */

// ===============================
// Save Dark Mode
// ===============================

const darkButton=document.getElementById("darkBtn");

if(darkButton){

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

darkButton.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

}else{

localStorage.setItem("theme","light");

}

});

}

// ===============================
// Keyboard Shortcuts
// ===============================

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

calculateSIP();

}

if(e.key==="Escape"){

resetCalculator();

}

});

// ===============================
// Auto Calculate
// ===============================

[

monthlyInvestment,

annualReturn,

investmentYears

].forEach(input=>{

if(input){

input.addEventListener("input",()=>{

if(

monthlyInvestment.value &&

annualReturn.value &&

investmentYears.value

){

calculateSIP();

}

});

}

});

// ===============================
// Share Result
// ===============================

async function shareCalculation(){

const text=

`SIP Calculator Result

Monthly Investment : ${monthlyInvestment.value}

Expected Return : ${annualReturn.value}%

Years : ${investmentYears.value}

Total Value : ${totalValue.innerText}

Created with Rajaram Finance Calculators`;

if(navigator.share){

try{

await navigator.share({

title:"SIP Calculator",

text:text,

url:window.location.href

});

}catch(err){

console.log(err);

}

}else{

navigator.clipboard.writeText(text);

showToast("Result copied for sharing");

}

}

const shareResultBtn=document.getElementById("shareResult");

if(shareResultBtn){

shareResultBtn.addEventListener("click",shareCalculation);

}

// ===============================
// Back To Top
// ===============================

const topBtn=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

if(!topBtn) return;

topBtn.style.display=

window.scrollY>400 ? "block":"none";

});

if(topBtn){

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

// ===============================
// Welcome Toast
// ===============================

window.addEventListener("load",()=>{

setTimeout(()=>{

showToast("Welcome to SIP Calculator");

},800);

});

// ===============================
// Console
// ===============================

console.log(

"Rajaram Finance Calculators - SIP Calculator Loaded Successfully"

);
