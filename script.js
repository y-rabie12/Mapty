'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class Workout {
    #date = new Date();
    #id = (Date.now() + '').slice(-7)
   
    constructor( coords,duration,distance){
        this.coords = coords;
        this.duration = duration;
        this.distance = distance;
    }

    _setDescription(){
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.#date.getMonth()]}, ${this.#date.getDate()}`

    }
}

class Running extends Workout {
    type = 'running'
    constructor(coords,duration,distance,cadence){
        super(coords,duration,distance)
        this.cadence = cadence
        this.calcPace();
        this._setDescription();
    }

    calcPace(){
        this.pace = this.duration/this.distance
        return this.pace
    }
}

class Cycling  extends Workout{
    type='cycling'
    constructor(coords,duration,distance,elevationGain){
        super(coords,duration,distance)
        this.elevationGain = elevationGain
        this.calcSpeed()
        this._setDescription()
    }

    calcSpeed(){
        this.speed = this.distance/this.time
        return this.speed
    }
}

class App {

    #map;
    #mapEvent;

    workouts = [] 
    constructor(){
       this._getPositon();

       form.addEventListener('submit',this._newWorkout.bind(this))

       inputType.addEventListener('change', this._toggleElevationField)
    
    }

    _getPositon(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
            alert('Could not get the current location! Try Again')
        })

    }

    _loadMap(position){
            // Destructure
            const { latitude } = position.coords
            const { longitude } = position.coords
        
            const coordinates = [latitude,longitude]
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`)
        
        
            // Pass in the coordinates ,  zoom level of the map
             this.#map = L.map('map').setView(coordinates, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
        
           
        
        
            // The 'on' method is used by the map object ,  it is from the leaflet library not from JavaScript. 
            // Pass in the event type and the callback function   
        
        
            this.#map.on('click', this._showForm.bind(this))
        

    }

    _showForm(mapE){
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

  
    _toggleElevationField(){
        
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
          
    
    }

    _newWorkout(e){


        e.preventDefault();

        // Get the data from form

        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;


        const {lat,lng} = this.#mapEvent.latlng

        let workout;
        // Helper Functions
 
        // Checks data type of input
        const validNumbers = (...inputs) => inputs.every( (input) => isFinite(input))
 
        // Checks for positive numbers
 
        const positiveNumber = (...inputs) => inputs.every((input) => input > 0)
 

        if(type === 'running'){
            const cadence = +inputCadence.value
            // guard clause to check if the distance has the correct data type
            console.log(positiveNumber(duration,distance,cadence))
            
            if(!validNumbers(distance,duration,cadence) || !positiveNumber(distance,duration,cadence)) return alert('Inputs have to be positive numbers');

            workout = new Running([lat,lng],distance,duration,cadence)
           
        }
        
        if(type === 'cycling'){
            const elevationGain = +inputElevation.value
            if(!validNumbers(distance,duration,elevationGain) || !positiveNumber(distance,duration)) return alert('Inputs have to be positive numbers');

            workout = new Cycling([lat,lng], distance,duration,elevationGain)
           
        }

        this.workouts.push(workout)

       
        // Clear all fields
    
 
         this._renderWorkout(workout)

        this._renderWorkoutMarker(workout)

    }

    _renderWorkoutMarker(workout){
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth:250,
            minWidth:100,
            autoClose: false,
            closeOnClick:false,
            className: `${workout.type}-popup`
        })).setPopupContent('Running Activity')
        .openPopup();
    }

    _renderWorkout(workout){

        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
      `;
  
      if (workout.type === 'running')
        html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
        `;
  
      if (workout.type === 'cycling')
        html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
        `;
  
      form.insertAdjacentHTML('afterend', html);
    }
}

const app =  new App();









// To start using the geolocation API 

// This method accepts two callback functions , one for rejection and one for success

// Sidenote: our script will have access to all global variables declared in the scripts loaded before it.

// Sidenote: We want to display a pop up marker, however using addEventListener won't help , because we need to get the specific place where the user clicked.
