"use client";

import { Button } from "@crm/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@crm/ui/components/field";
import { Input } from "@crm/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/lib/trpc/client";

export function InviteMember() {
	const trpc = useTRPC();
	const [link, setLink] = useState("");
	const invite = useMutation(
		trpc.workspace.invite.mutationOptions({
			onSuccess: (result) =>
				setLink(`${window.location.origin}/sign-in#invite=${result.token}`),
			onError: (error) => toast.error(error.message),
		}),
	);
	return (
		<form
			className="mb-6"
			onSubmit={(event) => {
				event.preventDefault();
				setLink("");
				invite.mutate({
					email: String(new FormData(event.currentTarget).get("email")).trim(),
				});
			}}
		>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="invite-email">Invite a teammate</FieldLabel>
					<Input
						id="invite-email"
						name="email"
						type="email"
						placeholder="teammate@example.com"
						required
					/>
				</Field>
				<Button type="submit" disabled={invite.isPending}>
					Create invitation link
				</Button>
				{link ? (
					<Field>
						<FieldLabel htmlFor="invite-link">
							Share this link with your teammate. It expires in seven days.
						</FieldLabel>
						<Input
							id="invite-link"
							value={link}
							readOnly
							onFocus={(event) => event.target.select()}
						/>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								navigator.clipboard
									.writeText(link)
									.then(() => toast.success("Invitation copied."))
									.catch(() => toast.error("Select and copy the link above."));
							}}
						>
							Copy invitation
						</Button>
					</Field>
				) : null}
			</FieldGroup>
		</form>
	);
}
