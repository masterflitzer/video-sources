"use strict";

function copyFromB64ById(id) {
    let element = document.getElementById(id);
    if (!element) {
        return false;
    } else {
        let copy;
        try {
            if ("value" in element) {
                copy = atob(element.value);
            } else if ("textContent" in element) {
                copy = atob(element.textContent);
            } else {
                copy = atob(element.innerText);
            }
        } catch (error) {
            return false;
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
            return true;
        }
    }
}
