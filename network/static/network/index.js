document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#test").onclick = test

    // like or dislike button functionality
    document.querySelectorAll(".like_button").forEach(
        el => el.onclick = () => { like(el.value) })
    
})


function like(val) {
    console.log("success")
    fetch(`likepost/${val}`, {
        method: "FETCH",
        body: JSON.stringify({
            test: "XXX",
        })
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


function test() {
    console.log("CLICKED")
    fetch('like', {
        method: "POST",
        body: JSON.stringify({
            text: "XXX",
        })
    })
}
