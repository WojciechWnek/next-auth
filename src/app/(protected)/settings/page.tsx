import React from "react";
import { auth } from "@/auth";

const SettingsPage = async () => {
	const session = await auth();

	return (
		<div>
			SettingsPage
			<div>Session: {JSON.stringify(session)}</div>
		</div>
	);
};

export default SettingsPage;
