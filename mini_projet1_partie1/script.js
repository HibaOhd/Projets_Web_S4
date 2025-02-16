let interval;
const correctAnswers = {
    "choix1":  [true, false, false, false],
    "choix2":  [true, false, false, false],
    "choix3":  [true, false, false, false],
    "choix4":  [true, false, false, false],
    "choix5":  [false, true, false, false],
    "choix6":  [false, false, true, false],
    "choix7":  [true, false, false, false],
    "choix8": [true, false, false, false],
    "choix9":  [false, false, false, true],
    "choix0":  [true,false , false, false]
};
function Afficher(id){
    let num = id[id.length-1];
    let questDiv = document.getElementById(`quest${num}`);
    let question = document.getElementById(`choix${num}`);
    question.style.display = "flex";
    question.style.flexDirection="column";
    let  affbut = document.getElementById(id);
    let confbut = document.getElementById(`Conf${num}`);
    affbut.style.display="none";
    confbut.style.display="block";
    let timeleft = 60;
    const timerelt = document.getElementById(`timer${num}`);
    interval = setInterval(() => {
        timeleft--;
        timerelt.textContent = timeleft;
        if (timeleft <= 0) {
            clearInterval(interval);
            question.style.display="none";
            questDiv.style.border="2px solid rgb(87, 16, 16)";
            confbut.style.display="none";
            timerelt.parentElement.style.display="none";
        }
        else{

        }
    }, 1000);
    return ; 
}
function Confirmer(id){
    let num = id[id.length-1];
    let questDiv = document.getElementById(`quest${num}`);
    let question = document.getElementById(`choix${num}`);
    let confbut = document.getElementById(`Conf${num}`);
    const timerelt = document.getElementById(`timer${num}`);
    clearInterval(interval);
    question.style.display="none";
    questDiv.style.border="2px solid rgb(87, 16, 16)";
    confbut.style.display="none";
    timerelt.parentElement.style.display="none";
    return ; 
}
function Score() {
    let score = 0; 
    for (let i = 0; i < 10; i++) {
        if (document.getElementById(`quest${i}`).style.border != "2px solid rgb(87, 16, 16)") {
            alert("Toutes les réponses doivent être confirmées.");
            return false;
        }
    }

    for (let key in correctAnswers) {
        let checkboxes = document.querySelectorAll(`#${key} input[type="checkbox"]`);
        let reponsesUtilisateur = Array.from(checkboxes).map(checkbox => checkbox.checked);
        let divChoix = document.getElementById(`${key}`);
        divChoix.style.display = "flex";
        divChoix.style.flexDirection = "column";
        let divExpli = document.getElementById(`expli${key.replace('choix', '')}`);
        divExpli.style.display = "block";

        checkboxes.forEach((checkbox, index) => {
            if (correctAnswers[key][index]) {
                checkbox.style.outline = "2px solid green";
            } else {
                checkbox.style.outline = reponsesUtilisateur[index] ? "2px solid red" : "none";
            }
        });

        if (JSON.stringify(reponsesUtilisateur) === JSON.stringify(correctAnswers[key])) {
            score++;
        }
    }

    let affscore = document.getElementById("Affscore");
    affscore.textContent = `Votre score est ${score}/10`;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    return true;
}
