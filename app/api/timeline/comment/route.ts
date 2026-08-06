import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";
import { memoryPosts } from "../route";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;
        const supabaseUser = accessToken ? await getUser(accessToken) : null;

        const body = await req.json();
        const { postId, parentId, content, author_name, author_avatar } = body;

        if (!postId || !content || !content.trim()) {
            return NextResponse.json({ success: false, error: "Post ID and comment content are required" }, { status: 400 });
        }

        let userEmail = supabaseUser?.email || body.author_email || "guest@asl.org";
        let userMember: any = null;
        if (supabaseUser?.email) {
            try {
                userMember = await db.getByEmail("members", supabaseUser.email);
            } catch (e) {}
        }

        const name = author_name || userMember?.name || (userEmail !== "guest@asl.org" ? userEmail.split("@")[0] : "You");
        const avatar = author_avatar || userMember?.image || userMember?.image_url || "";

        const newCommentObj = {
            id: "c_" + Date.now(),
            author_name: name,
            author_email: userEmail,
            author_avatar: avatar,
            content: content.trim(),
            created_at: new Date().toISOString(),
            replies: []
        };

        const post = memoryPosts.find(p => p.id === postId);
        if (post) {
            if (!post.comments) post.comments = [];
            if (!parentId) {
                post.comments.push(newCommentObj);
            } else {
                const parentComment = post.comments.find((c: any) => c.id === parentId);
                if (parentComment) {
                    if (!parentComment.replies) parentComment.replies = [];
                    parentComment.replies.push(newCommentObj);
                } else {
                    post.comments.push(newCommentObj);
                }
            }
        }

        // DB Insert sync attempt
        try {
            const inserted = await db.insert("timeline_comments", {
                post_id: postId,
                parent_id: parentId || null,
                author_name: name,
                author_email: userEmail,
                author_avatar: avatar,
                content: content.trim()
            });
            if (inserted && inserted.id) {
                newCommentObj.id = inserted.id;
            }
        } catch (dbErr) {
            console.warn("DB comment insert skipped:", dbErr);
        }

        return NextResponse.json({
            success: true,
            comment: newCommentObj,
            postComments: post?.comments || []
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
