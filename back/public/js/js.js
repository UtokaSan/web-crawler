$(function () {

    'use strict';

    $('.menu__item').on("mouseenter", function () {
        let id = $(this).data('id');
        $('#' + id + '-bg__img').addClass('active');
    });
    $('.menu__item').on("mouseleave", function () {
        $('.menu-img img').removeClass('active');
    });

});


    var sitesDeVenteBtn = document.getElementById('sites-de-vente');
    var reseauxSociauxBtn = document.getElementById('reseaux-sociaux');

    sitesDeVenteBtn.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'SitesVente.html';
});

    reseauxSociauxBtn.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'reseaux-sociaux.html';
});

