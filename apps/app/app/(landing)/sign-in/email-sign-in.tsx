"use client";

import { authClient } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@crm/ui/components/field";
import { Input } from "@crm/ui/components/input";
import { useState } from "react";

export function EmailSignIn() {
	const [joining, setJoining] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	return (
		<form
			onSubmit={async (event) => {
				event.preventDefault();
				setPending(true);
				setError("");
				const form = new FormData(event.currentTarget);
				const credentials = {
					email: String(form.get("email")),
					password: String(form.get("password")),
				};
				try {
					const token = new URLSearchParams(window.location.hash.slice(1)).get(
						"invite",
					);
					const result = joining
						? await authClient.signUp.email(
								{ ...credentials, name: String(form.get("name")) },
								{ headers: { "x-traceback-invite": token ?? "" } },
							)
						: await authClient.signIn.email(credentials);
					if (result.error)
						setError(
							result.error.message ?? "Sign-in failed. Please try again.",
						);
					else window.location.assign("/");
				} catch {
					setError("Cannot reach the sign-in service. Please try again.");
				} finally {
					setPending(false);
				}
			}}
		>
			<FieldGroup>
				{joining ? (
					<Field>
						<FieldLabel htmlFor="name">Your name</FieldLabel>
						<Input id="name" name="name" autoComplete="name" required />
					</Field>
				) : null}
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete={joining ? "new-password" : "current-password"}
						minLength={joining ? 12 : undefined}
						required
					/>
				</Field>
				{error ? (
					<p role="alert" className="text-destructive text-sm">
						{error}
					</p>
				) : null}
				<Button type="submit" disabled={pending}>
					{pending
						? "Please wait…"
						: joining
							? "Create your account"
							: "Sign in"}
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={() => {
						setJoining(!joining);
						setError("");
					}}
				>
					{joining
						? "Already have an account? Sign in"
						: "Have an invitation? Create an account"}
				</Button>
			</FieldGroup>
		</form>
	);
}
