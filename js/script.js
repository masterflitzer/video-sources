"use strict";

function copyFromB64ById(id) {
    let copy;
    let element = document.getElementById(id);
    if (element.hasOwnProperty("textContent")) {
        copy = atob(element.textContent);
    } else if (element.hasOwnProperty("value")) {
        copy = atob(element.value);
    } else {
        copy = atob(element.innerText);
    }
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(copy);
    } else {
        let hidden = document.createElement("input");
        hidden.disabled = true;
        hidden.type = "hidden";
        hidden.value = copy;
        document.appendChild(hidden);
        hidden.select();
        document.execCommand("copy");
        document.removeChild(hidden);
    }
}
