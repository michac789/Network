document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("root").onclick = (e) => {
            if (e.target && e.target.matches("#follow")) {
                console.log("papapappa")
                follow(e.target.dataset.userid)
            }
        }
})

function follow(user_id) {
    console.log("follow")
    fetch(`/followuser/${user_id}`, {
        method: "PUT",
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
    .catch(error => console.log(`Error detected: ${error}`))
}
