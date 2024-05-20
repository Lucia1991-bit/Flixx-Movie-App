//建立Router
const  global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0
  },
  api: {
    apiKey: "2f96111930e53948a1d2d7ed6fb54ef3",
    apiURL: "https://api.themoviedb.org/3/"
  }
}

//Display 20 most popular Movie at homepage
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("card");
    //如果 poster_path存在，顯示 poster_path
    //如果沒有，顯示預設圖片
    movieCard.innerHTML = `
        <div>
          <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path ? 
              `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
              />` : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
              />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">上映日: ${movie.release_date}</small>
            </p>
          </div>
        </div>
    `;
    document.querySelector("#popular-movies").appendChild(movieCard);

  })
}

//Display popular tv show at homepage
async function displayPopularTVshows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach(show => {
    const tvCard = document.createElement("div");
    tvCard.classList.add("card");
    //如果 poster_path存在，顯示 poster_path
    //如果沒有，顯示預設圖片
    tvCard.innerHTML = `
        <div>
          <a href="tv-details.html?id=${show.id}">
            ${show.poster_path ? 
              `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
              />` : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
              />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">播出日: ${show.first_air_date}</small>
            </p>
          </div>
        </div>
    `;
    document.querySelector("#popular-shows").appendChild(tvCard);
  })
}

//Display movie details
async function displayMovieDetails() {
  //取得 URL查詢參數方法1:
                                         //?id=823464
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("id");
  //取得 URL查詢參數方法2:
                                         //[?id, 823464]
  //const movieID = window.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieID}`);
  const translateMovie = await fetchAPIData(`movie/${movieID}/translations`);
  const englishOverview  = translateMovie.translations[0].data.overview;

  movie.genres.forEach((genre) => {
    const {id, name} = genre;
    console.log("genre id: " + id + ", genre name: " + name);
  })

  //Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="details-top">
          <div>
            ${movie.poster_path ? 
              `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
              />` : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
              />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <h3>${movie.original_title}</h3>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">上映日: ${movie.release_date}</p>
            ${movie.overview ? 
              `<p>${movie.overview}</p>` : `<p>${englishOverview}(暫無中文翻譯)</p>`
            }
            
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map(genre => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${movie.home}" target="_blank" class="btn">Visit Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            ${movie.budget ?
              `<li><span class="text-secondary">預算:</span> $${addCommasToNumber(movie.budget)}</li>` :
              ` <li><span class="text-secondary">預算:</span> 暫無資料</li>`}
            ${movie.revenue ?
              `<li><span class="text-secondary">票房:</span> $${addCommasToNumber(movie.revenue)}</li>` :
              ` <li><span class="text-secondary">票房:</span> 暫無資料</li>`}
            <li><span class="text-secondary">片長:</span> ${movie.runtime} 分鐘</li>
            <li><span class="text-secondary">狀態:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movie.production_companies
              .map(company => `<span>${company.name}</span>`)
              .join(", ")}
          </div>
        </div>
  `;
  document.querySelector("#movie-details").appendChild(div);
}


//Display tv-show details
async function displayShowDetails() {
  //取得 URL查詢參數方法1:
                                         //?id=823464
  const urlParams = new URLSearchParams(window.location.search);
  const showID = urlParams.get("id");
  //取得 URL查詢參數方法2:
                                         //[?id, 823464]
  //const showID = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showID}`);
  console.log(show);

  const translateShow = await fetchAPIData(`tv/${showID}/translations`);
  const englishOverview  = translateShow.translations[0].data.overview;


  show.genres.forEach((genre) => {
    const {id, name} = genre;
    console.log("genre id: " + id + ", genre name: " + name);
  })

  //Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="details-top">
          <div>
            ${show.poster_path ? 
              `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
              />` : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
              />`
            }
          </div>
          <div>
            <h2>${show.name}</h2>
            <h3>${show.original_name}</h3>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">最後播出日: ${show.last_air_date}</p>
            ${show.overview ? 
              `<p>${show.overview}</p>` : `<p>${englishOverview}(暫無中文翻譯)</p>`
            }
            
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map(genre => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${show.home}" target="_blank" class="btn">Visit Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>TV Series Info</h2>
          <ul>
            ${show.number_of_seasons ?
              `<li><span class="text-secondary">季數:</span> ${show.number_of_seasons}季</li>` :
              ` <li><span class="text-secondary">季數:</span> 暫無資料</li>`}
            ${show.number_of_episodes ?
              `<li><span class="text-secondary">集數:</span> ${show.number_of_episodes}集</li>` :
              ` <li><span class="text-secondary">集數:</span> 暫無資料</li>`}
            <li><span class="text-secondary">狀態:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${show.production_companies
              .map(company => `<span>${company.name}</span>`)
              .join(", ")}
          </div>
        </div>
  `;
  document.querySelector("#show-details").appendChild(div);
}


