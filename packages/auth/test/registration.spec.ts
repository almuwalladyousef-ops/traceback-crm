import { afterAll, expect, test } from "bun:test";
import { db } from "@crm/db";
import {
	consumeRegistrationInvite,
	createRegistrationInvite,
} from "../src/registration";

const email = `invite-${crypto.randomUUID()}@traceback.example`;

afterAll(async () => {
	await db.verification.deleteMany({ where: { value: email } });
	await db.$disconnect();
});

test("registration requires an invitation, not just an email address", async () => {
	expect(await consumeRegistrationInvite(db, email, null)).toBe(false);
	expect(await consumeRegistrationInvite(db, email, "invalid")).toBe(false);
});

test("an invitation is bound to its recipient and cannot be reused", async () => {
	const { token } = await createRegistrationInvite(db, email);
	expect(
		await consumeRegistrationInvite(db, "stranger@traceback.example", token),
	).toBe(false);
	expect(await consumeRegistrationInvite(db, email.toUpperCase(), token)).toBe(
		true,
	);
	expect(await consumeRegistrationInvite(db, email, token)).toBe(false);
});

test("expired invitations do not grant access", async () => {
	const { token } = await createRegistrationInvite(db, email);
	await db.verification.updateMany({
		where: { value: email },
		data: { expiresAt: new Date(0) },
	});
	expect(await consumeRegistrationInvite(db, email, token)).toBe(false);
});

test("concurrent redemption grants access once", async () => {
	const { token } = await createRegistrationInvite(db, email);
	const attempts = await Promise.all(
		Array.from({ length: 4 }, () =>
			consumeRegistrationInvite(db, email, token),
		),
	);
	expect(attempts.filter(Boolean)).toHaveLength(1);
});
