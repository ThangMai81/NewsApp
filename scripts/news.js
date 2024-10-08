"use strict";
// ------------------------------------------first initialize-------------------------------
let newsContainerEl = document.querySelector("#news-container");
let imgEl = document.querySelectorAll("#news-container img");
let headerEl = document.querySelectorAll("#news-container h5");
let paraEl = document.querySelectorAll("#news-container p");
let linkEl = document.querySelectorAll("#news-container a");
// ++ variable to handle move to next or previous page
const prevBtnEl = document.querySelector("#btn-prev");
const nextBtnEl = document.querySelector("#btn-next");
const numEl = document.querySelector("#page-num");

let numOfEachPage = 3;
let category = "general";
const getData = JSON.parse(getFromStorage("settings", "[]"));
if (JSON.stringify(getData) !== "[]") {
  numOfEachPage = Number(getData.newsPerPage);
  category = getData.category.toLowerCase();
}
// Key of API
const apiKey = "5ca90bff10fb4650b4028719165dfbc7";
// Get data from fetch API
const getFetchData = async () => {
  try {
    const info = await fetch(
      //  `https://newsapi.org/v2/everything?q=Apple&from=2024-07-25&sortBy=popularity&apiKey=${apiKey}`

      // `https://newsapi.org/v2/everything?q=tesla&from=2024-06-27&sortBy=publishedAt&apiKey=${apiKey}`
      // cannot get category from the API, return 404 so only sources is ok
      `https://newsapi.org/v2/top-headlines?category=science&apiKey=${apiKey}`
    );
    const data = await info.json();
    if (data.status !== "ok") {
      throw new Error(
        "Something wrong with the network, reload the page again"
      );
    }
    return data;
  } catch (err) {
    console.log("error in getFetchData(): ", err);
  }
};
// +++ Create new article HTML
function createArticle(article) {
  const newArticle = document.createElement("div");
  newArticle.innerHTML = `<div class="card mb-3" style="">
                          <div class="row no-gutters">
                            <div class="col-md-4">
                              <img
                                src="${
                                  article.urlToImage === null
                                    ? ""
                                    : article.urlToImage
                                }"
                                class="card-img"
                                alt="${
                                  article.title === null
                                    ? "Title is missing 😭, click View for more details of this article! 😊"
                                    : article.title
                                }"
                              />
                            </div>
                            <div class="col-md-8">
                              <div class="card-body">
                                <h5 class="card-title">
                                  ${
                                    article.description === null
                                      ? "Description is missing 😥, click View for more details of this article! 😊"
                                      : article.description
                                  }
                                </h5>
                                <p class="card-text">
                                  ${
                                    article.content === null
                                      ? "Content of article is missing 🥹, click View for more details of this article! 😊"
                                      : article.content
                                  }
                                </p>
                                <a
                                  href="${article.url}"
                                  class="btn btn-primary"
                                  >View</a
                                >
                              </div>
                            </div>
                          </div>
                          </div>
                          </div>`;
  newArticle.classList.add("card");
  newArticle.classList.add("flex-row");
  newArticle.classList.add("flex-wrap");
  // if any field such as content, urlToImage, ... is null, re
  return newArticle;
}
// --------------------------------------- render the first page for user --------------------------
// +++ Render first page
async function renderFirstPage() {
  try {
    const data = await getFetchData();
    // const data = await info.json();
    prevBtnEl.classList.add("hidden");
    for (let i = 0; i < numOfEachPage; i++) {
      newsContainerEl.appendChild(createArticle(data.articles[i]));
    }
  } catch (err) {
    console.log("error in function renderFirstPage(): ", err);
  }
}
// +++ always render first page when user get first access to the news session
renderFirstPage();
// --------------------------------------- handling render each page
// +++ Function remove previous articles in html when render a new page
function removeArticles() {
  let childFirst = newsContainerEl.firstChild;
  while (childFirst) {
    newsContainerEl.removeChild(childFirst);
    childFirst = newsContainerEl.firstChild;
  }
}
// +++ Function render each page
function renderPage(start, end, articles) {
  newsContainerEl = document.querySelector("#news-container");
  removeArticles();
  console.log("Start and end - 1 index of articles: ", start, end);
  for (let i = start; i < end; i++) {
    newsContainerEl.appendChild(createArticle(articles[i]));
  }
}

// --------------------------------------- handling prev button ----------------------------------
prevBtnEl.addEventListener("click", async function () {
  try {
    const data = await getFetchData();
    const currentPage = Number(numEl.textContent);
    if (currentPage === 2) {
      prevBtnEl.classList.add("hidden");
    }
    const indexOfPrevPage = (currentPage - 2) * numOfEachPage;
    numEl.textContent = String(currentPage - 1);
    nextBtnEl.classList.remove("hidden");
    renderPage(indexOfPrevPage, indexOfPrevPage + numOfEachPage, data.articles);
    if (data.articles.length < numOfEachPage) {
      nextBtnEl.classList.add("hidden");
    }
  } catch (err) {
    console.log("error when click prevBtnEl: ", err);
  }
});
nextBtnEl.addEventListener("click", async function () {
  try {
    const data = await getFetchData();
    // variable for calculating index of next page
    const currentPage = Number(numEl.textContent);
    // totalResults of api sometimes not true with the number of articles in data,
    // using directly the length of articles array in data
    const numInLastPage = data.articles.length % numOfEachPage;
    const numOfFullPages = parseInt(data.articles.length / numOfEachPage);
    const indexOfNextPage = currentPage * numOfEachPage;
    // if currentPage is the previous page of last page (in case numInLastPage > 0)
    if (currentPage === numOfFullPages) {
      // if last page has the number of articles < numOfEachPage, we have to render differently
      if (numInLastPage > 0) {
        numEl.textContent = String(currentPage + 1);
        nextBtnEl.classList.add("hidden");
        prevBtnEl.classList.remove("hidden");
        renderPage(
          indexOfNextPage,
          indexOfNextPage + numInLastPage,
          data.articles
        );
        return;
      }
    }
    // if currentPage is the previous page of last page (in case numInLastPage === 0),
    // just render as usual, but hide next button afterwards
    if (currentPage === numOfFullPages - 1) {
      if (numInLastPage === 0) {
        nextBtnEl.classList.add("hidden");
        console.log("Second situation!");
      }
    }
    numEl.textContent = String(currentPage + 1);
    prevBtnEl.classList.remove("hidden");
    // another situation , just render as normal
    renderPage(indexOfNextPage, indexOfNextPage + numOfEachPage, data.articles);
  } catch (err) {
    console.log("error when click nextBtnEl: ", err);
  }
});
