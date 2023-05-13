//Array for flashcards
export let flashcards = [];
//Knapp for å legge til kort
let addFlashcardButton = document.querySelector('#addFlashcardButton');
let flashcardsDiv = document.querySelector("#flashcardContainer")
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
    // Henter flashcard elememtet fra DOM og fjerner det
    let flashcard = document.querySelector(".flashcard");
    if (flashcard){
        flashcard.remove();
    }
}

// Funksjon som viser det nåværende flashkortet
function showCurrentFlashcard(){
    // Henter flashkortet fra arrayet
    let currentFlashcard = flashcards[currentFlashcardIndex];

    // Lager et nytt flashkort med funksjonen
    let newFlashcard = createFlashcard(currentFlashcard.question, currentFlashcard.answer);

    // Legger det til i DOM
    flashcardsDiv.appendChild(newFlashcard.element);

}

export function nextFlashcard(test){
    // Bruker  parameteret for å bestemme hvordan jeg ønsker å bruke funksjonen. Bruker for å bytte til det nyeste flashkortet når noe legges til
    // Hvis parameteret er usant, bytter den til neste.
    // Hvis det er sant, vil det vise det siste flashkortet i arrayet.
    if (! test){
    // Legger til 1 i indexen, bytter det til 0 hvis det er det høyeste
    currentFlashcardIndex++;

    if (currentFlashcardIndex === flashcards.length) {
        currentFlashcardIndex = 0;
    }

    // Fjerner elementet fra DOM
    if (flashcards.length > 0){
        removeCurrentFlashcard();
    }
    
    showCurrentFlashcard();

    } 
    // Hvis test parameteret er sant
    else {
        currentFlashcardIndex = flashcards.length - 1

        removeCurrentFlashcard();
        showCurrentFlashcard();
    }
    
}

function prevFlashcard(){
    // -1 fra indexen, hvis den < 0 bytter den til det siste flashkortet
    currentFlashcardIndex--;
    if (currentFlashcardIndex < 0) {
        currentFlashcardIndex = flashcards.length - 1;
    }
    // Fjerner elementet fra DOM
    if (flashcards.length > 0){
        removeCurrentFlashcard();
    }
    // Viser det forrige kortet
    showCurrentFlashcard();
}

// Funksjon for å fjerne flashcardet fra arrayet
function deleteCurrentFlashcard(index) {
    flashcards.splice(index, 1);
    if (index === currentFlashcardIndex && index === flashcards.length) {
        // Hvis kortet ble sletta sist var den siste, flyttes indexen til 0.
        currentFlashcardIndex--;
      }
}

// Eventlisterners:

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
    if (flashcards.length > 0){
        nextFlashcard();
    }
})

prev.addEventListener('click', () => {
    if (flashcards.length > 0){
        prevFlashcard();
    }})

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
        
        if (flashcards.length !== 0){
            nextFlashcard()
        }
         else {
            console.log("Bunken er tom!");

            flashcardsDiv.innerHTML= `
            <div class="flashcard">
                <div class="front">Legg inn ditt første flashcard i feltet til venstre!</div>
            <div class="back"></div>
            </div>
        `
        }
    }

})