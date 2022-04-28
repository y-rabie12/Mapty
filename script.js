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

let map = '';

let mapEvent;

// To start using the geolocation API 

// This method accepts two callback functions , one for rejection and one for success


navigator.geolocation.getCurrentPosition(function (position) {

    // Destructure
    const { latitude } = position.coords
    const { longitude } = position.coords

    const coordinates = [latitude,longitude]
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`)


    // Pass in the coordinates ,  zoom level of the map
     map = L.map('map').setView(coordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

   


    // The 'on' method is used by the map object ,  it is from the leaflet library not from JavaScript. 
    // Pass in the event type and the callback function   


    map.on('click', function(mapE){
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
   
      
    })


}, function () {
    alert('Could not get the current location! Try Again')
})



// Sidenote: our script will have access to all global variables declared in the scripts loaded before it.

// Sidenote: We want to display a pop up marker, however using addEventListener won't help , because we need to get the specific place where the user clicked.

form.addEventListener('submit',function(e){
       e.preventDefault();

       // Clear all fields
       inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

       const {lat,lng} = mapEvent.latlng
       L.marker([lat,lng]).addTo(map)
       .bindPopup(L.popup({
           maxWidth:250,
           minWidth:100,
           autoClose: false,
           closeOnClick:false,
           className: 'running-popup'
       })).setPopupContent('Running Activity')
       .openPopup();
})


inputType.addEventListener('change',function(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
})
