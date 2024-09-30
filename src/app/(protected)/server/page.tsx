import React from "react";
import { currentUser } from "@/lib/auth";
import { UserInfo } from "@/components/user-info";

const ServerPage = async () => {
	const user = await currentUser();

	console.log(user);

	return (
		<div>
			<UserInfo user={user} label={"Server component"} />
		</div>
	);
};

export default ServerPage;
