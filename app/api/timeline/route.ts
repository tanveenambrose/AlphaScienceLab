import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser, db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// In-memory fallback post store to guarantee functionality out-of-the-box
let memoryPosts: any[] = [
    {
        id: "post-1",
        author_name: "Dr. Elena Rostova",
        author_email: "elena.rostova@asl.org",
        author_role: "Lead Researcher",
        author_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXZJM8TPAjqTDsX0K9sfVPMhQw0KfKxpkj2kIkjVM_LP7Cp-6Fu9nZdlQnJGoLxPv3vIJCFUHkD9XZ3EPDkQE_V_Xz-yaYUzRFei6Hhla4gaLC1IJ1M6yViXxOaDY-i8Snvsc8iKedTSoPMarp0vZptUVwNMTNjA2LDYi9-1aY1x3io4CeKrruAnqyE8-bqLW3cpkMCd7uxmLKjzgqTd0PZ-DJBwoCththAuQuwlSk-TVeDriKlJuY",
        content: "Initial tests on the Series-7 autonomous drone navigation matrix have shown a 24% increase in spatial mapping efficiency. The integration of the new LiDAR synthesis algorithm is proving highly effective in zero-light environments. Next phase: thermal interference testing.",
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2_BDaat6YcGQkA_LlHHYrddZUsOhSQ6V6bLoZ8h73mczGnvTEANO1YbStCche4Injnyb6BgbT7O5XfLf8hCHttTpiN4ZaKz-5haa6thelEhSdTuHEZV_jL0JjXI2QJVvluIAoeXgnCe0KXSbsr2EN58DNqqECh_z4gpR4YiyLbKH2Cy400RwPxjEkujRrGWu8VKXT1KuOqKWM3nU_y4cZ5yXkFn3p4rCw_3yrlxRysQhYkfDWFVgU",
        tags: ["#Robotics", "#AutonomousNav", "#LiDAR"],
        category: "Robotics Division",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reactions: {
            Like: 142,
            Love: 98,
            Care: 45,
            Haha: 12,
            Wow: 32,
            Sad: 3,
            Angry: 10
        },
        userReactions: {},
        comments: [
            {
                id: "post1_c1",
                author_name: "Dr. Elena Rostova",
                author_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXZJM8TPAjqTDsX0K9sfVPMhQw0KfKxpkj2kIkjVM_LP7Cp-6Fu9nZdlQnJGoLxPv3vIJCFUHkD9XZ3EPDkQE_V_Xz-yaYUzRFei6Hhla4gaLC1IJ1M6yViXxOaDY-i8Snvsc8iKedTSoPMarp0vZptUVwNMTNjA2LDYi9-1aY1x3io4CeKrruAnqyE8-bqLW3cpkMCd7uxmLKjzgqTd0PZ-DJBwoCththAuQuwlSk-TVeDriKlJuY",
                content: "This is a breakthrough result for our LiDAR integration experiments!",
                created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
                replies: [
                    {
                        id: "post1_c1_r1",
                        author_name: "Alex Mercer",
                        author_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-H6BeDS5h13kScxQJFXtjslDhUfBJRyZ6MBpPNdGfyMwIfuRlh761cvtMZdz7oxWm7Ch2C8y15qpEDid-ZyrYSsqDSFpYUQ2KJhUTvnzoiA3IrotymIXO7J5wIJQGNBG9e0IXAQJoEMkLCBc21NxKxf9VUhCa7QtdtJjvr5VsDkvSWcl4AiDlwBydUCfD2gwhRBv3gd1aQUtWF0J7KOlBS2UzduBsxbTPXFODejkgoXmKt8VKiMkp",
                        content: "Excellent work, congratulations!",
                        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    }
                ]
            },
            {
                id: "post1_c2",
                author_name: "Sarah Jenkins",
                author_avatar: "",
                content: "Are there any plans for publication in the upcoming symposium?",
                created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                replies: []
            }
        ]
    },
    {
        id: "post-2",
        author_name: "Official ASL Announcement",
        author_email: "official@asl.org",
        author_role: "Verified",
        author_avatar: "",
        content: "We are thrilled to announce the successful deployment of the Quantum Sensor Array node in the upper stratosphere. This marks a critical milestone for Project AETHER. Data streams are normalizing, and we expect preliminary atmospheric readings within 48 hours. Congratulations to the propulsion and payload teams!",
        image_url: "",
        tags: ["#QuantumSensor", "#ProjectAETHER", "#Stratosphere"],
        category: "General",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        reactions: {
            Like: 450,
            Love: 620,
            Care: 80,
            Haha: 5,
            Wow: 110,
            Sad: 1,
            Angry: 2
        },
        userReactions: {},
        comments: [
            {
                id: "post2_c1",
                author_name: "Chief Engineer David",
                author_avatar: "",
                content: "Project AETHER is reaching new heights! Proud of the propulsion team.",
                created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                replies: []
            },
            {
                id: "post2_c2",
                author_name: "Dr. Elena Rostova",
                author_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXZJM8TPAjqTDsX0K9sfVPMhQw0KfKxpkj2kIkjVM_LP7Cp-6Fu9nZdlQnJGoLxPv3vIJCFUHkD9XZ3EPDkQE_V_Xz-yaYUzRFei6Hhla4gaLC1IJ1M6yViXxOaDY-i8Snvsc8iKedTSoPMarp0vZptUVwNMTNjA2LDYi9-1aY1x3io4CeKrruAnqyE8-bqLW3cpkMCd7uxmLKjzgqTd0PZ-DJBwoCththAuQuwlSk-TVeDriKlJuY",
                content: "Looking forward to seeing the preliminary readings!",
                created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                replies: []
            }
        ]
    }
];

