
from django.urls import path

from . import views

app_name = "network"
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following", views.following, name="following"),
    path("profile/<str:username>", views.profile_view, name="profile_view"),
    
    # API Routes
    path("like", views.like_comment),
    path("allposts", views.allposts, name="allposts"),
    path("likepost/<int:post_id>", views.likepost, name="likepost"),
    path("editpost/<int:post_id>", views.editpost, name="editpost"),
]
