import { NextResponse } from "next/server";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        return NextResponse.json({ success: true, id });
    } catch {
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
