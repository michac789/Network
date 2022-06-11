document.addEventListener("DOMContentLoaded", () => {
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
    fetch(`http://127.0.0.1:8000/likepost/${val}`, {
        method: "FETCH",
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.success === "liked"){
            document.querySelector(`#like_button_${result.post_id}`).innerHTML = "UNLIKE";
            document.querySelector(`#likes_${result.post_id}`).innerHTML = `${result.likes + 1} likes`;
        } else {
            document.querySelector(`#like_button_${result.post_id}`).innerHTML = "LIKE";
            document.querySelector(`#likes_${result.post_id}`).innerHTML = `${result.likes - 1} likes`;
        }
    })
    .catch(error => console.log(`Error detected: ${error}`))
}

function edit(id){
    let message = document.createElement("article")
    message.innerHTML = `<h3>Editing Post:</h3>`
    let title = document.querySelector(`.postdiv[id='${id}']>.title`)
    let textarea = document.createElement("textarea")
    textarea.innerHTML = document.querySelector(`.postdiv[id='${id}']>.content`).innerHTML
    textarea.setAttribute("id", `edited_${id}`)
    let button = document.createElement("button")
    button.innerHTML = "confirm edit"
    button.setAttribute("class", "confirmedit")
    button.setAttribute("data-id", `${id}`)
    button.setAttribute("onclick", `saveedit(${id})`)

    const editdiv = document.createElement("div")
    editdiv.append(message, title, textarea, button)
    document.querySelector(`.postdiv[id='${id}']`).innerHTML = editdiv.innerHTML
}

function saveedit(id){
    fetch(`editpost/${id}`, {
        method: "FETCH",
        body: JSON.stringify({
            edited_content: document.getElementById(`edited_${id}`).value,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)

        document.querySelector(`.postdiv[id='${result.post_id}']`).innerHTML = result.content
        // TODO

        // if (result.success === "liked"){
        //     document.querySelector(`#like_button_${result.post_id}`).innerHTML = "UNLIKE";
        //     document.querySelector(`#likes_${result.post_id}`).innerHTML = result.likes + 1;
        // } else {
        //     document.querySelector(`#like_button_${result.post_id}`).innerHTML = "LIKE";
        //     document.querySelector(`#likes_${result.post_id}`).innerHTML = result.likes - 1;
        // }
    })
    .catch(error => console.log(`Error detected: ${error}`))
}
