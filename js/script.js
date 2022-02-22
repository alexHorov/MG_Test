const url = 'http://my-json-server.typicode.com/moviedb-tech/movies/list',
    ACTIVE_CLASS = 'active',
    listViewState = 'list',
    cardViewState = 'card',
    movieCard = document.querySelector('.movie-card'),
    movieList = document.querySelector('.movie-list'),
    select = document.querySelector('#gen-select'),
    viewBlock = document.querySelector('.view-block'),
    favoriteList = document.querySelector('.fav-list');

// Fetch API



function init() {


    fetch(url)
        .then(respons => respons.json())
        .then(result => {
            renderMovieCard(result);
            toggleViewMode(result);
            renderFavoriteList(result);
            changeGenresToLowerCase(result);


        });


}
init();

function renderMovieCard(card) {
    let cardFragment = document.createDocumentFragment();
    let listFragment = document.createDocumentFragment();
    for (let item of card) {
        let cardItem = document.createElement('div');
        let listItem = document.createElement('div');
        cardItem.className = "card-item";
        listItem.className = "list-item";
        cardItem.setAttribute('data-target', `${item.id}`);
        listItem.setAttribute('data-target', `${item.id}`);
        cardItem.innerHTML = `
   
        <img src="${item.img}" alt="${item.name}" class="card-img">
        <button type="button" class="add-favorite" data-id="${item.id}"><i class="fa fa-star"></i></button>

        <div class="card-desc">
            <h3 class="card-name">${item.name}</h3>
            <p class="year">${item.year}</p>
        </div>
  
    `;

        listItem.innerHTML = `
        <img src="${item.img}" class="list-img" alt="${item.name}">
        <button type="button" class="add-favorite-list" data-id="${item.id}"><i class="fa fa-star"></i></button>
        <div class="list-info">
            <h3 class="list-name">${item.name}</h3>
            <p class="list-year">${item.year}</p>
            <p class="list-descr">
            ${item.description}
            </p>
        </div>
    

    `;
        let genresBlock = document.createElement('div');
        genresBlock.classList.add('genres-block');
        for (let genre of item.genres) {
            let elem = document.createElement('div');
            elem.innerText = genre;
            genresBlock.append(elem);
        }
        listItem.querySelector('.list-descr').after(genresBlock);
        cardFragment.append(cardItem);
        listFragment.append(listItem);
        addItemsEvent(cardItem, item);
        addItemsEvent(listItem, item);


    }
    movieCard.append(cardFragment);
    movieList.append(listFragment);
    setActiveFavoriteBtn();


}


/*-------------------------------------------Add to favorite List----------------- */

/* Работаем с LocalStorage  добаввляем в локал сторадж и удаляем*/

function addFavoriteMovie(value) {
    let favoriteArray = JSON.parse(localStorage.getItem('favorites')) || [];
    favoriteArray.push(value.id)
    localStorage.setItem('favorites', JSON.stringify(favoriteArray))
}

function removeFavoriteMovie(value) {
    let storageArray = JSON.parse(localStorage.getItem('favorites')).filter(item => item !== value.id);
    localStorage.setItem('favorites', JSON.stringify(storageArray));
}

/* ----------------Добавляем активный клас к звезду из ЛокалСторадж */
function setActiveFavoriteBtn() {
    let storageArray = JSON.parse(localStorage.getItem('favorites'))
    if (storageArray) {
        let allStarBtn = document.querySelectorAll('[data-id]');
        let arrBtn = Array.from(allStarBtn);

        let idValue = arrBtn.map(el => +el.getAttribute('data-id'));

        let activeStar = idValue.filter((el, index) => {
            for (let i = 0; i < storageArray.length; i++)
                if (idValue[index] == storageArray[i]) {
                    return el;
                }

        });

        for (let btn of arrBtn) {
            for (let i = 0; i < activeStar.length; i++) {
                if (btn.dataset.id == activeStar[i]) {
                    btn.childNodes[0].classList.add(ACTIVE_CLASS);
                }
            }
        }

    }

}

