class Galgje {
    constructor() {
        this.phase = 0;
        this.currentPattern = "";
        this.endMessage = "";
        this.message = document.createElement("h1");
        this.endingDiv = document.getElementById("endingDiv");
        this.button = document.createElement("button");
        this.button.addEventListener("click", () => this.newGame());
        this.button.innerText = "Nieuw spel";
        this.winMessage = "Proficiat! Je hebt gewonnen! Opnieuw proberen?";
        this.loseMessage = "Oeps! Je hebt verloren! Opniuew proberen?";
        this.newGame();
    }

    createButtons() {
        document.getElementById('letters').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter =>
            `<button id= ${letter} onClick="game.handleLetters(${letter})" class="button" > ${letter} </button>`).join('');
    }

    getPicture(phase) {
        return "./afbeeldingen/galgje" + phase + ".png";
    }

    newGame() {
        // hide or show the end message and the restart button as needed.
        if (this.endingDiv.style.display === "none") {
            this.endingDiv.style.display = "block";
        } else {
            this.endingDiv.innerHTML = '';
            this.endingDiv.style.display = "none";
        }
        //reset the values for pattern, phase and the picture
        this.currentPattern = document.querySelector("#pattern");
        this.phase = 0;
        document.getElementById("image").src = this.getPicture(this.phase);
        //set the pattern value accordingly
        fetch(`cgi-bin/new_game.cgi?data=${JSON.stringify(this.currentPattern)}`)
            .then(patroon => patroon.json())
            .then(data => document.querySelector("#pattern").innerHTML = data["pattern"])
        this.createButtons();
    }

    killButtons() {
        for (let i of document.getElementsByClassName("button")) {
            i.disabled = true;
        }
    }

    handleLetters(letter) {
        this.currentPattern = document.querySelector("#pattern").innerHTML;
        let clicked = [];
        // get all the letters that are clicked at that moment
        for (let i of document.getElementsByClassName("button")) {
            if (i.classList.contains("clicked")) {
                clicked.push(i.id);
            } else if (i.id === letter) {
                clicked.push(i);
            }
        }
        // add clicked to the class list so that the button changes color
        letter.classList.add('clicked');
        const data = {"clicked": clicked, "pattern": this.currentPattern, "phase": this.phase};
        fetch(`cgi-bin/handle_letters.cgi?data=${JSON.stringify(data)}&waarde=${letter.id}`)
            .then(antwoord => antwoord.json())
            .then(d => {
                // if the button was already clicked, appropriate error message will be sent by the cgi script, so do nothing
                if (d.hasOwnProperty("error")) return;
                this.currentPattern = d["pattern"];
                document.querySelector("#pattern").innerHTML = d["pattern"];
                this.phase = d["phase"];
                // if all the lives are used up by the player or the pattern is completed, end the game with the appropriate
                // message and show the restart button
                if (this.phase === 9 || this.currentPattern.indexOf("_") === -1) {
                    if (this.currentPattern.indexOf("_") === -1) {
                        this.endMessage = this.winMessage;
                    } else {
                        this.endMessage = this.loseMessage;
                    }
                    this.killButtons();
                    this.showRestart();
                }
                document.getElementById("image").src = this.getPicture(this.phase);
            });
    }

    showRestart() {
        this.endingDiv.appendChild(this.message);
        this.endingDiv.appendChild(this.button);
        this.message.innerHTML = this.endMessage;
        this.endingDiv.style.display = "block";
    }
}