//Array for flashcards
export let flashcards = [];
//Knapp for å legge til kort
let addFlashcardButton = document.querySelector('#addFlashcardButton');
let flashcardsDiv = document.querySelector(".flashcards")
let currentFlashcardIndex = 0
let next = document.querySelector("#nextButton")
let prev = document.querySelector("#prevButton")
let del = document.querySelector("#deleteButton")



export function createFlashcard(question, answer) {
    // Lager et div element som får klassen "flashcard"
    let flashcardElement = document.createElement('div');
    flashcardElement.className = 'flashcard';

    // Lager et div for forsiden av flashkortet og legget til spørsmålet
    let front = document.createElement('div');
    front.className = 'front';
    front.textContent = question;

    // Div for baksiden og svaret
    let back = document.createElement('div');
    back.className = 'back';
    back.textContent = answer;
  
    //Legger til for- og baksiden som underelementer
    flashcardElement.appendChild(front);
    flashcardElement.appendChild(back);
    
    //Gjør at den får flippet med en knapp og css
    flashcardElement.addEventListener('click', () => {
        flashcardElement.classList.toggle('flipped');
    });
    //Lager et seperat objekt som skal forhåpentligvis brukes til å store i databasen
    let flashcardObject = {
        question: question,
        answer: answer,
    };
    
    //Returnerer det ovenfor
    return {
        element: flashcardElement,
        object: flashcardObject
    };
}

function removeCurrentFlashcard(){
    //gets the flashcard from DOM, and removes it
    let flashcard = document.querySelector(".flashcard");
    if (flashcard){
        flashcard.remove();
    }
}

//A function for that shows the current flashcard
function showCurrentFlashcard(){
    //Gets the current flashcard from the array
    let currentFlashcard = flashcards[currentFlashcardIndex];

    //Creates a new flashcard
    let newFlashcard = createFlashcard(currentFlashcard.question, currentFlashcard.answer);

    //Adds the new flashcard to the DOM
    flashcardsDiv.appendChild(newFlashcard.element);

    console.log("Bytta " + currentFlashcardIndex);
}

export function nextFlashcard(test){
    // Bruker  parameteret for å bestemme hvordan jeg ønsker å bruke funksjonen
    if (! test){
    // Add one to the current index, if its the highest index, go to index 0
    currentFlashcardIndex++;

    if (currentFlashcardIndex === flashcards.length) {
        currentFlashcardIndex = 0;
    }

    // Remove the current flashcard form the DOM
    if (flashcards.length > 0){
        removeCurrentFlashcard();
    }
    
    showCurrentFlashcard();

    } 
    
    else {
        currentFlashcardIndex = flashcards.length - 1

        removeCurrentFlashcard();
        console.log(currentFlashcardIndex)
        console.log(flashcards.length);
        showCurrentFlashcard();
    }
    
}

function prevFlashcard(){
    // Subtract one to the current index, if its the lowest index, go to length-1
    currentFlashcardIndex--;
    if (currentFlashcardIndex < 0) {
        currentFlashcardIndex = flashcards.length - 1;
    }
    // Remove the current flashcard form the DOM
    if (flashcards.length > 0){
        removeCurrentFlashcard();
    }
    // Make a flashcard
    showCurrentFlashcard();
}

// Funksjon for å fjerne flashcardet fra arrayet
function deleteCurrentFlashcard(index) {
    flashcards.splice(index, 1)
}

// Knapper:

addFlashcardButton.addEventListener('click', () => {
    // Finn verdiene i skjemaet

    let question = document.querySelector('#question').value;
    let answer = document.querySelector('#answer').value;

    //Sjekker om kortet allerede finnes 
    let check = flashcards.find(flashcard => flashcard.question === question);
    if (check){
        alert("Dette kortet finnes allerede i listen. Vennligst bruk et annet spørsmål eller slett kortet")
        return;
    }
    
    // Legg til ting dersom det finnes noe i skjemaet
    if (question !== '' && answer !== '') {

        let flashcard = createFlashcard(question, answer);

        flashcards.push(flashcard.object);
        
        window.saveFlashcards(flashcards)

        console.log(flashcards);

        nextFlashcard(true)
    } else {
        alert("Vennligst fyll skjemaet.")
    }
});

next.addEventListener('click',() =>{
    nextFlashcard();
})

prev.addEventListener('click', () => {
    prevFlashcard();
})

del.addEventListener('click', () => {
    // Hvis et flashcard eksisterer
    if (flashcards.length > 0){

        let question = flashcards[currentFlashcardIndex].question
        let answer = flashcards[currentFlashcardIndex].answer

        // Sletter flashcardet fra databasen
        window.deleteFlashcard(question, answer);

        // Sletter flashcardet fra arrayet
        deleteCurrentFlashcard(currentFlashcardIndex) 

        // Fjerner flashcardet fra DOM
        removeCurrentFlashcard()

        // Bytter til neste flashcard
        nextFlashcard()
        
        if (flashcards.length == 0){
            console.log("Nå er bunken tom!");
        }
    } else {
        alert("Du må legge til et flashcard først!")
    }

})