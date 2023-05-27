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


    // Sélectionnez les boutons "Sites De Vente" et "Réseaux Sociaux"
    var sitesDeVenteBtn = document.getElementById('sites-de-vente');
    var reseauxSociauxBtn = document.getElementById('reseaux-sociaux');

    // Ajoutez un gestionnaire d'événement au bouton "Sites De Vente"
    sitesDeVenteBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    window.location.href = 'sites-de-vente.html'; // Redirige vers la page "sites-de-vente.html"
});

    // Ajoutez un gestionnaire d'événement au bouton "Réseaux Sociaux"
    reseauxSociauxBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    window.location.href = 'reseaux-sociaux.html'; // Redirige vers la page "reseaux-sociaux.html"
});

