const url = 'http://my-json-server.typicode.com/moviedb-tech/movies/list';
// init()

// function init() {
//     fetch(url)
//         .then(respons => respons.json())
//         .then((result) => {
//             renderMoviesBlock(result)
//             renderFavoriteMovies(result);
//             getGenres(result)
//             selectGenre(result)
//             toggleViewMode(result)
//         })
// }

function init() {
    fetch(url)
        .then(respons => respons.json())
        .then(result => {
            const movieCard = document.querySelector('.movie-card');
            const movieList = document.querySelector('.movie-list')
            let key;
            for (key in result) {

                movieCard.innerHTML += `
                <div class="card-item">
                    <img src="${result[key].img}" alt="${result[key].name}" class="card-img">

                    <div class="card-desc">
                        <h3 class="card-name">${result[key].name}</h3>
                        <p class="year">${result[key].year}</p>
                    </div>
                </div>
                
                `;

                movieList.innerHTML += `
                <div class="list-item">
                    <img src="${result[key].img}" class="list-img" alt="${result[key].name}">
                    <div class="list-info">
                        <h3 class="list-name">${result[key].name}</h3>
                        <p class="list-year">${result[key].year}</p>
                        <p class="list-descr">
                        ${result[key].description}
                        </p>
                        <div class="list-genre">

                        </div>



                    </div>
                </div>

                `;



                console.log(result[key]);
                // console.log(result[key].genres[key]);


            }



        })
}
init();