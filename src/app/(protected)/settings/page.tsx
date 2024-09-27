import React from "react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SettingsPage = async () => {
	const session = await auth();

	return (
		<div>
			SettingsPage
			<div>Session: {JSON.stringify(session)}</div>
			<form
				action={async () => {
					"use server";

					await signOut({ redirectTo: "/auth/login" });
				}}
			>
				<Button type="submit">sign out</Button>
			</form>
		</div>
	);
};

export default SettingsPage;
