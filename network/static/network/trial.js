function Post(props) {
//     <div class="postdiv" id={{ post.id }}>
//     <article class="username">
//         <a href="{% url 'network:profile_view' username=post.username %}">
//             {{ post.username }}
//         </a><br>
//     </article>

//     <article class="title"><strong>{{ props.title }}</strong><br></article>
//     <article class="content">{{ props.content }}</article>

//     <div class="likes" id="likes_{{post.id}}">
//         {{ props.likes }} likes
//     </div>
//     <div class="time">
//         Last edited on {{ post.time }}
//     </div><br>

//     {% if post.liked != None %}
//         <button class="like_button" data-id={{ post.id }}>
//             <div id="like_button_{{post.id}}">
//                 {% if post.liked %}
//                 UNLIKE
//                 {% else %}
//                 LIKE
//                 {% endif %}
//             </div>
//         </button>
//         {% if post.username == request.user %}
//             <button class="edit_button" data-id={{ post.id }}>Edit Post</button>
//         {% endif %}
//     {% endif %}
//     <br>
// </div>
    return(
        <div>
            <article class="title"><strong>{props.title}</strong></article><br/>
            <article class="content">{props.content}</article>
            <div class="likes" id="likes_{{post.id}}">{props.likes} likes</div>
            <div class="time">Last edited on {props.time}</div><br></br>
        </div>
    );
}



// function App() {
//     function getPosts() {
//         console.log("GETPOSTS")
//         fetch("/allposts", {
//             method: "GET",
//         })
//         .then(response => response.json())
//         .then(posts => {
//             console.log(posts)
//             })
//         }
//     return (
//         <div>
//             HELLO WORLD
//             <button onClick={getPosts}>BOOYEA</button>
//         </div>
//     );
// }

function App() {
    let x = "{{ following|safe }}"
    console.log(x)
    return (
        <div>
        <h1>API Posts, {x}</h1>
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector("#post"));