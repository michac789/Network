document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".postdiv").forEach(
        el => el.onclick = (e) => {
            // like or dislike button functionality
            if (e.target && e.target.matches(".like_button")) {
                like(e.target.dataset.id)
            }
            // edit post button functionality
            if (e.target && e.target.matches(".edit_button")) {
                edit(e.target.dataset.id)
            }
        }
    )
})

function like(id) {
    fetch(`http://127.0.0.1:8000/likepost/${id}`, {
        method: "FETCH",
    })
    .then(response => response.json())
    .then(result => {
        if (result.success === "liked"){
            document.querySelector(`.like_button[data-id='${id}']`).innerHTML = "UNLIKE";
            document.querySelector(`#likes_${result.post_id}`).innerHTML = `${result.likes + 1} likes`;
        } else {
            document.querySelector(`.like_button[data-id='${id}']`).innerHTML = "LIKE";
            document.querySelector(`#likes_${result.post_id}`).innerHTML = `${result.likes - 1} likes`;
        }
    })
    .catch(error => console.log(`Error detected:\n${error}`))
}

function edit(id){
    let message = document.createElement("article")
    message.innerHTML = `<h4>Editing Post:</h4>`

    let textarea = document.createElement("textarea")
    textarea.innerHTML = document.querySelector(`.editdiv[id='${id}']>.content`).innerHTML
    textarea.setAttribute("id", `edited_${id}`)
    textarea.setAttribute("class", "form_content")

    let button = document.createElement("button")
    button.innerHTML = "Confirm Edit"
    button.setAttribute("class", "postbutton")
    button.setAttribute("data-id", `${id}`)
    button.setAttribute("onclick", `saveedit(${id})`)

    const editdiv = document.createElement("div")
    editdiv.append(message, textarea, button)
    document.querySelector(`.editdiv[id='${id}']`).innerHTML = editdiv.innerHTML
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
        let content = document.createElement("article")
        content.setAttribute("class", "content")
        content.innerHTML = result.content

        let likediv = document.createElement("div")
        likediv.setAttribute("class", "likes")
        likediv.setAttribute("id", `likes_${id}`)
        likediv.innerHTML = `${result.likes} likes`

        let timediv = document.createElement("div")
        timediv.setAttribute("class", "time")
        timediv.innerHTML = `Last edited on ${result.time}`
        let br = document.createElement("br")

        let button = document.createElement("button")
        button.setAttribute("class", "like_button")
        button.setAttribute("data-id", id)
        button.innerHTML = result.liked ? "UNLIKE" : "LIKE"

        let editbutton = document.createElement("button")
        editbutton.setAttribute("class", "edit_button")
        editbutton.setAttribute("data-id", id)
        editbutton.innerHTML = "Edit Post"

        const newdiv = document.createElement("div")
        newdiv.append(content, likediv, timediv, br, button, editbutton)
        document.querySelector(`.editdiv[id='${id}']`).innerHTML = newdiv.innerHTML
    })
    .catch(error => console.log(`Error detected:\n${error}`))
}
