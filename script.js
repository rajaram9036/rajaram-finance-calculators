document.addEventListener("DOMContentLoaded", function () {

const search = document.querySelector(".search-box") || document.querySelector(".search");

if (!search) return;

search.addEventListener("keyup", function () {

let value = this.value.toLowerCase();

let cards = document.querySelectorAll(".card");

cards.forEach(function(card){

let text = card.innerText.toLowerCase();

if(text.includes(value)){
card.style.display = "block";
}else{
card.style.display = "none";
}

});

});

});
