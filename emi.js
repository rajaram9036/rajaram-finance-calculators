/*=========================================
 Rajaram Finance Calculators
 EMI Calculator
 Part 1
=========================================*/

"use strict";

/*=============================
 INPUT ELEMENTS
=============================*/

const loanAmount =
document.getElementById("loanAmount");

const interestRate =
document.getElementById("interestRate");

const loanYears =
document.getElementById("loanYears");

const processingFee =
document.getElementById("processingFee");

/*=============================
 RANGE SLIDERS
=============================*/

const loanSlider =
document.getElementById("loanSlider");

const interestSlider =
document.getElementById("interestSlider");

const yearSlider =
document.getElementById("yearSlider");

/*=============================
 RESULT ELEMENTS
=============================*/

const monthlyEMI =
document.getElementById("monthlyEMI");

const totalInterest =
document.getElementById("totalInterest");

const totalPayment =
document.getElementById("totalPayment");

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

const printBtn =
document.getElementById("printResult");

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
 SYNC RANGE SLIDERS
=============================*/

loanSlider.oninput=function(){

loanAmount.value=this.value;

calculateEMI();

}

interestSlider.oninput=function(){

interestRate.value=this.value;

calculateEMI();

}

yearSlider.oninput=function(){

loanYears.value=this.value;

calculateEMI();

}

loanAmount.oninput=function(){

loanSlider.value=this.value;

calculateEMI();

}

interestRate.oninput=function(){

interestSlider.value=this.value;

calculateEMI();

}

loanYears.oninput=function(){

yearSlider.value=this.value;

calculateEMI();

}

processingFee.oninput=function(){

calculateEMI();

}

/*=============================
 DEFAULT VALUES
=============================*/

loanAmount.value=500000;

interestRate.value=8.5;

loanYears.value=20;

processingFee.value=1;

loanSlider.value=500000;

interestSlider.value=8.5;

yearSlider.value=20;
/*=========================================
 EMI Calculator
 Part 2
 EMI Calculation Engine
=========================================*/

//=============================
// EMI CALCULATION
//=============================

function calculateEMI(){

const P = Number(loanAmount.value);

const annualRate = Number(interestRate.value);

const years = Number(loanYears.value);

const fee = Number(processingFee.value);

const r = annualRate / 12 / 100;

const n = years * 12;

//=============================
// EMI FORMULA
//=============================

let emi = 0;

if(r > 0){

emi =

(P * r * Math.pow(1 + r, n)) /

(Math.pow(1 + r, n) - 1);

}else{

emi = P / n;

}

//=============================
// TOTALS
//=============================

const interest = (emi * n) - P;

const processingCharge =

(P * fee) / 100;

const total =

P + interest + processingCharge;

//=============================
// UPDATE UI
//=============================

monthlyEMI.innerHTML =

formatMoney(emi);

totalInterest.innerHTML =

formatMoney(interest);

totalPayment.innerHTML =

formatMoney(total);

grandTotal.innerHTML =

formatMoney(total);

//=============================
// PIE CHART PERCENTAGE
//=============================

const principalPercent =

document.getElementById("principalPercent");

const interestPercent =

document.getElementById("interestPercent");

if(principalPercent){

principalPercent.innerHTML =

((P/total)*100).toFixed(1)+"%";

}

if(interestPercent){

interestPercent.innerHTML =

((interest/total)*100).toFixed(1)+"%";

}

//=============================
// UPDATE CHART
//=============================

updateChart(

P,

interest,

total,

emi

);

//=============================
// UPDATE TABLE
//=============================

generateSchedule(

P,

annualRate,

years,

emi

);

}

//=============================
// BUTTON EVENTS
//=============================

calculateBtn.addEventListener(

"click",

calculateEMI

);

resetBtn.addEventListener(

"click",

function(){

loanAmount.value=500000;

interestRate.value=8.5;

loanYears.value=20;

processingFee.value=1;

loanSlider.value=500000;

interestSlider.value=8.5;

yearSlider.value=20;

calculateEMI();

}

);

//=============================
// AUTO LOAD
//=============================

window.addEventListener(

"load",

calculateEMI

);
/*=========================================
 EMI Calculator
 Part 3
 Charts + Amortization Schedule
=========================================*/

let emiChart;
let emiPieChart;

/*=========================================
 UPDATE CHARTS
=========================================*/

