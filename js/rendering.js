"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

const renderingFailed = (error) => {
    const getErrorMessage = (type) => {
        switch (type) {
            case "storage":
                return "An error occurred while accessing local storage";
            case "parent":
                return "An error occurred while inserting rendered data";
            default:
                return "An unexpected error occurred";
        }
    };

    const msg = error.message
        ? `${getErrorMessage(error.type)}: ${error.message}`
        : `${getErrorMessage(error.type)}!`;
    console.warn(msg);
    alert(msg);
};

const copy = (value) => {
    if (value !== "") {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value);
        } else {
            let hidden = document.createElement("input");
            hidden.disabled = true;
            hidden.type = "hidden";
            hidden.value = value;
            document.appendChild(hidden);
            hidden.select();
            document.execCommand("copy");
            document.removeChild(hidden);
        }
    }
};

const isHTMLNode = (object) => {
    if (object == null) return false;
    try {
        return object instanceof Node || object instanceof HTMLElement;
    } catch (e) {
        console.warn(e);
        return false;
    }
};

const generateDivContainingTag = (tag, cssClassArray, text) => {
    let div = document.createElement("div");
    let h = document.createElement(tag);
    h.classList.add(...cssClassArray);
    h.textContent = text;
    div.appendChild(h);
    return div;
};

const generateLabel = (key, value) => {
    value = value ? value : null;
    let label = document.createElement("label");
    label.classList.add("input-group", "flex-nowrap", "my-2");

    let span = document.createElement("span");
    span.classList.add("col-2", "col-xl-1", "input-group-text", "fw-bold");
    span.textContent = key;
    label.appendChild(span);

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.placeholder = "No source found!";
    input.value = value;
    input.disabled = true;
    label.appendChild(input);

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add(
        "copy-value",
        "btn",
        "btn-primary",
        "text-nowrap",
        "d-flex",
        "flex-nowrap",
        "gap-2"
    );

    let iButton = document.createElement("i");
    iButton.classList.add("icon", "bi", "bi-clipboard");
    iButton.setAttribute("aria-hidden", "true");
    button.appendChild(iButton);

    let spanButton = document.createElement("span");
    spanButton.classList.add("d-none", "d-md-inline-block");
    spanButton.textContent = "Copy";
    button.appendChild(spanButton);

    label.appendChild(button);

    let a = document.createElement("a");
    a.classList.add(
        "btn",
        "btn-primary",
        "text-nowrap",
        "d-flex",
        "flex-nowrap",
        "gap-2"
    );
    if (value) {
        a.href = value;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    } else {
        a.href = "#";
    }

    let iA = document.createElement("i");
    iA.classList.add("icon", "bi", "bi-box-arrow-up-right");
    iA.setAttribute("aria-hidden", "true");
    a.appendChild(iA);

    let spanA = document.createElement("span");
    spanA.classList.add("d-none", "d-md-inline-block");
    spanA.textContent = "Open";
    a.appendChild(spanA);

    label.appendChild(a);
    return label;
};

const generateDataOverview = (data) => {
    let placeholder = $("#placeholder");
    let newPlaceholder = document.createElement("div");
    newPlaceholder.id = "placeholder";
    placeholder.parentNode.replaceChild(newPlaceholder, placeholder);
    placeholder = newPlaceholder;

    for (let i = 0; i < data.length; i++) {
        const video = data[i];

        let div = generateDivContainingTag("h3", ["my-3"], `${i + 1}. Video`);

        let divMedia = generateDivContainingTag(
            "h5",
            ["my-3"],
            "Media Sources"
        );
        let divMediaLabel = document.createElement("div");

        let divParent = generateDivContainingTag("h5", ["my-3"], "Sources");
        let divParentLabel = document.createElement("div");

        let divChilds = generateDivContainingTag(
            "h5",
            ["my-3"],
            "Child Sources"
        );

        for (const media of video.media) {
            divMediaLabel.appendChild(generateLabel(media.key, media.value));
        }

        for (const parent of video.parent) {
            divParentLabel.appendChild(generateLabel(parent.key, parent.value));
        }

        for (let j = 0; j < video.childs.length; j++) {
            const childs = video.childs[j];
            let divChild = generateDivContainingTag(
                "h5",
                ["my-3"],
                `${j + 1}. Child`
            );
            let divChildLabel = document.createElement("div");

            for (const child of childs) {
                divChildLabel.appendChild(
                    generateLabel(child.key, child.value)
                );
            }

            divChild.appendChild(divChildLabel);
            divChilds.appendChild(divChild);
        }

        divMedia.appendChild(divMediaLabel);
        div.appendChild(divMedia);

        divParent.appendChild(divParentLabel);
        div.appendChild(divParent);

        div.appendChild(divChilds);

        try {
            if (isHTMLNode(placeholder) && isHTMLNode(div)) {
                placeholder.appendChild(div);
            } else throw new Error();
        } catch (error) {
            renderingFailed({
                type: "parent",
                message: error,
            });
        }
    }
};

const replacePlaceholder = () => {
    let placeholder = $("#placeholder");
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");

    div.id = "placeholder";
    label.classList.add("input-group", "flex-nowrap", "my-2");
    input.type = "text";
    input.classList.add("form-control");
    input.placeholder = "No data received!";
    input.disabled = true;

    label.appendChild(input);
    div.appendChild(label);
    placeholder.parentNode.replaceChild(div, placeholder);
};

const setupEventListener = (data) => {
    $("#clear-storage").addEventListener("click", async (event) => {
        try {
            await browser.storage.local.remove("data");
            getData();
        } catch (error) {
            renderingFailed({
                type: "storage",
                message: error,
            });
        }
    });

    $("#copy-json").addEventListener("click", (event) => {
        copy(data === null ? JSON.stringify({}) : JSON.stringify(data));
    });

    const elements = $$(".copy-value");
    for (const element of elements) {
        element.addEventListener("click", (event) => {
            const target = event.currentTarget;
            if (event.type === "click") {
                copy($("input", target.parentNode).value);
            }
        });
    }
};

const render = (data) => {
    if (data === null) {
        replacePlaceholder();
    } else {
        generateDataOverview(data);
    }

    setupEventListener(data);
};

const getData = async () => {
    try {
        const storage = await browser.storage.local.get({ data: null });
        render(storage.data);
    } catch (error) {
        renderingFailed({
            type: "storage",
            message: error,
        });
    }
};

getData();

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") getData();
});
