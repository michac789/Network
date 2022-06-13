from django.core.paginator import Paginator
from .models import LikePair


def fetchlikes(request, queryset):
    for post in queryset:
        if request.user.is_authenticated:
            post.liked = (True if LikePair.objects.filter(
                    liker = request.user,
                    likedpost = post.id
                ).count() == 1 else False)
        post.likes = LikePair.objects.filter(likedpost = post.id).count()
    return queryset


def paginate(request, posts, num):
    p = Paginator(posts, num)
    if "page" in request.GET:
        return p.page(request.GET["page"])
    else: return p.page(1)
