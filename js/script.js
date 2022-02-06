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
            let key;
            for (key in result) {

                movieCard.innerHTML += `
                <div class="card-item">
                    <img src="${result[key].img}" alt="${result[key].name}" class="card-img">

                    <div class="card-desc">
                        <h3 class="name">${result[key].name}</h3>
                        <p class="year">${result[key].year}</p>
                    </div>
                </div>
                
                `;
                console.log(result[key]);


            }
        })
}
init();