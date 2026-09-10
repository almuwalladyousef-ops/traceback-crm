import "@crm/env/load";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { db } from "@crm/db";
import { createRegistrationInvite } from "../src/registration";

const directory = resolve(import.meta.dirname, "../../../.scratch");
const { token, expiresAt } = await createRegistrationInvite(db, null);
const origin = process.env.APP_URL?.split(",")[0] || "http://localhost:3000";
const link = `${origin}/sign-in#invite=${token}`;
await mkdir(directory, { recursive: true });
await writeFile(
	resolve(directory, "owner-invite.txt"),
	`${link}\nExpires: ${expiresAt}\n`,
	{ mode: 0o600 },
);
console.log(
	"Owner invitation saved to .scratch/owner-invite.txt. Open it and choose Create an account.",
);
await db.$disconnect();