function updateChart(principal, interest, total, emi){

//=============================
// EMI PAYMENT CHART
//=============================

const lineCanvas=document.getElementById("emiChart");

if(lineCanvas){

if(emiChart){
emiChart.destroy();
}

const yearly=[];

for(let i=1;i<=5;i++){
yearly.push(emi*12*i);
}

emiChart=new Chart(lineCanvas,{

type:"line",

data:{

labels:["Year 1","Year 5","Year 10","Year 15","Year 20"],

datasets:[{

label:"Total EMI Paid",

data:yearly,

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

//=============================
// PIE CHART
//=============================

const pieCanvas=document.getElementById("emiPieChart");

if(pieCanvas){

if(emiPieChart){
emiPieChart.destroy();
}

emiPieChart=new Chart(pieCanvas,{

type:"doughnut",

data:{

labels:[
"Principal",
"Interest"
],

datasets:[{

data:[
principal,
interest
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

/*=========================================
 AMORTIZATION TABLE
=========================================*/

function generateSchedule(

principal,

annualRate,

years,

emi

){

const tbody=document.getElementById("emiTable");

if(!tbody) return;

tbody.innerHTML="";

const monthlyRate=annualRate/12/100;

let balance=principal;

for(let month=1;month<=years*12;month++){

const interest=balance*monthlyRate;

const principalPaid=emi-interest;

balance-=principalPaid;

if(balance<0){
balance=0;
}

tbody.innerHTML+=`

<tr>

<td>${month}</td>

<td>${formatMoney(emi)}</td>

<td>${formatMoney(principalPaid)}</td>

<td>${formatMoney(interest)}</td>

<td>${formatMoney(balance)}</td>

</tr>

`;

}

}
/*=========================================
 EMI Calculator
 Part 4
 PDF • Print • Copy • Share • Save
=========================================*/

//=============================
// PDF REPORT
//=============================

pdfBtn.addEventListener("click", downloadPDF);

function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

pdf.setFont("helvetica","bold");
pdf.setFontSize(20);
pdf.text("EMI Calculator Report",20,20);

pdf.setFontSize(11);

pdf.text("Rajaram Finance Calculators",20,30);

pdf.line(20,35,190,35);

pdf.text("Loan Amount : ₹"+loanAmount.value,20,50);

pdf.text("Interest Rate : "+interestRate.value+"%",20,60);

pdf.text("Loan Tenure : "+loanYears.value+" Years",20,70);

pdf.text("Processing Fee : "+processingFee.value+"%",20,80);

pdf.setFontSize(14);

pdf.text("Calculation Result",20,100);

pdf.setFontSize(11);

pdf.text("Monthly EMI : "+monthlyEMI.innerText,20,112);

pdf.text("Total Interest : "+totalInterest.innerText,20,122);

pdf.text("Total Payment : "+totalPayment.innerText,20,132);

pdf.text("Grand Total : "+grandTotal.innerText,20,142);

pdf.setFontSize(10);

pdf.text("Generated on : "+new Date().toLocaleDateString(),20,165);

pdf.text("This report is for educational purposes only.",20,175);

pdf.save("EMI_Report.pdf");

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

const text=

`EMI Calculator Result

Loan Amount : ₹${loanAmount.value}

Interest Rate : ${interestRate.value}%

Loan Tenure : ${loanYears.value} Years

Monthly EMI : ${monthlyEMI.innerText}

Total Interest : ${totalInterest.innerText}

Total Payment : ${totalPayment.innerText}`;

navigator.clipboard.writeText(text);

showToast("Copied Successfully");

});

//=============================
// SHARE RESULT
//=============================

shareBtn.addEventListener("click",async()=>{

const text=

`EMI Calculator

Monthly EMI : ${monthlyEMI.innerText}

Total Payment : ${totalPayment.innerText}`;

if(navigator.share){

await navigator.share({

title:"EMI Calculator",

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

JSON.parse(localStorage.getItem("emiHistory"))||[];

history.unshift({

date:new Date().toLocaleString(),

loan:loanAmount.value,

rate:interestRate.value,

years:loanYears.value,

emi:monthlyEMI.innerText,

interest:totalInterest.innerText,

payment:totalPayment.innerText

});

localStorage.setItem(

"emiHistory",

JSON.stringify(history)

);

showToast("Calculation Saved");

});

//=============================
// TOAST MESSAGE
//=============================

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
 EMI Calculator
 Part 5 (Final)
 Dark Mode • History • Back To Top
=========================================*/

//=============================
// DARK MODE
//=============================

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

//=============================
// BACK TO TOP
//=============================

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

//=============================
// VIEW HISTORY
//=============================

saveBtn.addEventListener("dblclick",()=>{

const history=JSON.parse(

localStorage.getItem("emiHistory")

)||[];

if(history.length===0){

alert("No saved calculations.");

return;

}

let output="Saved EMI Calculations\n\n";

history.forEach((item,index)=>{

output+=

(index+1)+". "

+item.date+

"\nLoan : ₹"+item.loan+

"\nRate : "+item.rate+"%"

+"\nYears : "+item.years

+"\nEMI : "+item.emi

+"\nPayment : "+item.payment

+"\n\n";

});

alert(output);

});

//=============================
// CLEAR HISTORY
//=============================

function clearHistory(){

if(confirm("Delete all saved EMI history?")){

localStorage.removeItem("emiHistory");

showToast("History Cleared");

}

}

//=============================
// KEYBOARD SHORTCUTS
//=============================

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

calculateEMI();

}

if(e.key==="Escape"){

resetBtn.click();

}

});

//=============================
// FIRST LOAD
//=============================

window.addEventListener("load",()=>{

calculateEMI();

});

//=============================
// CONSOLE MESSAGE
//=============================

console.log(

"Rajaram Finance Calculators - EMI Calculator Loaded Successfully"

);
