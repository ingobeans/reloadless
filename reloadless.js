// used to track which link was last pressed.
// if you click one link, then another before the first finishes loading,
// this variable ensures you will only be sent to the second link.
lastClickedLink = undefined;

function newPageClickHook(newText) {
    // this hook follows the standard link click behaviour,
    // but can be replaced with anything!
    document.documentElement.innerHTML = newText;
    setUpLinks();
}

originalState = undefined;

function onPress(event) {
    event.preventDefault();
    let url = this.getAttribute("href");
    lastClickedLink = url;
    fetch(url).then((response) => {
        response.text().then((text) => {
            if (url != lastClickedLink) {
                return;
            }
            if (window.history.state == null) {
                originalState = { html: document.documentElement.innerHTML };
            }
            newPageClickHook(text);
            window.history.pushState({ html: text }, "", url);
        })
    })
}

window.addEventListener("popstate", (e) => {
    if (e.state && e.state.html) {
        if (originalState == undefined) {
            originalState = { html: document.documentElement.innerHTML };
        }
        newPageClickHook(e.state.html);
    } else if (originalState) {
        var doc = new DOMParser().parseFromString(originalState.html, "text/html");
        let links = doc.querySelectorAll("a[reloadless='tracked']");
        for (let link of links) {
            link.setAttribute("reloadless", null);
        }
        newPageClickHook(doc.documentElement.innerHTML);
    }
});


function setUpLinks() {
    let links = document.querySelectorAll("a[reloadless]:not([reloadless='tracked'])");
    for (let link of links) {
        link.setAttribute("reloadless", "tracked");
        link.addEventListener("click", onPress.bind(link));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setUpLinks();
})