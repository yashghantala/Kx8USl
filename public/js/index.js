(function () {

    function appendComment(comment) {
        comment.forEach((cmt) => {
            let html = `  <div class="comment" data-comment-id=${cmt.id}>
            <div class="user-profile">
                <img class="img-avatar" src="./public/images/avatar.png" alt="user avatar">
                <div></div>
            </div>
            <div class="user-comment-details">
                <div class="comment-head">
                    <span class="user-name">${cmt.name}</span>●
                    <span class="comment-timestamp">${timeDifference(new Date(), new Date(cmt.createdAt))}</span>
                </div>
                <div class="comment-content">
                  ${cmt.comment}
                </div>
                <div class="comment-options">
                    <span class="comment-upvote ${cmt.upvoted == 1 ? "upvoted" : ""}"><i class="fa-solid fa-circle-up"></i> <span class="upvote-text">${cmt.upvoted == 1 ? "upvoted" : "upvote"}</span></span>
                    <span class="comment-reply">Reply</span>
                </div>
            </div>
        </div>`
            $(".comment-list").prepend(html)
        })
    }

    function getComments() {
        $.ajax({
            type: "GET",
            url: "comments/get?user_id=" + $('[name=user_id]:checked').val(),
            success: function (res) {
                $(".comment-list").empty()
                appendComment(res)
                $('.loading').remove()
                $('.comments').removeClass('d-none')
            },
        })
    }
    getComments()

    function addComment(id = null) {
        $("textarea[name=comment], button[type=submit]").attr('disabled', true)
        $.ajax({
            type: "POST",
            url: "comments/create",
            data: {
                "user_id": $('[name=user_id]:checked').val(),
                "comment_id": id,
                "comment": $('[name=comment]').val(),
            },
            success: function (res) {
                $("textarea[name=comment]").val("")
                appendComment(res)
            },
        }).always(function (e) {
            $("textarea[name=comment], button[type=submit]").attr('disabled', false)
        })
    }

    function upvoteComment(comment_id) {
        $.ajax({
            type: "POST",
            url: "comments/upvote/",
            data: {
                "user_id": $('[name=user_id]:checked').val(),
                "comment_id": comment_id
            },
            success: function (res) {
                if (res.upvoted) {
                    $("[data-comment-id=" + res.comment_id + "] .comment-upvote").addClass("upvoted")
                    $("[data-comment-id=" + res.comment_id + "] .comment-upvote.upvoted .upvote-text").text("upvoted")
                } else {
                    $("[data-comment-id=" + res.comment_id + "] .comment-upvote").removeClass("upvoted")
                    $("[data-comment-id=" + res.comment_id + "] .comment-upvote .upvote-text").text("upvote")
                }
            },
        })
    }

    function timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

    $('.submit-comment').click(function (e) {
        addComment()
    })

    $('textarea[name=comment]').on('keypress', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            addComment()
        }
    })

    $('.comment-list').on('click', '.comment-upvote', function (e) {
        upvoteComment($(e.target).closest('[data-comment-id]').attr('data-comment-id'))
    })

    $('input[type=radio][name=user_id]').change(function () {
        getComments()
    });
})()