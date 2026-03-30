lastClickedLink = undefined;

function newPageClickHook(newText) {
    document.documentElement.innerHTML = newText;
    setUpLinks();
}

function onPress(event) {
    event.preventDefault();
    let url = this.getAttribute("href");
    lastClickedLink = url;
    console.log(url);
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
    if (e.state) {
        document.documentElement.innerHTML = e.state.html;
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
    console.log("WA");
    setUpLinks();
})