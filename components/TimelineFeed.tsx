"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import {
    Sparkles,
    FileText,
    Bookmark,
    BookmarkCheck,
    TrendingUp,
    ImageIcon,
    Tag,
    MoreHorizontal,
    MessageSquare,
    Share2,
    Trash2,
    Calendar,
    Clock,
    Video,
    CheckCircle2,
    ThumbsUp,
    LogIn,
    UserPlus,
    Lock
} from "lucide-react";

interface CommentReply {
    id: string;
    author_name: string;
    author_avatar?: string;
    content: string;
    created_at: string;
}

interface PostComment {
    id: string;
    author_name: string;
    author_avatar?: string;
    content: string;
    created_at: string;
    replies?: CommentReply[];
}

interface PostReactions {
    Like?: number;
    Love?: number;
    Care?: number;
    Haha?: number;
    Wow?: number;
    Sad?: number;
    Angry?: number;
    [key: string]: number | undefined;
}

interface PostItem {
    id: string;
    author_name: string;
    author_email?: string;
    author_role?: string;
    author_avatar?: string;
    content: string;
    image_url?: string;
    tags?: string[];
    category?: string;
    created_at: string;
    reactions: PostReactions;
    userReactions?: Record<string, string>;
    comments?: PostComment[];
}

const REACTION_OPTIONS = [
    { name: "Like", emoji: "👍", color: "#4cd7f6" },
    { name: "Love", emoji: "❤️", color: "#fbabff" },
    { name: "Care", emoji: "🥰", color: "#ddb7ff" },
    { name: "Haha", emoji: "😆", color: "#ffb4ab" },
    { name: "Wow", emoji: "😮", color: "#ddb7ff" },
    { name: "Sad", emoji: "😢", color: "#4cd7f6" },
    { name: "Angry", emoji: "😡", color: "#ffb4ab" },
];

function formatCount(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(".0", "") + "k";
    }
    return num.toString();
}

function getTotalReactions(reactions?: PostReactions): number {
    if (!reactions) return 0;
    return Object.values(reactions).reduce<number>((acc, count) => acc + (count || 0), 0);
}

function formatTimeAgo(dateStr: string) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
        return "Recently";
    }
}

