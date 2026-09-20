import Navbar from "@/components/layout/Navbar";
import ModernLoginSignup from "@/components/ui/modern-login-signup";

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <ModernLoginSignup mode="signup" />
    </>
  );
}
