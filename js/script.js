"use strict";
chrome.runtime.sendMessage({ type: "req" }, (response) => {
    let data = response.payload;
    if (data === undefined || data.length === 0) {
        alert("No video element could be found!");
    } else {
        generateDataOverview(data);
        document.querySelector("#copy-json").addEventListener("click", () => {
            copy(JSON.stringify(data));
        });
        document.querySelectorAll(".copy-value").forEach((element) => {
            element.addEventListener("click", (event) => {
                let clicked = event.currentTarget;
                if (event.type === "click") {
                    let target = clicked.parentNode.querySelector("input");
                    copy(target.value);
                }
            });
        });
    }
});

document.querySelector("#copy-json").addEventListener("click", () => {
    let icon = document.querySelector("#clipboard-icon");
    icon.setAttribute(
        "class",
        icon.attributes.class.value.replace(
            "bi-clipboard-data",
            "bi-clipboard-check"
        )
    );
    setTimeout(() => {
        icon.setAttribute(
            "class",
            icon.attributes.class.value.replace(
                "bi-clipboard-check",
                "bi-clipboard-data"
            )
        );
        document.querySelector("#copy-json").blur();
    }, 5000);
});

function copy(value) {
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
}

function generateDataOverview(data) {
    let html = document.querySelector("#placeholder");

    for (let i = 0; i < data.length; i++) {
        const video = data[i];

        let div = generateDivContainingTag("h3", ["my-4"], `${i + 1}. Video`);

        let divMedia = generateDivContainingTag(
            "h5",
            ["my-4"],
            "Media Sources"
        );
        let divMediaLabel = document.createElement("div");

        let divParent = generateDivContainingTag("h5", ["my-4"], "Sources");
        let divParentLabel = document.createElement("div");

        let divChilds = generateDivContainingTag(
            "h5",
            ["my-4"],
            "Child Sources"
        );

        for (let j = 0; j < video.media.length; j++) {
            const media = video.media[j];
            divMediaLabel.appendChild(generateLabel(media.key, media.value));
        }

        for (let j = 0; j < video.parent.length; j++) {
            const parent = video.parent[j];
            divParentLabel.appendChild(generateLabel(parent.key, parent.value));
        }

        for (let j = 0; j < video.childs.length; j++) {
            const childs = video.childs[j];
            let divChild = generateDivContainingTag(
                "h5",
                ["my-4"],
                `${j + 1}. Child`
            );
            let divChildLabel = document.createElement("div");

            for (let k = 0; k < childs.length; k++) {
                const child = childs[k];
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

        if (isHTMLNode(html) && isHTMLNode(div)) html.appendChild(div);
    }

    function isHTMLNode(object) {
        if (object == null) return false;
        else
            try {
                return object instanceof Node || object instanceof HTMLElement;
            } catch (e) {
                console.error(e);
                return false;
            }
    }

    function generateDivContainingTag(tag, cssArray, text) {
        let div = document.createElement("div");
        div.appendChild(
            (() => {
                let h = document.createElement(tag);
                h.classList.add(cssArray);
                h.textContent = text;
                return h;
            })()
        );
        return div;
    }

    function generateLabel(key, value) {
        let label = document.createElement("label");
        label.classList.add("input-group", "flex-nowrap", "my-2");

        label.appendChild(
            (() => {
                let span = document.createElement("span");
                span.classList.add("col-1", "input-group-text", "fw-bold");
                span.textContent = key;
                return span;
            })()
        );

        label.appendChild(
            (() => {
                let input = document.createElement("input");
                input.type = "text";
                input.classList.add("form-control");
                input.placeholder = "No source found!";
                input.value = value;
                input.disabled = true;
                return input;
            })()
        );

        label.appendChild(
            (() => {
                let button = document.createElement("button");
                button.type = "button";
                button.classList.add("copy-value", "btn", "btn-primary");
                button.appendChild(
                    (() => {
                        let span = document.createElement("span");
                        span.classList.add("d-none", "d-lg-inline-block");
                        span.textContent = "Copy";
                        return span;
                    })()
                );
                button.appendChild(
                    (() => {
                        let i = document.createElement("i");
                        i.classList.add("icon", "bi", "bi-clipboard", "ms-1");
                        return i;
                    })()
                );
                return button;
            })()
        );

        label.appendChild(
            (() => {
                let a = document.createElement("a");
                a.classList.add("btn", "btn-primary");
                a.href = value;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.appendChild(
                    (() => {
                        let span = document.createElement("span");
                        span.classList.add("d-none", "d-lg-inline-block");
                        span.textContent = "Open";
                        return span;
                    })()
                );
                a.appendChild(
                    (() => {
                        let i = document.createElement("i");
                        i.classList.add(
                            "icon",
                            "bi",
                            "bi-box-arrow-up-right",
                            "ms-1"
                        );
                        return i;
                    })()
                );
                return a;
            })()
        );

        return label;
    }
}
