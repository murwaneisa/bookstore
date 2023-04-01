// HTML-component + SPA/routing example in Vanilla JS
// © ironboy, Node Hill AB, 2023

// import the main scss file: the scss will compile to css
// and hot reload on changes thanks to Vite
import "../scss/style.scss";
import data from "../public/books-data.json";

// import bootstrap JS part
import * as bootstrap from "bootstrap";

//import { compileString } from "sass";

// helper: grab a DOM element
const $ = (el) => document.querySelector(el);

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

const filter_books_id = (book_id) => {
  return data.filter((filter_books_id) => filter_books_id.id == book_id);
};
const filter_books_cate = (book_cate) => {
  if (book_cate == "all") {
    return data;
  }
  return data.filter((filter_books) => filter_books.category === book_cate);
};

const checkout_array = [];
const checkout = (book_id) => {
  const filteredBook = data.filter(
    (filter_books_id) => filter_books_id.id == book_id
  );
  //console.log("filteredBook", filteredBook);
  checkout_array.push(filteredBook[0]);
  return localStorage.setItem("checkout_array", JSON.stringify(checkout_array));
};

let get_book_id;
let get_book_cate = "all";

$("body").addEventListener("click", (e) => {
  let aElement = e.target.closest("a");
  let book_details = e.target.closest(".details");
  let checkout_id = e.target.closest(".checkout_id");

  let cate_js = e.target.closest(".Javascript");
  if (checkout_id) {
    //console.log("checkout_id", checkout_id.getAttribute("book-checkout"));
    const bookId = checkout_id.getAttribute("book-checkout");
    checkout(bookId);
  }
  if (book_details) {
    get_book_id = book_details.getAttribute("book-id");
    localStorage.setItem("book_id", JSON.stringify(get_book_id));
  }
  /* get the category type*/
  let cate_ux = e.target.closest(".UX");

  let cate_html = e.target.closest(".HTML");

  let cate_css = e.target.closest(".CSS");

  if (cate_ux) {
    get_book_cate = cate_ux.getAttribute("cate_href");
    console.log("cate_href ", get_book_cate);
  }

  if (cate_html) {
    get_book_cate = cate_html.getAttribute("cate_href");
    console.log("cate_href ", get_book_cate);
  }
  if (cate_css) {
    get_book_cate = cate_css.getAttribute("cate_href");
    console.log("cate_href ", get_book_cate);
  }
  if (cate_js) {
    get_book_cate = cate_js.getAttribute("cate_href");
    console.log("cate_href ", get_book_cate);
  }
  /* end of get the category type */
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
});
// when the user navigates back / forward -> load page
window.addEventListener("popstate", () => loadPage());

// load page - soft reload / à la SPA
// (single page application) of the main content

const displayBooks = () => {
  return filter_books_cate(get_book_cate).map(
    ({ title, author, url, price, id }) => /* html */ `
<div class="col-sm-6 col-md-4 col-lg-2">
<div class="card">
  <img
    src=${url}
    class="card-img-top"
    alt="Book Cover"
  />
  <div class="card-body">
    <div class="product-details d-none pe-auto">
      <h6>${title}</h6>
      <p>Author: ${author}</p>
      <p>Price: ${price} $</p>
      <a href="/" class="btn btn-primary mb-1 checkout_id" book-checkout=${id}>Buy</a>
      <a href="/details" class="btn btn-secondary details" book-id=${id} >Show Details</a>
    </div>
  </div>
</div>
</div>
`
  );
};

const checkoutCard = () => {
  const check_data = localStorage.getItem("checkout_array")
    ? JSON.parse(localStorage.getItem("checkout_array"))
    : "";
  return check_data.map(
    ({ title, author, price, url, format }) => /* html */ `
  <tr>
                <th scope="row">
                  <div class="d-flex flex-column flex-md-row .align-items-start align-items-md-center" class="checkout">
                    <img
                      src=${url}
                      class="img-fluid rounded-3"
                      style="width: 120px"
                      alt="Book"
                    />
                    <div class="flex-column ms-0 ms-md-4">
                      <p class="mb-2 md">${title}</p>
                      <p class="mb-0">${author}</p>
                    </div>
                  </div>
                </th>
                <td class="align-middle">
                  <p class="mb-0" style="font-weight: 500">${format}</p>
                </td>
                <td class="align-middle">
                  <div class="d-flex flex-row align-items-center ">
                    <button
                      class="btn btn-link px-2"
                      onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
                    >
                      <!-- minus icon -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-dash-lg"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                        />
                      </svg>
                      <!-- end od minus icon -->
                    </button>

                    <input
                      id="form1"
                      min="0"
                      name="quantity"
                      value="1"
                      type="number"
                      class="form-control form-control-sm"
                      style="width: 50px"
                    />

                    <button
                      class="btn btn-link px-2"
                      onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
                    >
                      <!-- plus icon -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus-lg"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                        />
                      </svg>
                      <!-- end of plus icon -->
                    </button>
                  </div>
                </td>
                <td class="align-middle">
                  <p class="mb-0" style="font-weight: 500">${price}</p>
                </td>
              </tr>
  `
  );
};

const pageCache = {};
async function loadPage(src = location.pathname) {
  src = src === "/" ? "/start" : src;
  src = `/html/pages/${src}.html`;
  let html = pageCache[src] || (await fetchText(src));
  pageCache[src] = html;
  //console.log("html", html);
  //console.log("src", src);

  if (src === "/html/pages//start.html") {
    /*  convert the HTML string to a DOM tree using the DOMParser object */
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    /* get the div with the id  */
    const selectedElement = doc.querySelector("#bookCards");
    /*  change the category name  */
    const cate_title = doc.querySelector("#cate_title");
    cate_title.innerHTML = get_book_cate;
    selectedElement.innerHTML = displayBooks().join("");
    /* convert the modified DOM tree back to an HTML string using the outerHTML property of the root element */
    html = doc.documentElement.outerHTML;
  }
  if (src === "/html/pages//checkout.html") {
    const parse = new DOMParser();
    const document = parse.parseFromString(html, "text/html");
    /* get the div with the id  */
    const selectedElement = document.querySelector("#bookCards");
    /*  change the category name  */
    const chockElement = document.querySelector("#tbody");
    chockElement.innerHTML = checkoutCard().join("");
    html = document.documentElement.outerHTML;
  }

  if (src === "/html/pages//details.html") {
    /*  convert the HTML string to a DOM tree using the DOMParser object */
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    /* get the the book and save it into localStorage */
    // get the book info  from localStorage
    const book_id = localStorage.getItem("book_id")
      ? JSON.parse(localStorage.getItem("book_id"))
      : "";
    const book_info = filter_books_id(book_id);

    doc.querySelector("#img_id").innerHTML = `<img
        id="main-image"
        src=${book_info[0].url}
        width="100%"
      />`;
    doc.querySelector("#title-id").innerHTML = book_info[0].title;
    doc.querySelector("#author-id").innerHTML = book_info[0].author;
    doc.querySelector("#price-id").innerHTML = book_info[0].price;
    doc.querySelector("#description-id").innerHTML = book_info[0].description;
    doc.querySelector("#checkout_det").innerHTML = `<button
    class="btn btn-danger text-uppercase mr-2 px-4 checkout_id" book-checkout=${book_info[0].id}
  >
    Add to cart
  </button>`;

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
function setActiveLinkInNavbar() {
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
}

// mount components and load the page
componentMount().then((x) => loadPage());
