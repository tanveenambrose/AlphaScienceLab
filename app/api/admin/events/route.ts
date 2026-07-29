import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let eventsList = [
    {
        id: "evt_1",
        title: "ASL Annual Quantum & AI Hackathon 2026",
        description: "36-hour continuous build challenge focusing on hybrid AI models, embedded edge compute, and autonomous robotics.",
        date: "2026-08-12",
        location: "Main Lab Complex & Virtual Stream",
        category: "Hackathon",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        status: "Upcoming",
    },
    {
        id: "evt_2",
        title: "VLSI Wafer Architecture & Chip Design Masterclass",
        description: "Hands-on workshop on RISC-V core customization, physical synthesis, and open-source EDA toolchains.",
        date: "2026-08-25",
        location: "Semiconductor Clean Room B",
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        status: "Upcoming",
    },
    {
        id: "evt_3",
        title: "ASL Summer Research Symposium",
        description: "Presentation of peer-reviewed student research papers, CAD prototypes, and structural stress benchmarks.",
        date: "2026-09-01",
        location: "Grand Conference Hall",
        category: "Symposium",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        status: "Upcoming",
    },
];

export async function GET() {
    return NextResponse.json(eventsList);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newEvent = {
            id: "evt_" + Date.now(),
            ...body,
        };
        eventsList.unshift(newEvent);
        return NextResponse.json(newEvent);
    } catch {
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
