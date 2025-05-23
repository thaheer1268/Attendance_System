let inputbox=document.querySelector('#input-box')
let list=document.querySelector('#list-container')

function addTask(){
    if(inputbox.value===''){
        alert("please enter something")
    }else{
        let li=document.createElement('li')
        li.innerHTML=inputbox.value
        list.appendChild(li)
        let span=document.createElement('span')
        span.innerHTML="\u00d7"
        li.appendChild(span)
    }
    inputbox.value='';
    saveData()
}

list.addEventListener('click', function(e){
    if(e.target.tagName ==="LI"){
        e.target.classList.toggle("ck")
        saveData()
    }else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove();
        saveData()
    }
});

function saveData(){
    localStorage.setItem("data",list.innerHTML)
}
    
function showTask(){
    list.innerHTML=localStorage.getItem('data')
}
showTask()
    