/* делаем проверку локал сторадж на наявнасть id, и те что есть добавляем в фаворит лист*/
function renderFavoriteList(movie) {
    let favoriteArray = JSON.parse(localStorage.getItem('favorites'));
    if (favoriteArray) {
        let moviesNames = movie.filter((el) => {
            for (let i = 0; i < favoriteArray.length; i++) {
                if (el.id == favoriteArray[i]) {
                    return el
                }
            }
        })
        for (let movie of moviesNames) {
            addMovieToFavoriteList(movie)
        }
    }
}


/* обработчик собитbя на конопку */
function addItemsEvent(elem, item) {
    elem.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-star')) {
            favoriteBtnHandle(e, item);
        } else {
            // detailsModal.style.display = 'block';
            // let details = document.querySelector('.detail-block');
            // details?.remove()
            // getMovieDetails(elem.id)
        }

    })
}
/* ВЕШАЕМ АКТИВНІЙ КЛАСС НА КОНКУ И ДОБАВЛЯЕМ В ФАВОРИТ ЛИСТ */
function favoriteBtnHandle(e, item) {
    let starButtons = document.querySelectorAll('[data-id]');
    if (e.target.classList.contains(ACTIVE_CLASS)) {
        e.target.classList.remove(ACTIVE_CLASS);
        removeFavoriteMovie(item);
        let favoriteList = document.querySelectorAll('.fav-list>div');
        for (let removeMovie of favoriteList) {
            if (removeMovie.innerText === item.name) {
                removeMovie.remove()
            }
        }
        for (let btn of starButtons) {
            if (btn.dataset.id == e.target.parentElement.dataset.id) {
                btn.childNodes[0].classList.remove(ACTIVE_CLASS)
            }
        }
    } else {
        e.target.classList.add(ACTIVE_CLASS);
        addFavoriteMovie(item);
        addMovieToFavoriteList(item);
        for (let btn of starButtons) {
            if (btn.dataset.id == e.target.parentElement.dataset.id) {
                btn.childNodes[0].classList.add(ACTIVE_CLASS)
            }

        }
    }

}

/* Создаем НТМL текс который будем создавать при нажатии на конопку */
function addMovieToFavoriteList(movie) {
    let item = document.createElement('div');
    item.innerHTML = `<div class="favlist-title">
                    <i class="fa fa-arrow-right"></i>
                    <p class="fav-name">${movie.name}</p>
                 </div>
                 <i class="fa fa-trash"></i>`
    favoriteList.append(item);
    item.querySelector('.fa-trash').addEventListener('click', () => {
            removeFavoriteMovie(movie);
            item.remove();
            let starButtons = document.querySelectorAll('[data-id]');
            for (let btn of starButtons) {
                if (btn.dataset.id == movie.id) {
                    btn.childNodes[0].classList.remove(ACTIVE_CLASS)
                }

            }

        })
        // item.querySelector('.fav-name').addEventListener('click', () => {
        //     detailsModal.style.display = 'block';
        //     let details = document.querySelector('.detail-block');
        //     details ? .remove()
        //     getMovieDetails(movie.id)
        // })

}
/*-------Получаем жанры и меняем их */
function changeGenresToLowerCase(item) {
    // const movieDB = item;

    item.forEach(el => {
        el.genres.forEach(e => {
            const areGen = e.toLowerCase();
            console.log(areGen)
        });
    })
}
/*
function changeGenresToLowerCase(item) {
    item.forEach(el => {

        const movieDB = el;

        movieDB.genres.forEach(() => {
            movieDB.genres = el.genres.map(j => j.toLowerCase());
            return movieDB.genres;

        })
        console.log(movieDB);


    });
    // console.log(item);
    // console.log(arrGen);
}

*/


/*----------------------------------Toggle view card or list------------------------------------- */
function toggleViewMode(list) {
    viewBlock.addEventListener('click', (e) => {
        target = e.target;
        if (target.classList.contains('fa-th')) {
            target.classList.add(ACTIVE_CLASS);
            target.nextElementSibling.classList.remove(ACTIVE_CLASS);
            movieCard.style.display = 'grid';
            movieList.style.display = 'none';
            localStorage.setItem('view', cardViewState);
        } else if (target.classList.contains('fa-th-list')) {
            target.classList.add(ACTIVE_CLASS);
            target.previousElementSibling.classList.remove(ACTIVE_CLASS);
            movieList.style.display = 'grid';
            movieCard.style.display = 'none';
            localStorage.setItem('view', listViewState);
        }

    })

}