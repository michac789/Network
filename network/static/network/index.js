document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#test").onclick = () => {
        const x = document.querySelector("#test")
        console.log(x.dataset.name)
        test()
    }

    // like or dislike button functionality
    document.querySelectorAll(".like_button").forEach(
        el => el.onclick = () => { like(el.dataset.id) }
    )
    // edit post button functionality
    document.querySelectorAll(".edit_button").forEach(
        el => el.onclick = () => { edit(el.dataset.id) }
    )
    

})


function like(val) {
    fetch(`likepost/${val}`, {
        method: "FETCH",
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.success === "liked"){
            document.querySelector(`#like_button_${result.post_id}`).innerHTML = "UNLIKE";
            document.querySelector(`#likes_${result.post_id}`).innerHTML = result.likes + 1;
        } else {
            document.querySelector(`#like_button_${result.post_id}`).innerHTML = "LIKE";
            document.querySelector(`#likes_${result.post_id}`).innerHTML = result.likes - 1;
        }
    })
    .catch(error => console.log(`Error detected: ${error}`))
}

function edit(val){
    let message = document.createElement("article")
    message.innerHTML = `<h3>Editing Post:</h3>`
    let title = document.querySelector(`.postdiv[id='${val}']>.title`)
    let textarea = document.createElement("textarea")
    textarea.innerHTML = document.querySelector(`.postdiv[id='${val}']>.content`).innerHTML
    let button = document.createElement("button")
    button.innerHTML = "confirm edit"
    button.setAttribute("onclick", `saveedit(${val})`)

    const editdiv = document.createElement("div")
    editdiv.append(message, title, textarea, button)
    document.querySelector(`.postdiv[id='${val}']`).innerHTML = editdiv.innerHTML
}

function saveedit(id){
    console.log(id)
    
}


function test() {
    console.log("CLICKED")
    fetch('like', {
        method: "POST",
        body: JSON.stringify({
            text: "XXX",
        })
    })
}
