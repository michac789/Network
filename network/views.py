from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect, Http404, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.safestring import mark_safe
from django import forms
from json import loads


from .models import User, Post, FollowPair, LikePair


class PostForm(forms.Form):
    title = forms.CharField(label = mark_safe("Title"), max_length = 64)
    content = forms.CharField(widget = forms.Textarea(attrs = {
        'placeholder': "Enter content here..."
    }))
    

def index(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]
            Post.objects.create(
                username = request.user,
                title = title,
                content = content,
            )
        return HttpResponseRedirect(reverse("network:index"))
    posts = Post.objects.all().order_by("-time")
    for post in posts:
        if request.user.is_authenticated:
            post.liked = (True if LikePair.objects.filter(
                    liker = request.user,
                    likedpost = post.id
                ).count() == 1 else False)
        post.likes = LikePair.objects.filter(likedpost = post.id).count()
    return render(request, "network/index.html", {
        "form": PostForm,
        "posts": posts,
        "block_comment": not request.user.is_authenticated,
    })
    

@login_required(login_url="network:login")
def following(request):
    followpairs = FollowPair.objects.filter(follower = request.user)
    following_ids = []
    for followpair in followpairs: following_ids.append(followpair.following.id)
    return render(request, "network/index.html", {
        "following_tab": True,
        "posts": Post.objects.filter(username__in = following_ids),
        "block_comment": not request.user.is_authenticated,
    })


def profile_view(request, username):
    user = User.objects.get(username = username)
    if request.method == "POST":
        x = request.POST["followbutton"]
        print(x)
        if x == "follow":
            FollowPair.objects.create(follower = request.user, following = user)
        elif x == "unfollow":
            FollowPair.objects.get(follower = request.user, following = user).delete()
        else: raise Http404("Invalid button value")
    return render(request, "network/profile.html", {
        "username": username,
        "follower": FollowPair.objects.filter(following = user).count(),
        "following": FollowPair.objects.filter(follower = user).count(),
        "posts": (Post.objects.filter(username = request.user).order_by("-time") if
                  request.user.is_authenticated else []),
        "self": user == request.user,
        "followed": ((True if
            FollowPair.objects.filter(follower = request.user, following = user).count() == 1
            else False) if request.user.is_authenticated else None),
    })


@csrf_exempt
@login_required
def like_comment(request):
    print("HOLA")
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required",
        }, status = 400)
    data = loads(request.body)
    print(data)
    print(data["text"])
    if 1 == 1:
        return JsonResponse({"e": "e"})
    else: return JsonResponse({
        "error": "only like or dislike value supported",
    }, status = 400)
    
    
def allposts(request):
    posts = Post.objects.order_by("-time").all()
    return JsonResponse([post.serialize() for post in posts], safe = False)
    

@csrf_exempt
@login_required
def likepost(request, post_id):
    print("LIKEPOST API ROUTE")
    # check if the post_id is valid
    try: post = Post.objects.get(id = post_id)
    except Post.DoesNotExist:
        return JsonResponse({
            "error": "Invalid post id",
        }, status = 404)
    # only accept fetch request
    if request.method != "FETCH":
        return JsonResponse({
            "error": "Only accept fetch request",
        }, status = 400)
    # create new likepair if not exist yet, otherwise delete
    likepair = LikePair.objects.filter(
        liker = request.user,
        likedpost = post_id
    )
    likes = LikePair.objects.filter(likedpost = post_id).count()
    if likepair.count() == 0:
        newlike = LikePair(
            liker = User.objects.get(username = request.user),
            likedpost = Post.objects.get(id = post_id),
        )
        newlike.save()
        return JsonResponse({ "success": "liked", "post_id": post_id,
                             "likes": likes})
    else:
        likepair.delete()
        return JsonResponse({ "success": "unliked", "post_id": post_id,
                             "likes": likes})


@csrf_exempt
@login_required
def editpost(request, post_id):
    print("EDITPOST API ROUTE")
    # check if the post_id is valid
    try: post = Post.objects.get(id = post_id)
    except Post.DoesNotExist:
        return JsonResponse({
            "error": "Invalid post id",
        }, status = 404)
    # only accept fetch request
    if request.method != "FETCH":
        return JsonResponse({
            "error": "Only accept fetch request",
        }, status = 400)
    # check if the user is valid (the one who created the post)
    if request.user != Post.objects.get(id = post_id).username:
        print("ILLEGAL")
        return JsonResponse({
            "error": "Unauthorized account"
        }, status = 400)
    # save edited content to database
    data = loads(request.body)
    content = data["edited_content"]
    print(content)
    post = Post.objects.get(id = post_id)
    print(post)
    post.content = content
    
    print(post.content)
    post.save()
    return JsonResponse({ "success": "edit saved", "post_id": post_id,
                         "content": content })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("network:index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("network:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match.",
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("network:index"))
    else:
        return render(request, "network/register.html")
