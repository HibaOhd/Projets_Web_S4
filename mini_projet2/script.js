function Add(){
    let newToDo= document.querySelector('input[name="add"]')
    if(newToDo.value!=""){
        let todoList = document.querySelector("ul");
        todoList.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"> 
                               <span>${newToDo.value}</span> 
                               <i class="far fa-trash-alt delete" onclick="del(this)"></i> 
                               </li> `;
        newToDo.value="";
    }
    return false ; 
}
function del(element){
    element.parentNode.remove();
    return ; 
}
function searchTodos(element) {
    let value = element.value.toLowerCase();
    let todos = document.querySelectorAll(".todos li");

    todos.forEach(todo => {
        let text = todo.querySelector("span").innerText.toLowerCase();
        
        if (value === "" || text.includes(value)) {
            todo.style.display = "flex"; 
            todo.style.visibility = "visible";  
            todo.style.position = "relative";
        } else {
            todo.style.display = "none"; 
            todo.style.visibility = "hidden";  
            todo.style.position = "absolute";
        }
    });
    return ; 
}