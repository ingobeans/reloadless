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

function onPress(event) {
    event.preventDefault();
    let url = this.getAttribute("href");
    lastClickedLink = url;
    fetch(url).then((response) => {
        response.text().then((text) => {
            if (url != lastClickedLink) {
                return;
            }
            newPageClickHook(text);
            window.history.pushState({ html: text }, "", url);
        })
    })
}

window.addEventListener("popstate", (e) => {
    if (e.state && e.state.html) {
        newPageClickHook(e.state.html);
    }
});


function setUpLinks() {
    let links = document.querySelectorAll("a");
    for (let link of links) {
        if (link.getAttribute("reloadless") != undefined) {
            continue
        }
        link.setAttribute("reloadless", "tracked");
        link.addEventListener("click", onPress.bind(link));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setUpLinks();
})