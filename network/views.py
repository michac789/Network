from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from json import loads

from .models import User, Post, FollowPair


class PostForm(forms.Form):
    title = forms.CharField(label = "title", max_length = 64)
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
        return HttpResponseRedirect(reverse("index"))
    else:
        posts = Post.objects.all()
        posts = Post.objects.order_by("-time")
        return render(request, "network/index.html", {
            "form": PostForm,
            "posts": posts,
        })


def profile_view(request, username):
    user = User.objects.get(username = username)
    if request.method == "POST":
        pass #TODO
    return render(request, "network/profile.html", {
        "username": username,
        "follower": FollowPair.objects.filter(following = user).count(),
        "following": FollowPair.objects.filter(follower = user).count(),
        "posts": Post.objects.filter(username = request.user).order_by("-time"),
        "self": (True if user == request.user else False),
        "followed": (True if
            FollowPair.objects.filter(follower = request.user, following = user).count() == 1
            else False),
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
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
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
