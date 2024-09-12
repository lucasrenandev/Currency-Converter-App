"use strict";

const selectors = document.querySelectorAll(".select-field .select-box select");
const selectFrom = document.querySelector(".select-field .select-box #select-from");
const selectTo = document.querySelector(".select-field .select-box #select-to");
const exchangeIcon = document.querySelector(".select-field .fa-exchange-alt");
const getRateButton = document.querySelector(".footer button");

const loadCountryList = () => {
    for(let i = 0; i < selectors.length; i++) {
        for(let country in countryList) {
            let selected = "";
            if(i === 0) {
                selected = country === "USD" ? "selected" : "";
            }
            else if(i === 1) {
                selected = country === "BRL" ? "selected" : "";
            }
            const optionTag = `<option value="${country}" ${selected}>${country}</option>`;
            selectors[i].insertAdjacentHTML("beforeend", optionTag);
        }
        selectors[i].addEventListener("change", (event) => {
            loadFlagIcon(event.target);
        });
    }
}

const loadFlagIcon = (element) => {
    for(let flagCode in countryList) {
        if(flagCode === element.value) {
            const imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${countryList[flagCode]}/flat/64.png`;
        }
    }
}

const getExchangeRate = async () => {
    const input = document.querySelector(".input-field input");
    const info = document.querySelector(".footer p");
    let inputValue = +input.value;

    const apiKey = "13d4cc3c51842a1e34a65265";
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${selectFrom.value}`;
    const requestSearch = await fetch(url);
    const data = await requestSearch.json();

    if(inputValue === 0) {
        input.value = 1;
        inputValue = 1;
    }

    info.textContent = "Getting exchange rate...";

    try {
        const exchangeRate = data.conversion_rates[selectTo.value];
        const totalExchangeRate = (inputValue * exchangeRate).toFixed(2);
        info.textContent = `${inputValue.toLocaleString()} ${selectFrom.value} = ${totalExchangeRate} ${selectTo.value}`;
    }
    catch {
        info.textContent = "Something went wrong!";
    } 

    input.addEventListener("keydown", (event) => {
        if(event.code === "KeyE" || event.keyCode === 69) {
            event.preventDefault();
        }
    });
}

exchangeIcon.addEventListener("click", () => {
    let tempCode = selectFrom.value;
    selectFrom.value = selectTo.value;
    selectTo.value = tempCode;
    getExchangeRate();
    loadFlagIcon(selectFrom);
    loadFlagIcon(selectTo);
});

window.addEventListener("load", () => {
    loadCountryList();
    getExchangeRate();
});

getRateButton.addEventListener("click", getExchangeRate);