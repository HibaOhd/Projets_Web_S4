let url = "";
let correctAnswers = []
function Generate(){
    let numberQuest = document.querySelector("input");
    if(numberQuest.value==""){
        alert("the number of questions must be at least 1.")
        return ; 
    }
    let selects = document.querySelectorAll("select");
    url = `https://opentdb.com/api.php?amount=${numberQuest.value}&category=${selects[0].value}&difficulty=${selects[1].value}&type=${selects[2].value}`
    if(selects[0].value=="any"){
        url = url.replace(`&category=${selects[0].value}`,``);
    }
    if(selects[1].value=="any"){
        url= url.replace(`&difficulty=${selects[1].value}`,``);
    }
    if(selects[2].value=="any"){
        url= url.replace(`&type=${selects[2].value}`,``);
    }
    document.querySelector("h1").innerText = "Quiz";
    document.querySelector(".form").style.display="none";
    document.querySelector(".QuizDiv").style.display = "flex";
    document.querySelector(".QuizDiv").style.flexDirection = "column"; 
    fetchQuestions();
    return ;
}
function fetchQuestions() {
    correctAnswers=[];
    let text=document.createTextNode("Generating quiz, please wait...");
    document.querySelector(".QuizDiv").appendChild(text);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach((questionData, index) => {
                showQuestion(questionData, index); 
                correctAnswers.push(questionData.correct_answer);
            });
            let but = document.createElement("button");
            but.innerText="Check Answers!";
            but.onclick=check;
            document.querySelector(".QuizDiv").appendChild(but);
            document.querySelector(".QuizDiv").removeChild(text);
            function check(){
                let score=0 ;
                let choices = document.querySelectorAll(".choices");
                for(let i = 0;i<choices.length;i++){
                    let Choosed = choices[i].querySelector('input:checked');
                    if(Choosed){
                        if(Choosed.value==correctAnswers[i]){
                            score +=1;
                            Choosed.style.outline = "3px solid green";   
                        }
                        else{
                            Choosed.style.outline = "3px solid red"; 
                            let correct = choices[i].querySelector(`input[value="${correctAnswers[i]}"]`);
                            correct.style.outline = "3px solid green";
                        }
                    }
                    else{
                        let correct = choices[i].querySelector(`input[value="${correctAnswers[i]}"]`);
                        correct.style.outline = "3px solid green";
                    }
                }
                let scoreAff= document.getElementById("scoreAff");
                scoreAff.innerText=` Your score is ${score}/${choices.length}`;
                scoreAff.style.display="block"
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return ; 
            }
        })
        .catch(() => document.getElementById("Quiz").innerText = "Error loading questions.");
        return ; 
}
function showQuestion(data,index){
    let QuizDiv =  document.getElementById("Quiz");
    let QuestionDiv = document.createElement("div");
    QuestionDiv.innerHTML = data.question;
    let choices = document.createElement("div");
    let answers = [...data.incorrect_answers, data.correct_answer]; 
    answers.sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
        let choice = document.createElement("input");
        choice.type = "radio";
        choice.name = `question${index}`;
        choice.value = answer;
        let label = document.createElement("label");
        label.appendChild(choice);
        label.appendChild(document.createTextNode(" " + answer));
        choices.appendChild(label);
        choices.appendChild(document.createElement("br"));
    });
    choices.style.margin="10px";
    choices.style.backgroundColor="white";
    choices.style.color="#222222";
    choices.style.borderRadius="5px";
    choices.className="choices";
    QuizDiv.appendChild(QuestionDiv);
    QuizDiv.appendChild(choices);
    return ; 
}

