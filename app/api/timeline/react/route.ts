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
        const { postId, reaction, userEmail: bodyEmail } = body;

        if (!postId || !reaction) {
            return NextResponse.json({ success: false, error: "Missing postId or reaction" }, { status: 400 });
        }

        const userEmail = supabaseUser?.email || bodyEmail || "guest_session";

        // Update memory posts
        const post = memoryPosts.find(p => p.id === postId);
        if (post) {
            if (!post.reactions) post.reactions = { Like: 0, Love: 0, Care: 0, Haha: 0, Wow: 0, Sad: 0, Angry: 0 };
            if (!post.userReactions) post.userReactions = {};

            const prevReaction = post.userReactions[userEmail];

            if (prevReaction === reaction) {
                // Remove reaction
                delete post.userReactions[userEmail];
                if (post.reactions[reaction] > 0) post.reactions[reaction]--;
            } else {
                // If previous reaction existed, decrement it
                if (prevReaction && post.reactions[prevReaction] > 0) {
                    post.reactions[prevReaction]--;
                }
                post.userReactions[userEmail] = reaction;
                post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
            }
        }

        // Attempt DB sync
        try {
            const existing = await db.getByField("timeline_reactions", "post_id", postId);
            type ReactionRecord = { id?: string; user_email?: string; reaction?: string };
            const userRecord = Array.isArray(existing) ? (existing as ReactionRecord[]).find((r: ReactionRecord) => r.user_email === userEmail) : null;

            if (userRecord && userRecord.id) {
                if (userRecord.reaction === reaction) {
                    await db.delete("timeline_reactions", userRecord.id);
                } else {
                    await db.update("timeline_reactions", userRecord.id, { reaction });
                }
            } else {
                await db.insert("timeline_reactions", {
                    post_id: postId,
                    user_email: userEmail,
                    reaction
                });
            }
        } catch (dbErr) {
            console.warn("DB reaction sync skipped:", dbErr);
        }

        return NextResponse.json({
            success: true,
            postReactions: post?.reactions || {},
            currentUserReaction: post?.userReactions?.[userEmail] || null
        });
    } catch (err: unknown) {
        return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
    }
}
