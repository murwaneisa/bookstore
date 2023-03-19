// HTML-component + SPA/routing example in Vanilla JS
// © ironboy, Node Hill AB, 2023

// import the main scss file: the scss will compile to css
// and hot reload on changes thanks to Vite
import "../scss/style.scss";
import data from "../public/books-data.json";

// import bootstrap JS part
import * as bootstrap from "bootstrap";

// helper: grab a DOM element
const $ = (el) => document.querySelector(el);
console.log("$", $);

// helper: fetch a text/html file (and remove vite injections)
const fetchText = async (url) =>
  (await (await fetch(url)).text()).replace(
    /<script.+?vite\/client.+?<\/script>/g,
    ""
  );

// helper: replace a DOM element with new element(s) from html string
function replaceElement(element, html, remove = true) {
  let div = document.createElement("div");
  div.innerHTML = html;
  for (let newElement of [...div.children]) {
    element.after(newElement, element);
  }
  remove && element.remove();
}

// mount components (tags like <component="app"> etc
// will be replaced with content from the html folder)
async function componentMount() {
  while (true) {
    let c = $("component");
    if (!c) {
      break;
    }
    let src = `/html${c.getAttribute("src")}.html`;
    let html = await fetchText(src);
    replaceElement(c, html);
  }
  repeatElements();
}

// repeat DOM elements if they have the attribute
// repeat = "x" set to a positive number
function repeatElements() {
  while (true) {
    let r = $("[repeat]");
    if (!r) {
      break;
    }
    let count = Math.max(1, +r.getAttribute("repeat"));
    r.removeAttribute("repeat");
    for (let i = 0; i < count - 1; i++) {
      let html = unsplashFix(r.outerHTML);
      replaceElement(r, html, false);
    }
  }
}

// special fix on repeat of random unsplash image
// (so that we don't cache and show the same image)
/* function unsplashFix(html) {
  return html.replace(
    /(https:\/\/source.unsplash.com\/random\/?[^"]*)/g,
    "$1&" + Math.random()
  );
} */

// listen to click on all a tags
/* $("body").addEventListener("click", (e) => {
  let aElement = e.target.closest("a");
  if (!aElement) {
    return;
  }
  let href = aElement.getAttribute("href");
  // do nothing if external link (starts with http)
  if (href.indexOf("http") === 0) {
    return;
  }
  // do nothing if just '#'
  if (href === "#") {
    return;
  }
  // prevent page reload
  e.preventDefault();
  // 'navigate' / change url
  history.pushState(null, null, href);
  // load the page
  loadPage(href);
}); */

// when the user navigates back / forward -> load page
/* window.addEventListener("popstate", () => loadPage()); */

// load page - soft reload / à la SPA
// (single page application) of the main content
console.log("data", data);

const displayBooks = () => {
  return data.map(
    ({ title, author, url, price }) => /* html */ `
<div class="col-sm-6 col-md-4 col-lg-2">
<div class="card">
  <img
    src=${url}
    class="card-img-top"
    alt="Book Cover"
  />
  <div class="card-body">
    <div class="product-details d-none pe-auto">
      <h5>${title}</h5>
      <p>Author: ${author}</p>
      <p>Price: ${price} $</p>
      <a href="#" class="btn btn-primary mb-1">Buy</a>
      <a href="#" class="btn btn-secondary">Show Details</a>
    </div>
  </div>
</div>
</div>
`
  );
};

const pageCache = {};
async function loadPage(src = location.pathname) {
  src = src === "/" ? "/start" : src;
  src = `/html/pages/${src}.html`;
  let html = pageCache[src] || (await fetchText(src));
  pageCache[src] = html;
  console.log("html", html);
  console.log("src", src);

  if (src !== "/html/pages//start.html") {
    $("main").innerHTML = html;
  }

  if (src === "/html/pages//start.html") {
    /*  convert the HTML string to a DOM tree using the DOMParser object */
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    /* get the div with the id  */
    const selectedElement = doc.querySelector("#bookCards");
    selectedElement.innerHTML = displayBooks().join("");
    /* convert the modified DOM tree back to an HTML string using the outerHTML property of the root element */
    html = doc.documentElement.outerHTML;
  }

  $("main").innerHTML = html;
  // run componentMount (mount new components if any)
  componentMount();
  // set active link in navbar
  setActiveLinkInNavbar();
}

// set the correct link active in navbar match on
// the attributes 'href' and also 'active-if-url-starts-with'
/* function setActiveLinkInNavbar() {
  let href = location.pathname;
  let oldActive = $("nav .active");
  let newActive = $(`nav a[href="${href}"]:not(.navbar-brand)`);
  if (!newActive) {
    // match against active-if-url-starts-with
    for (let aTag of $("nav").querySelectorAll("a")) {
      let startsWith = aTag.getAttribute("active-if-url-starts-with");
      newActive = startsWith && href.indexOf(startsWith) === 0 && aTag;
      if (newActive) {
        break;
      }
    }
  }
  oldActive && oldActive.classList.remove("active");
  newActive && newActive.classList.add("active");
} */

// mount components and load the page
componentMount().then((x) => loadPage());
