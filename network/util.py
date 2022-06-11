from .models import LikePair


def fetchlikes(queryset, request):
    for post in queryset:
        if request.user.is_authenticated:
            post.liked = (True if LikePair.objects.filter(
                    liker = request.user,
                    likedpost = post.id
                ).count() == 1 else False)
        post.likes = LikePair.objects.filter(likedpost = post.id).count()
    return queryset
