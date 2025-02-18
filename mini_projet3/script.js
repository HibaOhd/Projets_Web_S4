(function () {

    var clockElement = document.getElementById( "clock" );
  
    function updateClock ( clock ) {
      clock.innerHTML = new Date().toLocaleTimeString();
      return ;
    }
  
    function TaskTime(){
        let todos = document.querySelectorAll("li");
        let sound = document.getElementById("clickSound")
        let now = new Date();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        todos.forEach(todo => {
            let taskHour = todo.querySelector('input[name="Hours"]');
            let taskMinutes = todo.querySelector('input[name="Minutes"]');
            let taskText = todo.querySelector('input[type="text"]');

            if (taskHour && taskMinutes && taskText) {
                let taskHourValue = parseInt(taskHour.value, 10);
                let taskMinutesValue = parseInt(taskMinutes.value, 10);

                if (taskHourValue === hour && taskMinutesValue === minutes && now.getSeconds()== 0 ) {
                    sound.play();
                    setTimeout(() => {
                        alert(`C'est l'heure pour : ${taskText.value}`);
                    }, 500); 
                }
            }
        });
        return ; 
    } 

    setInterval(function () {
        updateClock( clockElement );
    }, 1000);
    setInterval(function(){
        TaskTime();
    },1000);
  }());
function del(element){
    element.parentNode.remove()
    return ; 
}
function add(){
    let todos = document.querySelector("ul");
    let todo = document.createElement("li");
    todo.innerHTML = ' <input type="checkbox"> <input type="number" min="0" max="23" name="Hours"> <span> : </span> <input type="number" min="0" max="59" name="Minutes"> <input type="text"> <button onclick="del(this)">-</button>'
    todos.appendChild(todo);
    return ; 
}
