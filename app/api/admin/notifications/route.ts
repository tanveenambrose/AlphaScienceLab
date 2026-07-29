import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const mockNotifications = [
    {
        id: "notif_1",
        type: "media_project_update",
        title: "Media Team Request: New High-Res Render for VLSI Chip Project",
        description: "The Media Team uploaded 4 new high-resolution 3D renders and updated video demonstration for the VLSI & Semiconductor project page.",
        author: {
            name: "Tanveen Ambrose",
            role: "Media Lead",
            email: "media@alphasciencelab.com",
        },
        targetName: "VLSI Semiconductor",
        content: "Updated hero poster & benchmark diagrams attached for final admin review.",
        timestamp: "10 mins ago",
        status: "pending",
    },
    {
        id: "notif_2",
        type: "media_event_update",
        title: "Media Team Request: Robotics Expo 2026 Poster & Flyer",
        description: "Media team created a new event banner and registration schedule for the upcoming ASL Robotics Hackathon.",
        author: {
            name: "Sarah Chen",
            role: "Media Designer",
            email: "sarah@alphasciencelab.com",
        },
        targetName: "ASL Robotics Hackathon",
        content: "Event poster added with updated sponsor logos and registration deadline.",
        timestamp: "1 hour ago",
        status: "pending",
    },
    {
        id: "notif_3",
        type: "member_post_submission",
        title: "Member Feed Submission: Autonomous Drone Path Planning Article",
        description: "ASL Member submitted a research breakdown post for the community feed titled 'Optimizing LiDAR SLAM on Micro-Drones'.",
        author: {
            name: "Alex Rivera",
            role: "Research Member",
            email: "alex.rivera@asl.org",
        },
        content: "We achieved 120 FPS real-time point cloud mapping using embedded CUDA cores. Here is our benchmark overview...",
        timestamp: "3 hours ago",
        status: "pending",
    },
];

export async function GET() {
    return NextResponse.json(mockNotifications);
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();
        const item = mockNotifications.find(n => n.id === id);
        if (item) {
            item.status = status;
        }
        return NextResponse.json({ success: true, id, status });
    } catch {
        return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
    }
}