export async function GET() {
    try {
        let dbPosts: any[] = [];
        let fetchedFromDb = false;

        try {
            dbPosts = await db.getAll("timeline_posts");

            // Seed DB if table is empty
            if (Array.isArray(dbPosts) && dbPosts.length === 0) {
                for (const p of memoryPosts) {
                    try {
                        const inserted = await db.insert("timeline_posts", {
                            author_name: p.author_name,
                            author_email: p.author_email,
                            author_role: p.author_role,
                            author_avatar: p.author_avatar,
                            content: p.content,
                            image_url: p.image_url,
                            tags: p.tags,
                            category: p.category
                        });
                        if (inserted && inserted.id) {
                            p.id = inserted.id;
                        }
                    } catch {}
                }
                dbPosts = await db.getAll("timeline_posts").catch(() => []);
            }

            if (Array.isArray(dbPosts) && dbPosts.length > 0) {
                fetchedFromDb = true;

                for (const post of dbPosts) {
                    try {
                        const reactionsList = await db.getByField("timeline_reactions", "post_id", post.id);
                        const counts: Record<string, number> = { Like: 0, Love: 0, Care: 0, Haha: 0, Wow: 0, Sad: 0, Angry: 0 };
                        const userReactions: Record<string, string> = {};
                        if (Array.isArray(reactionsList)) {
                            reactionsList.forEach((r: any) => {
                                counts[r.reaction] = (counts[r.reaction] || 0) + 1;
                                userReactions[r.user_email] = r.reaction;
                            });
                        }
                        post.reactions = counts;
                        post.userReactions = userReactions;
                    } catch {
                        post.reactions = { Like: 0, Love: 0, Care: 0, Haha: 0, Wow: 0, Sad: 0, Angry: 0 };
                        post.userReactions = {};
                    }

                    try {
                        const commentsList = await db.getByField("timeline_comments", "post_id", post.id);
                        if (Array.isArray(commentsList)) {
                            const roots = commentsList.filter((c: any) => !c.parent_id);
                            roots.forEach((root: any) => {
                                root.replies = commentsList.filter((c: any) => c.parent_id === root.id);
                            });
                            post.comments = roots;
                        } else {
                            post.comments = [];
                        }
                    } catch {
                        post.comments = [];
                    }
                }
            }
        } catch {
            // DB fallback to memoryPosts
        }

        const postsToReturn = fetchedFromDb && dbPosts.length > 0 ? dbPosts : memoryPosts;
        return NextResponse.json({ success: true, posts: postsToReturn });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;
        const supabaseUser = accessToken ? await getUser(accessToken) : null;

        const body = await req.json();
        const { content, image_url, tags, category, author_name, author_avatar, author_role } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
        }

        let userEmail = supabaseUser?.email || body.author_email || "anonymous@asl.org";
        let userMember: any = null;
        if (supabaseUser?.email) {
            try {
                userMember = await db.getByEmail("members", supabaseUser.email);
            } catch (e) {}
        }

        const name = author_name || userMember?.name || userEmail.split("@")[0] || "ASL Researcher";
        const avatar = author_avatar || userMember?.image || userMember?.image_url || "";
        const role = author_role || userMember?.role || "Researcher";

        const newPostData = {
            id: "post-" + Date.now(),
            author_name: name,
            author_email: userEmail,
            author_role: role,
            author_avatar: avatar,
            content: content.trim(),
            image_url: image_url || "",
            tags: Array.isArray(tags) ? tags : [],
            category: category || "General",
            created_at: new Date().toISOString(),
            reactions: { Like: 0, Love: 0, Care: 0, Haha: 0, Wow: 0, Sad: 0, Angry: 0 },
            userReactions: {},
            comments: []
        };

        // Try inserting into DB
        try {
            const inserted = await db.insert("timeline_posts", {
                author_name: name,
                author_email: userEmail,
                author_role: role,
                author_avatar: avatar,
                content: content.trim(),
                image_url: image_url || "",
                tags: Array.isArray(tags) ? tags : [],
                category: category || "General"
            });
            if (inserted && inserted.id) {
                newPostData.id = inserted.id;
            }
        } catch (dbErr) {
            console.warn("DB Post insertion failed, added to memory posts:", dbErr);
        }

        memoryPosts.unshift(newPostData);
        return NextResponse.json({ success: true, post: newPostData });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        }

        try {
            await db.delete("timeline_posts", id);
        } catch (e) {}

        memoryPosts = memoryPosts.filter(p => p.id !== id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export { memoryPosts };
