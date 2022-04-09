'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// To start using the geolocation API 

// This method accepts two callback functions , one for rejection and one for success


navigator.geolocation.getCurrentPosition(function (position) {

    // Destructure
    const { latitude } = position.coords
    const { longitude } = position.coords

    const coordinates = [latitude,longitude]
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`)


    // Pass in the coordinates ,  zoom level of the map
    const map = L.map('map').setView(coordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coordinates).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();


    // The 'on' method is used by the map object ,  it is from the leaflet library not from JavaScript. 
    // Pass in the event type and the callback function   


    map.on('click', function(mapEvent){
       const {lat,lng} = mapEvent.latlng

       console.log(`This is the latitue: ${lat}, while this is the longitude: ${lng}`)
    })

}, function () {
    alert('Could not get the current location! Try Again')
})



// Sidenote: our script will have access to all global variables declared in the scripts loaded before it.

// Sidenote: We want to display a pop up marker, however using addEventListener won't help , because we need to get the specific place where the user clicked.