export default function TimelineFeed() {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"timeline" | "myposts" | "saved" | "trending">("timeline");

    // Post creation state
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostImageUrl, setNewPostImageUrl] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [newPostTags, setNewPostTags] = useState("");
    const [showTagInput, setShowTagInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Saved post IDs
    const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

    // Expanded comments state
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    // Comments & replies inputs
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
    const [replyInputs, setReplyInputs] = useState<Record<string, { active: boolean; text: string }>>({});

    // Share toast state
    const [shareToast, setShareToast] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/timeline");
            const data = await res.json();
            if (data.success && Array.isArray(data.posts)) {
                setPosts(data.posts);
            }
        } catch (e) {
            console.error("Failed to fetch timeline posts:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!isLoggedIn || !newPostContent.trim()) return;

        setIsSubmitting(true);
        try {
            const parsedTags = newPostTags
                ? newPostTags.split(",").map(t => t.trim().startsWith("#") ? t.trim() : `#${t.trim()}`).filter(Boolean)
                : [];

            const res = await fetch("/api/timeline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newPostContent,
                    image_url: newPostImageUrl,
                    tags: parsedTags,
                    author_name: user?.name,
                    author_avatar: user?.avatarUrl,
                    author_email: user?.email,
                    author_role: user?.role === "main" || user?.role === "media" ? "Verified Admin" : "Researcher"
                }),
            });

            const data = await res.json();
            if (data.success && data.post) {
                setPosts(prev => [data.post, ...prev]);
                setNewPostContent("");
                setNewPostImageUrl("");
                setShowImageInput(false);
                setNewPostTags("");
                setShowTagInput(false);
            }
        } catch (e) {
            console.error("Failed to create post:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await fetch(`/api/timeline?id=${postId}`, { method: "DELETE" });
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (e) {
            console.error("Failed to delete post:", e);
        }
    };

    const handleReaction = async (postId: string, reactionName: string) => {
        const currentUserEmail = user?.email || "guest_session";

        setPosts(prevPosts =>
            prevPosts.map(p => {
                if (p.id !== postId) return p;

                const currentReactionMap = { ...(p.userReactions || {}) };
                const currentReaction = currentReactionMap[currentUserEmail];
                const newReactions = { ...(p.reactions || {}) };

                if (currentReaction === reactionName) {
                    delete currentReactionMap[currentUserEmail];
                    if ((newReactions[reactionName] || 0) > 0) {
                        newReactions[reactionName] = (newReactions[reactionName] || 0) - 1;
                    }
                } else {
                    if (currentReaction && (newReactions[currentReaction] || 0) > 0) {
                        newReactions[currentReaction] = (newReactions[currentReaction] || 0) - 1;
                    }
                    currentReactionMap[currentUserEmail] = reactionName;
                    newReactions[reactionName] = (newReactions[reactionName] || 0) + 1;
                }

                return {
                    ...p,
                    reactions: newReactions,
                    userReactions: currentReactionMap,
                };
            })
        );

        try {
            await fetch("/api/timeline/react", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId,
                    reaction: reactionName,
                    userEmail: currentUserEmail,
                }),
            });
        } catch (e) {
            console.error("Failed to update reaction:", e);
        }
    };

    const handleToggleBookmark = (postId: string) => {
        setSavedPostIds(prev =>
            prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
        );
    };

    const handleSharePost = (postId: string) => {
        if (typeof window !== "undefined") {
            const url = `${window.location.origin}/timeline#${postId}`;
            navigator.clipboard.writeText(url);
            setShareToast("Link copied to clipboard!");
            setTimeout(() => setShareToast(null), 3000);
        }
    };

    const handleAddComment = async (postId: string, parentId?: string) => {
        if (!isLoggedIn) return;

        const key = parentId || postId;
        const text = parentId
            ? replyInputs[key]?.text
            : commentTexts[postId];

        if (!text || !text.trim()) return;

        if (parentId) {
            setReplyInputs(prev => ({ ...prev, [key]: { active: false, text: "" } }));
        } else {
            setCommentTexts(prev => ({ ...prev, [postId]: "" }));
        }

        try {
            const res = await fetch("/api/timeline/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId,
                    parentId,
                    content: text,
                    author_name: user?.name || "You",
                    author_avatar: user?.avatarUrl || "",
                    author_email: user?.email,
                }),
            });

            const data = await res.json();
            if (data.success && data.comment) {
                setPosts(prevPosts =>
                    prevPosts.map(p => {
                        if (p.id !== postId) return p;
                        const existingComments = p.comments || [];
                        if (!parentId) {
                            return { ...p, comments: [...existingComments, data.comment] };
                        } else {
                            const updatedComments = existingComments.map(c => {
                                if (c.id === parentId) {
                                    return {
                                        ...c,
                                        replies: [...(c.replies || []), data.comment]
                                    };
                                }
                                return c;
                            });
                            return { ...p, comments: updatedComments };
                        }
                    })
                );
            }
        } catch (e) {
            console.error("Failed to add comment:", e);
        }
    };

    const currentUserEmail = user?.email || "";
    const filteredPosts = posts.filter(post => {
        if (isLoggedIn && activeTab === "myposts") {
            return post.author_email?.toLowerCase() === currentUserEmail.toLowerCase();
        }
        if (isLoggedIn && activeTab === "saved") {
            return savedPostIds.includes(post.id);
        }
        if (activeTab === "trending") {
            return getTotalReactions(post.reactions) > 50 || (post.comments && post.comments.length > 2);
        }
        return true;
    });

    return (
        <div className={`grid grid-cols-1 ${isLoggedIn ? "lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_320px]" : "xl:grid-cols-[1fr_320px]"} gap-6`}>
            
            {/* Toast Notification */}
            {shareToast && (
                <div className="fixed bottom-6 right-6 bg-primary text-on-primary font-bold px-4 py-2 rounded-lg shadow-xl z-50 transition-all text-sm animate-bounce">
                    {shareToast}
                </div>
            )}

            {/* LEFT SIDEBAR - Only visible to Logged-in Members */}
            {isLoggedIn && (
                <aside className="hidden lg:block relative">
                    <div className="sticky top-32 space-y-2">
                        <div className="glass-panel rounded-xl p-4 flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab("timeline")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-medium text-sm ${
                                    activeTab === "timeline"
                                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high group"
                                }`}
                            >
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span>Timeline</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("myposts")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-medium text-sm ${
                                    activeTab === "myposts"
                                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high group"
                                }`}
                            >
                                <FileText className="w-5 h-5 group-hover:text-secondary transition-colors" />
                                <span>My Posts</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("saved")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-medium text-sm ${
                                    activeTab === "saved"
                                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high group"
                                }`}
                            >
                                <Bookmark className="w-5 h-5 group-hover:text-secondary transition-colors" />
                                <span>Saved Posts</span>
                            </button>

                            <hr className="border-outline-variant/20 my-2" />

                            <button
                                onClick={() => setActiveTab("trending")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-medium text-sm ${
                                    activeTab === "trending"
                                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high group"
                                }`}
                            >
                                <TrendingUp className="w-5 h-5 group-hover:text-secondary transition-colors" />
                                <span>Trending</span>
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {/* CENTER COLUMN (Feed) */}
            <section className="flex flex-col gap-6 min-w-0">
                {/* Hero Header */}
                <div className="mb-2">
                    <h1 className="font-display-md text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface mb-2 tracking-tight">
                        ASL{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Timeline
                        </span>
                    </h1>
                    <p className="font-body-lg text-on-surface-variant max-w-2xl text-sm sm:text-base leading-relaxed">
                        Discover the latest research updates, engineering projects, achievements, events, and innovations shared by the Alpha Science Lab community.
                    </p>
                </div>

                {/* CREATE POST CARD - Logged-in Members Only */}
                {isLoggedIn ? (
                    <div className="glass-panel rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/30 flex-shrink-0 overflow-hidden relative">
                                {user?.avatarUrl ? (
                                    <Image
                                        src={user.avatarUrl}
                                        alt={user.name || "User Avatar"}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-sm">
                                        {user?.name ? user.name.slice(0, 2).toUpperCase() : "ASL"}
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow space-y-3">
                                <input
                                    type="text"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-sm sm:text-base focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/50 transition-all"
                                    placeholder={`Share your latest research, ${user.name.split(" ")[0]}...`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey && newPostContent.trim()) {
                                            e.preventDefault();
                                            handleCreatePost();
                                        }
                                    }}
                                />

                                {showImageInput && (
                                    <input
                                        type="text"
                                        value={newPostImageUrl}
                                        onChange={(e) => setNewPostImageUrl(e.target.value)}
                                        placeholder="Paste Image URL (https://...)"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary transition-all"
                                    />
                                )}

                                {showTagInput && (
                                    <input
                                        type="text"
                                        value={newPostTags}
                                        onChange={(e) => setNewPostTags(e.target.value)}
                                        placeholder="Enter tags separated by comma (e.g. Robotics, LiDAR, AI)"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary transition-all"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-outline-variant/10">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowImageInput(!showImageInput)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        showImageInput
                                            ? "bg-secondary/20 text-secondary"
                                            : "text-on-surface-variant hover:bg-surface-container-high hover:text-secondary"
                                    }`}
                                >
                                    <ImageIcon className="w-4 h-4" /> Image
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowTagInput(!showTagInput)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        showTagInput
                                            ? "bg-primary/20 text-primary"
                                            : "text-on-surface-variant hover:bg-surface-container-high hover:text-secondary"
                                    }`}
                                >
                                    <Tag className="w-4 h-4" /> Tag
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleCreatePost}
                                disabled={isSubmitting || !newPostContent.trim()}
                                className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors shadow-[0_0_15px_rgba(183,109,255,0.4)] disabled:opacity-50"
                            >
                                {isSubmitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Banner for Guest / Common Users */
                    <div className="glass-panel rounded-xl p-6 border border-primary/20 bg-gradient-to-r from-primary/10 via-surface-container-high/40 to-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-on-surface text-base">Want to share your research?</h3>
                                <p className="text-xs text-on-surface-variant">Log in as an official ASL member to publish posts, achievements, and join discussions.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10 transition-all"
                            >
                                <LogIn className="w-3.5 h-3.5" /> Log In
                            </Link>
                            <Link
                                href="/join"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-[0_0_15px_rgba(221,183,255,0.3)]"
                            >
                                <UserPlus className="w-3.5 h-3.5" /> Join ASL
                            </Link>
                        </div>
                    </div>
                )}

                {/* Posts Feed */}
                {loading ? (
                    <div className="glass-panel rounded-xl p-12 text-center text-on-surface-variant">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                        Loading ASL Timeline feed...
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="glass-panel rounded-xl p-12 text-center text-on-surface-variant">
                        <Sparkles className="w-8 h-8 text-primary/50 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold text-on-surface mb-1">No posts found</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Be the first to share research or an update on the ASL timeline!
                        </p>
                    </div>
                ) : (
                    filteredPosts.map((post) => {
                        const totalReacts = getTotalReactions(post.reactions);
                        const userReact = post.userReactions?.[currentUserEmail];
                        const matchedReactObj = REACTION_OPTIONS.find(r => r.name === userReact);
                        const commentsList = post.comments || [];
                        const isSaved = savedPostIds.includes(post.id);
                        const isCommentsOpen = !!expandedComments[post.id];

                        return (
                            <article
                                key={post.id}
                                className="glass-panel rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1"
                            >
                                {/* Author Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                            {post.author_avatar ? (
                                                <Image
                                                    src={post.author_avatar}
                                                    alt={post.author_name}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-secondary font-bold text-xs bg-secondary/15 w-full h-full flex items-center justify-center">
                                                    {post.author_name.slice(0, 2).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-on-surface text-base">
                                                    {post.author_name}
                                                </span>
                                                {post.author_role && (
                                                    <span className="bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                                                        {post.author_role.includes("Verified") && (
                                                            <CheckCircle2 className="w-3 h-3 text-secondary" />
                                                        )}
                                                        {post.author_role}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-on-surface-variant mt-0.5 font-medium">
                                                {formatTimeAgo(post.created_at)} • {post.category || "General"}
                                            </div>
                                        </div>
                                    </div>

                                    {(user?.email === post.author_email || user?.role === "main" || user?.role === "media") ? (
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="text-on-surface-variant hover:text-red-400 transition-colors p-1"
                                            title="Delete post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <p className="font-body-md text-body-md text-on-surface leading-relaxed mb-3 whitespace-pre-line">
                                        {post.content}
                                    </p>

                                    {post.image_url && (
                                        <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-outline-variant/20 relative group my-3">
                                            <img
                                                src={post.image_url}
                                                alt="Post Image"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-surface-container-highest px-3 py-1 rounded-full text-xs text-on-surface-variant border border-outline-variant/10 hover:border-secondary/30 transition-colors cursor-pointer"
                                            >
                                                {tag.startsWith("#") ? tag : `#${tag}`}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Engagement Bar */}
                                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                                    <div className="flex gap-4 sm:gap-6 items-center">
                                        {/* Reaction Button & Popover (Available for EVERYONE) */}
                                        <div className="relative group/react flex items-center">
                                            <button
                                                onClick={() => handleReaction(post.id, userReact || "Like")}
                                                className="flex items-center gap-1.5 transition-all duration-200"
                                                style={{ color: matchedReactObj ? matchedReactObj.color : undefined }}
                                            >
                                                {matchedReactObj ? (
                                                    <span className="text-[18px] mr-0.5">
                                                        {matchedReactObj.emoji}
                                                    </span>
                                                ) : (
                                                    <ThumbsUp className="w-4 h-4 text-on-surface-variant group-hover/react:text-primary transition-colors" />
                                                )}
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        matchedReactObj ? "" : "text-on-surface-variant group-hover/react:text-primary"
                                                    }`}
                                                >
                                                    {matchedReactObj ? matchedReactObj.name : "Like"}
                                                </span>
                                            </button>

                                            {/* Reaction Count */}
                                            {totalReacts > 0 && (
                                                <span className="text-xs text-on-surface-variant ml-2 font-medium">
                                                    {formatCount(totalReacts)}
                                                </span>
                                            )}

                                            {/* Reactions Popup Card */}
                                            <div className="absolute bottom-full left-0 mb-3 hidden group-hover/react:flex items-center gap-2 bg-surface-container-high/95 backdrop-blur-md border border-primary/20 px-3 py-2 rounded-full shadow-2xl z-50 animate-pop-up">
                                                {REACTION_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.name}
                                                        onClick={() => handleReaction(post.id, opt.name)}
                                                        className="hover:scale-150 active:scale-95 transition-transform duration-200 text-2xl flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-lowest"
                                                        title={opt.name}
                                                    >
                                                        {opt.emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comments Toggle Button */}
                                        <button
                                            onClick={() =>
                                                setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))
                                            }
                                            className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition-colors group"
                                        >
                                            <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-semibold">
                                                {commentsList.length}
                                            </span>
                                        </button>

                                        {/* Share Button (Available for EVERYONE) */}
                                        <button
                                            onClick={() => handleSharePost(post.id)}
                                            className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors group"
                                            title="Share post link"
                                        >
                                            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>

                                    {/* Bookmark (Logged in only) */}
                                    {isLoggedIn && (
                                        <button
                                            onClick={() => handleToggleBookmark(post.id)}
                                            className={`transition-colors ${
                                                isSaved ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                                            }`}
                                            title={isSaved ? "Remove bookmark" : "Save post"}
                                        >
                                            {isSaved ? (
                                                <BookmarkCheck className="w-5 h-5 text-primary" />
                                            ) : (
                                                <Bookmark className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Comments Section */}
                                {isCommentsOpen && (
                                    <div className="comments-section mt-4 pt-4 border-t border-outline-variant/10">
                                        {/* Comment Form - Logged in vs Guest */}
                                        {isLoggedIn ? (
                                            <div className="flex gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex-shrink-0 overflow-hidden relative">
                                                    {user?.avatarUrl ? (
                                                        <Image src={user.avatarUrl} alt="User Avatar" fill sizes="32px" className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary text-[10px] font-bold">
                                                            {user?.name ? user.name.slice(0, 2).toUpperCase() : "YOU"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={commentTexts[post.id] || ""}
                                                        onChange={(e) =>
                                                            setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleAddComment(post.id);
                                                        }}
                                                        placeholder="Write a comment..."
                                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-on-surface font-body-md text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/50 transition-all"
                                                    />
                                                    <button
                                                        onClick={() => handleAddComment(post.id)}
                                                        className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold hover:bg-primary transition-colors shrink-0"
                                                    >
                                                        Comment
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant mb-4">
                                                <span className="flex items-center gap-2">
                                                    <Lock className="w-3.5 h-3.5 text-secondary" /> Only registered members can post comments.
                                                </span>
                                                <Link href="/login" className="text-secondary font-semibold hover:underline">
                                                    Log in to reply
                                                </Link>
                                            </div>
                                        )}

                                        {/* Comment List */}
                                        <div className="space-y-4 comment-list max-h-96 overflow-y-auto pr-1">
                                            {commentsList.map((c) => (
                                                <div key={c.id} className="comment-item flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden flex-shrink-0 relative border border-outline-variant/20">
                                                        {c.author_avatar ? (
                                                            <Image src={c.author_avatar} alt={c.author_name} fill sizes="32px" className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-secondary/15 text-secondary font-bold text-xs">
                                                                {c.author_name.slice(0, 2).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="bg-surface-container-high/60 px-3 py-2 rounded-xl">
                                                            <div className="font-semibold text-primary text-xs">
                                                                {c.author_name}
                                                            </div>
                                                            <div className="text-xs text-on-surface mt-1 leading-relaxed">
                                                                {c.content}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[10px] text-on-surface-variant mt-1 ml-2 font-medium">
                                                            <span>{formatTimeAgo(c.created_at)}</span>
                                                            {isLoggedIn && (
                                                                <button
                                                                    onClick={() =>
                                                                        setReplyInputs(prev => ({
                                                                            ...prev,
                                                                            [c.id]: {
                                                                                active: !prev[c.id]?.active,
                                                                                text: prev[c.id]?.text || "",
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="hover:text-secondary font-semibold"
                                                                >
                                                                    Reply
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Reply Input Form (Members only) */}
                                                        {isLoggedIn && replyInputs[c.id]?.active && (
                                                            <div className="reply-form flex gap-2 mt-2 w-full">
                                                                <input
                                                                    type="text"
                                                                    value={replyInputs[c.id]?.text || ""}
                                                                    onChange={(e) =>
                                                                        setReplyInputs(prev => ({
                                                                            ...prev,
                                                                            [c.id]: { active: true, text: e.target.value },
                                                                        }))
                                                                    }
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") handleAddComment(post.id, c.id);
                                                                    }}
                                                                    placeholder="Write a reply..."
                                                                    className="flex-grow bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/50 transition-all"
                                                                />
                                                                <button
                                                                    onClick={() => handleAddComment(post.id, c.id)}
                                                                    className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-lg text-[10px] uppercase font-bold hover:bg-secondary hover:text-on-secondary transition-colors"
                                                                >
                                                                    Reply
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Nested Replies */}
                                                        {c.replies && c.replies.length > 0 && (
                                                            <div className="replies-list space-y-3 mt-2 ml-6 border-l border-outline-variant/20 pl-4">
                                                                {c.replies.map((reply) => (
                                                                    <div key={reply.id} className="flex gap-2 mt-2">
                                                                        <div className="w-6 h-6 rounded-full bg-surface-container-highest overflow-hidden flex-shrink-0 relative">
                                                                            {reply.author_avatar ? (
                                                                                <Image src={reply.author_avatar} alt={reply.author_name} fill sizes="24px" className="object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center bg-tertiary/15 text-tertiary font-bold text-[9px]">
                                                                                    {reply.author_name.slice(0, 2).toUpperCase()}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-grow bg-surface-container-high/40 px-3 py-1.5 rounded-lg">
                                                                            <div className="font-semibold text-secondary text-[11px]">
                                                                                {reply.author_name}
                                                                            </div>
                                                                            <div className="text-[11px] text-on-surface mt-0.5 leading-relaxed">
                                                                                {reply.content}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </section>

            {/* RIGHT SIDEBAR */}
            <aside className="hidden xl:block relative">
                <div className="sticky top-32 space-y-stack-md">
                    {/* Upcoming Events Card */}
                    <div className="glass-panel rounded-xl p-5">
                        <h3 className="font-semibold text-on-surface mb-4 flex items-center gap-2 text-base">
                            <Calendar className="w-5 h-5 text-primary" /> Upcoming Events
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start bg-surface-container-high/50 p-3 rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded px-3 py-2 border border-outline-variant/20 min-w-[50px]">
                                    <span className="text-secondary uppercase text-[10px] font-bold">Oct</span>
                                    <span className="text-on-surface font-bold text-lg leading-none">14</span>
                                </div>
                                <div>
                                    <div className="text-on-surface font-medium text-sm">Symposium on Applied AI</div>
                                    <div className="text-on-surface-variant text-xs mt-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-secondary" /> 09:00 AM - Main Hall
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start bg-surface-container-high/50 p-3 rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded px-3 py-2 border border-outline-variant/20 min-w-[50px]">
                                    <span className="text-secondary uppercase text-[10px] font-bold">Oct</span>
                                    <span className="text-on-surface font-bold text-lg leading-none">22</span>
                                </div>
                                <div>
                                    <div className="text-on-surface font-medium text-sm">Lab Q3 Review Presentation</div>
                                    <div className="text-on-surface-variant text-xs mt-1 flex items-center gap-1">
                                        <Video className="w-3.5 h-3.5 text-tertiary" /> Virtual Stream
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/events"
                            className="w-full block text-center mt-4 py-2 border border-outline-variant/30 rounded-lg text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high hover:text-on-surface transition-colors"
                        >
                            View All Events
                        </Link>
                    </div>
                </div>
            </aside>
        </div>
    );
}
