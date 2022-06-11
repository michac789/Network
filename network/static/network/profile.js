document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#follow').onclick = () => { 
        // const data = JSON.stringify({user_id: parseInt(this.dataset.userid)})
        // console.log(data)
        console.log("yoyoyo")
        console.log(document.querySelector("#follow").dataset.userid)
        const x = document.querySelector("#follow")
        console.log(x)
        console.log(x.dataset.userid)
        follow(document.querySelector("#follow").dataset.userid)
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
        // if (result.success === "liked"){
        //     document.querySelector(`#like_button_${result.post_id}`).innerHTML = "UNLIKE";
        //     document.querySelector(`#likes_${result.post_id}`).innerHTML = `${result.likes + 1} likes`;
        // } else {
        //     document.querySelector(`#like_button_${result.post_id}`).innerHTML = "LIKE";
        //     document.querySelector(`#likes_${result.post_id}`).innerHTML = `${result.likes - 1} likes`;
        // }
    })
    .catch(error => console.log(`Error detected: ${error}`))
}

