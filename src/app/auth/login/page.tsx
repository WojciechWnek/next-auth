import { CardWrapper } from "@/components/auth/CardWrapper";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage = () => {
	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial
		>
			<LoginForm />
		</CardWrapper>
	);
};

export default LoginPage;
