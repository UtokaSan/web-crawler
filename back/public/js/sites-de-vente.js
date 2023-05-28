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

        setTimeout(function() {
            var middleBar = document.createElement('div');
            middleBar.classList.add('middle-bar');
            document.body.appendChild(middleBar);
        }, 300);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 150,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
});