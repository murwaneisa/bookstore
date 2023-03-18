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
const pageCache = {};
async function loadPage(src = location.pathname) {
  src = src === "/" ? "/start" : src;
  src = `/html/pages/${src}.html`;
  let html = pageCache[src] || (await fetchText(src));
  pageCache[src] = html;
  console.log("html", html);
  console.log("src", src);

  if (src === "/html/pages//about.html") {
    console.log("true", true);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log("doc", doc);
    const title = doc.getElementById("title");
    title.textContent = "New Page Title";
    doc.body.appendChild(heading);
    html = doc.documentElement.outerHTML;
  }
  if (src !== "/html/pages//start.html") {
    $("main").innerHTML = html;
  }

  if (src === "/html/pages//start.html") {
    /*  convert the HTML string to a DOM tree using the DOMParser object */
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    /* get the div with the id  */
    const selectedElement = doc.querySelector("#bookCards");
    selectedElement.textContent = "New Page Title";
    html = doc.documentElement.outerHTML;
  }

  $("main").innerHTML = html;
  // run componentMount (mount new components if any)
  componentMount();
  // set active link in navbar
  setActiveLinkInNavbar();
}

const bookCards = () => {
  data.map({});
};

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

/* unction start() {
  let html = "";

 

  html += `
   <section class="hero">
        <div class="container d-flex justify-content-center align-items-center">
          <div
            class="row flex-lg-row flex-column d-flex justify-content-center align-items-center"
          >
            <div>
              <!-- text box -->
              <div class="mb-3">
                <div class="col-md-6"><h1>find your book</h1></div>
                <div class="col-md-6">
                  <h4>Save up to 90% on millions of titles</h4>
                </div>
              </div>
              <!-- end of text box  -->
              <!-- search bar  -->

              <div
                class="form col-md-6 d-flex align-items-center justify-content-center"
              >
                <i class="fa fa-search d-flex align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                  </svg>
                </i>
                <input
                  type="text"
                  class="form-control form-input"
                  placeholder="Search your book..."
                />
              </div>
              <!-- end of search bar  -->
            </div>
          </div>
        </div>
      </section>
   `;
  bookCards();

  console.log("get the element", document.querySelector("main"));
  document.querySelector("main").innerHTML = html;
} */

// mount components and load the page
componentMount().then((x) => loadPage());
