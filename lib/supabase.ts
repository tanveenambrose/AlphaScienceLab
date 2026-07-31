// Supabase REST API client — no npm package needed

function getUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getAnonKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function getServiceKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

// ── Browser auth ──────────────────────────────────────────

export async function signInWithPassword(email: string, password: string) {
    const res = await fetch(`${getUrl()}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: getAnonKey(),
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error_description || err.msg || "Invalid credentials");
    }

    return res.json() as Promise<{
        access_token: string;
        refresh_token: string;
        user: { id: string; email: string };
    }>;
}

export async function getUser(accessToken: string) {
    const res = await fetch(`${getUrl()}/auth/v1/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: getAnonKey(),
        },
    });

    if (!res.ok) return null;
    return res.json() as Promise<{ id: string; email: string } | null>;
}

export async function refreshSession(refreshToken: string) {
    const res = await fetch(`${getUrl()}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: getAnonKey(),
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return null;
    return res.json() as Promise<{
        access_token: string;
        refresh_token: string;
        user: { id: string; email: string };
    }>;
}

export async function signOut(refreshToken: string) {
    await fetch(`${getUrl()}/auth/v1/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
            apikey: getAnonKey(),
        },
    });
}

export async function adminCreateUser(email: string, password?: string, name?: string) {
    const res = await fetch(`${getUrl()}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getServiceKey()}`,
            apikey: getServiceKey(),
        },
        body: JSON.stringify({
            email,
            password,
            email_confirm: true,
            user_metadata: { name },
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create user: ${res.status}`);
    }

    return res.json();
}

// ── Data (server-side with service role) ──────────────────

async function request(
    method: string,
    table: string,
    options?: {
        body?: unknown;
        query?: string;
        accessToken?: string;
    }
) {
    const url = `${getUrl()}/rest/v1/${table}${options?.query ? `?${options.query}` : ""}`;
    const key = options?.accessToken ? getAnonKey() : getServiceKey();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: key,
        Prefer: "return=representation",
    };

    if (options?.accessToken) {
        headers["Authorization"] = `Bearer ${options.accessToken}`;
    } else {
        headers["Authorization"] = `Bearer ${getServiceKey()}`;
    }

    const res = await fetch(url, {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${res.status}`);
    }

    if (method === "DELETE") return null;
    return res.json();
}

export const db = {
    getAll: (table: string, accessToken?: string) =>
        request("GET", table, {
            query: "order=created_at.desc",
            accessToken,
        }),

    getById: (table: string, id: string, accessToken?: string) =>
        request("GET", table, {
            query: `id=eq.${id}&select=*`,
            accessToken,
        }).then((r) => (Array.isArray(r) ? r[0] : r)),

    insert: (table: string, data: Record<string, unknown>, accessToken?: string) =>
        request("POST", table, { body: data, accessToken }).then((r) =>
            Array.isArray(r) ? r[0] : r
        ),

    update: (table: string, id: string, data: Record<string, unknown>, accessToken?: string) =>
        request("PATCH", table, {
            query: `id=eq.${id}`,
            body: data,
            accessToken,
        }),

    delete: (table: string, id: string, accessToken?: string) =>
        request("DELETE", table, { query: `id=eq.${id}`, accessToken }),

    count: async (table: string, accessToken?: string): Promise<number> => {
        const url = `${getUrl()}/rest/v1/${table}?select=id&limit=0`;
        const key = accessToken ? getAnonKey() : getServiceKey();
        const headers: Record<string, string> = {
            apikey: key,
            Authorization: `Bearer ${accessToken || getServiceKey()}`,
            Prefer: "count=exact",
        };

        const res = await fetch(url, { headers });
        return parseInt(res.headers.get("content-range")?.split("/")[1] || "0", 10);
    },
};

// ── Storage ────────────────────────────────────────────────

export async function uploadFile(
    file: ArrayBuffer,
    filename: string,
    contentType: string,
    bucket: string,
    accessToken: string
) {
    const url = `${getUrl()}/storage/v1/object/${bucket}/${filename}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: getAnonKey(),
            "Content-Type": contentType,
        },
        body: file,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
    }

    return `${getUrl()}/storage/v1/object/public/${bucket}/${filename}`;
}