//Display Backdrop on Detail Pages(include movies and tv-shows)
function displayBackgroundImage(type, backdropPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdropPath})`;
  overlayDiv.classList.add("overlay");
  
  //檢查圖片類別是 movie還是 tv-shows
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

//Search Movies / Shows
async function search() {
  const queryString = new URLSearchParams(window.location.search);
  global.search.type = queryString.get("type");
  global.search.term = queryString.get("search-term");

  //檢查是否輸入搜尋詞
  if (global.search.term) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;


    if (results.length === 0) {
      showAlert("查無相關資料");
      return;
    } 

    displaySearchResults(results);

    //清空搜尋欄
    document.querySelector("#search-term").value = "";


  } else {
    showAlert("請輸入關鍵詞")
  }

} 

//Display Search Results
function displaySearchResults(results) {

  //fetch下一頁時清空上次的搜尋結果
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach(result => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("card");
    //如果 poster_path存在，顯示 poster_path
    //如果沒有，顯示預設圖片
    movieCard.innerHTML = `
          <div>
            <a href="${global.search.type}-details.html?id=${result.id}">
              ${result.poster_path ? 
                `<img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                class="card-img-top"
                alt="${global.search.type === "movie" ? result.title : result.name}"
                />` : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${global.search.type === "movie" ? result.title : result.name}"
                />`
              }
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">首播: ${global.search.type === "movie" ? result.release_date : result.first_air_date}</small>
            </p>
          </div>
    `;
    document.querySelector("#search-results-heading").innerHTML = `
            <h2>顯示${results.length}筆，共${global.search.totalResults} 筆包含「${global.search.term}」的搜尋結果</h2>
    `;

    document.querySelector("#search-results").appendChild(movieCard);
  })

  displayPagination();
}


//Create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");

  //如果結果多於一頁，顯示按鈕
  if (global.search.totalPages > 1) {

    pagination.innerHTML = `
      <button class="btn btn-primary" id="prev">上一頁</button>
      <button class="btn btn-primary" id="next">下一頁</button>
      <div class="page-counter">顯示第${global.search.page}頁，共${global.search.totalPages}頁</div>
    `;

    document.querySelector("#pagination").appendChild(div);

    //如果在第一頁，讓上一頁按鈕無法作用(隱藏)
    if (global.search.page === 1) {
      document.querySelector("#prev").style.display = "none";
    }

    //如果在最後一頁，讓下一頁按鈕無法作用(隱藏)
    if (global.search.page === global.search.totalPages) {
      document.querySelector("#next").style.display = "none";
    }

    //按下一頁按鈕進入 Next page
    document.querySelector("#next").addEventListener("click", async () => {
      global.search.page++;
      const { results, total_pages } = await searchAPIData();
      displaySearchResults(results);
    })

    //按上一頁按鈕進入 Prev page
    document.querySelector("#prev").addEventListener("click", async () => {
      global.search.page--;
      const { results, total_pages } = await searchAPIData();
      displaySearchResults(results);
    })
  }

}


//Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <div>
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
        </h4>
      <div>
    `
    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  })
}

//設定幻燈片
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView:1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      400: {
        slidesPerView:1
      },
      700: {
        slidesPerView:3
      },
      1200: {
        slidesPerView:4
      },
    }
  })
}


//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=zh-TW`);

  const data = await response.json();

  hideSpinner();

  return data;
}

//Make Request to Search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=zh-TW&query=${global.search.term}&page=${global.search.page}`);

  const data = await response.json();

  hideSpinner();

  return data;
}



//顯示/隱藏 spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//Highlight current link
//標註 navBar目前頁面的連結
function highlightCurrentLink() {
  const links = document.querySelectorAll(".nav-link");
  const currentPage = global.currentPage === "/" || global.currentPage === "/index.html" ? "/" : global.currentPage;
  links.forEach(link => {

    //檢查 link的路徑使否與目前頁面的路徑相同
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  })
}

//Show Alert
function showAlert(message, className = "error") {
  const alertEL = document.createElement("div");
  alertEL.classList.add("alert", "show", className);
  alertEL.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEL);

  setTimeout(() => alertEL.classList.remove("show"), 2000);
}

//把金額加上逗號
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Init App 
//在這裡管理每個頁面路徑使用的不同函數
function init() {
  console.log("目前頁面:", global.currentPage);

  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularTVshows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }
  highlightCurrentLink();
}

//頁面載入時啟動
document.addEventListener("DOMContentLoaded", init);