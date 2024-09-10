$(document).ready(function () {
    // Fonction pour rechercher la météo d'une ville
    $('#btnRecherche').click(function () {
        let ville = $('#chercher').val().trim();

        if (ville) {
            // Remplace les espaces par des tirets pour les noms composés
            ville = ville.replace(/\s+/g, '-').toLowerCase(); // Convertir les espaces en tirets

            // Vider le contenu de la div avant d'afficher la météo
            $('#villeOuPosition').empty();
            $('#jour').empty();

            getWeatherByCity(ville);
        } else {
            alert('Veuillez entrer le nom d\'une ville.');
        }
    });

    // Fonction pour obtenir la météo par géolocalisation
    $('#btnPosition').click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                // Vider le contenu de la div avant d'afficher les coordonnées
                $('#villeOuPosition').empty();
                $('#jour').empty();

                // Afficher la latitude et la longitude dans la div
                $('#villeOuPosition').html(`<h3>Votre position actuelle : Latitude ${lat.toFixed(2)}, Longitude ${lon.toFixed(2)}</h3>`);

                // Appeler la fonction pour obtenir la météo à partir de la géolocalisation
                getWeatherByLocation(lat, lon);
            }, function (error) {
                alert('Erreur de géolocalisation : ' + error.message);
            });
        } else {
            alert('La géolocalisation n\'est pas prise en charge par ce navigateur.');
        }
    });
});

// Fonction pour récupérer la météo à partir du nom de la ville
function getWeatherByCity(city) {
    $.ajax({
        url: `https://www.prevision-meteo.ch/services/json/${city}`,
        method: 'GET',
        success: function (data) {
            displayWeather(data);
        },
        error: function () {
            alert('Ville introuvable. Veuillez entrer un nom de ville valide.');
        }
    });
}

// Fonction pour récupérer la météo à partir de la géolocalisation
function getWeatherByLocation(lat, lon) {
    $.ajax({
        url: `https://www.prevision-meteo.ch/services/json/lat=${lat}lng=${lon}`,
        method: 'GET',
        success: function (data) {
            displayWeather(data);
            $('.city-name').hide();
        },
        error: function () {
            alert('Impossible de récupérer les données météo.');
        }
    });
}

// Fonction pour afficher la météo
function displayWeather(data) {
    let cityName = data.city_info.name || "Localisation inconnue";

    // Ajouter le nom de la ville après avoir vidé la div
    $('#villeOuPosition').append(`<h3 class="city-name">Météo pour : ${cityName}</h3>`);

    // Tableau contenant les prévisions de 5 jours
    const forecasts = [
        data.fcst_day_0,
        data.fcst_day_1,
        data.fcst_day_2,
        data.fcst_day_3,
        data.fcst_day_4,
    ];

    // Initialisation de l'HTML pour les prévisions
    let html = '';
    forecasts.forEach((forecast) => {
        html += `
            <li>
                <img src="${forecast.icon}" alt="${forecast.condition}" />
                <div>
                    <h4>${forecast.day_short} ${forecast.date}, &nbsp;</h4>
                    <h4>${forecast.tmax}°C</h4>
                </div>
            </li>
        `;
    });

    // Affichage des prévisions dans l'élément HTML
    $('#jour').html(html);
}
