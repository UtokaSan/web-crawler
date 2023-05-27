window.onscroll = function() {
    var searchBar = document.getElementById('searchBar');
    var blackBar = document.getElementById('blackBar');
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        searchBar.classList.add('search-bar-small');
        searchBar.style.transform = 'translate(-50%, 0)';
        blackBar.style.opacity = '0.7';
        blackBar.style.visibility = 'visible';
    } else {
        searchBar.classList.remove('search-bar-small');
        searchBar.style.transform = 'translate(-50%, 100px)';
        blackBar.style.opacity = '0';
        blackBar.style.visibility = 'hidden';
    }
};

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        var searchBar = document.getElementById('searchBar');
        searchBar.classList.add('search-bar-small');
        searchBar.style.transform = 'translate(-50%, 0)';
    }
}