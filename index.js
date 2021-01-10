const apiKey = '88044aaa';
const url = 'http://www.omdbapi.com/?'

const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" alt=""/>
        ${movie.Title} (${movie.Year})
    `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchInput){
        const response = await axios.get(url, {
            params: {
                apiKey: apiKey,
                s: searchInput
            }
        });
            if(response.data.Error) {
                return [];
            }
            return response.data.Search;
    }
}

createAutoComplete({
    autoComplete: document.querySelector('#left-autocomplete'),
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), "left");
    }
});

createAutoComplete({
    autoComplete: document.querySelector('#right-autocomplete'),
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), "right");
    }
})

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, element, side) => {
    const response = await axios.get(url, {
        params: {
            apiKey: apiKey,
            i: movie.imdbID
        }
    });
    element.innerHTML = movieTemplate(response.data);

    if(side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-success');
            leftStat.classList.add('is-danger');
        } else if (leftSideValue > rightSideValue) {
            rightStat.classList.remove('is-success');
            rightStat.classList.add('is-danger');
        } else if (leftSideValue === rightSideValue) {
            leftStat.classList.add('is-warning');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = (movieDetail) => {
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = parseInt(movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word); // Transforms string elements into numbers
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0));

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h3>${movieDetail.Genre}</h3>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        
        <article data-value=${awards} class="notification is-success">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${metascore} class="notification is-success">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-success">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-success">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}