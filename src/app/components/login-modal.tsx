// src/app/components/login-modal.tsx
import { useState } from "react";

import {
  Button,
  Checkbox,
  Divider,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from "@nextui-org/react";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { getPasswordStrength, validateEmail, validatePassword } from "@/lib/validation";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    surname: "",
    company_name: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupFormData(prev => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    formType: "login" | "signup"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (formType === "login") {
        void handleLogin();
      } else {
        void handleSignup();
      }
    }
  };

  const handleLogin = async () => {
    if (!loginFormData.email || !loginFormData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (!validateEmail(loginFormData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: loginFormData.email,
        password: loginFormData.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      if (result?.ok) {
        toast.success("Login successful!");
        onSuccess?.();
        onOpenChange();

        // No longer redirecting to onboarding - just refresh the page if needed
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupFormData.name || !signupFormData.email || !signupFormData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!validateEmail(signupFormData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!validatePassword(signupFormData.password)) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (signupFormData.password !== signupFormData.verifyPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: signupFormData.name,
          surname: signupFormData.surname,
          company_name: signupFormData.company_name,
          email: signupFormData.email,
          password: signupFormData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Auto-login after successful signup
      const loginResult = await signIn("credentials", {
        email: signupFormData.email,
        password: signupFormData.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.error("Account created but login failed. Please try logging in.");
        setShowSignup(false);
        return;
      }

      toast.success("Account created and logged in successfully!");
      onSuccess?.();
      onOpenChange();

      // No longer redirecting to onboarding - just refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setIsLoading(true);
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast.error(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  const handleSwitchMode = (toSignup: boolean) => {
    setShowSignup(toSignup);
    setLoginFormData({ email: "", password: "" });
    setSignupFormData({
      name: "",
      surname: "",
      company_name: "",
      email: "",
      password: "",
      verifyPassword: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      classNames={{
        base: "max-w-md",
      }}
    >
      <ModalContent>
        {() => (
          <>
            {!showSignup ? (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-2xl">Log in</h2>
                  <p className="text-sm text-default-500">Welcome back!</p>
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    endContent={
                      <IconMail className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    name="email"
                    value={loginFormData.email}
                    onChange={handleLoginInputChange}
                    onKeyPress={e => handleKeyPress(e, "login")}
                  />
                  <Input
                    endContent={
                      <IconLock className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginInputChange}
                    onKeyPress={e => handleKeyPress(e, "login")}
                  />
                  <div className="flex justify-between px-1 py-2">
                    <Checkbox
                      isSelected={rememberMe}
                      onValueChange={setRememberMe}
                      classNames={{
                        label: "text-small",
                      }}
                    >
                      Remember me
                    </Checkbox>
                    <Link color="primary" href="#" size="sm" onClick={() => handleSwitchMode(true)}>
                      Create account
                    </Link>
                  </div>
                </ModalBody>
                <ModalFooter className="flex-col">
                  <Button
                    color="warning"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Sign in
                  </Button>
                  <Divider className="my-4" />
                  <Button
                    onClick={() => handleOAuthSignIn("google")}
                    startContent={<IconBrandGoogle />}
                    className="w-full bg-torch-800 text-white"
                    isLoading={isLoading}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    onClick={() => handleOAuthSignIn("github")}
                    startContent={<IconBrandGithub />}
                    className="mt-2 w-full bg-[#4078c0] text-white"
                    isLoading={isLoading}
                  >
                    Continue with GitHub
                  </Button>
                  <Button
                    onClick={() => handleOAuthSignIn("discord")}
                    startContent={<IconBrandDiscord />}
                    className="mt-2 w-full bg-[#5865F2] text-white"
                    isLoading={isLoading}
                  >
                    Continue with Discord
                  </Button>
                  <Button
                    onClick={() => handleOAuthSignIn("linkedin")}
                    startContent={<IconBrandLinkedin />}
                    className="mt-2 w-full bg-[#0A66C2] text-white"
                    isLoading={isLoading}
                  >
                    Continue with LinkedIn
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-2xl">Create account</h2>
                  <p className="text-sm text-default-500">Get started with your account</p>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                      variant="bordered"
                      name="name"
                      value={signupFormData.name}
                      onChange={handleSignupInputChange}
                      isRequired
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                      variant="bordered"
                      name="surname"
                      value={signupFormData.surname}
                      onChange={handleSignupInputChange}
                    />
                  </div>
                  <Input
                    label="Company Name"
                    placeholder="Enter your company name (optional)"
                    variant="bordered"
                    name="company_name"
                    value={signupFormData.company_name}
                    onChange={handleSignupInputChange}
                  />
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    name="email"
                    value={signupFormData.email}
                    onChange={handleSignupInputChange}
                    isRequired
                  />
                  <Input
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    variant="bordered"
                    name="password"
                    value={signupFormData.password}
                    onChange={handleSignupInputChange}
                    isRequired
                  />
                  {signupFormData.password && (
                    <div className="w-full">
                      <Progress
                        value={passwordStrength.score * 20}
                        className="w-full"
                        color={
                          passwordStrength.score < 2
                            ? "danger"
                            : passwordStrength.score < 4
                              ? "warning"
                              : "success"
                        }
                      />
                      <p className="mt-1 text-sm text-default-500">{passwordStrength.feedback}</p>
                    </div>
                  )}
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    variant="bordered"
                    name="verifyPassword"
                    value={signupFormData.verifyPassword}
                    onChange={handleSignupInputChange}
                    isRequired
                  />
                </ModalBody>
                <ModalFooter className="flex-col">
                  <Button
                    color="warning"
                    onPress={handleSignup}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Create account
                  </Button>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => handleSwitchMode(false)}
                    className="mt-2 w-full"
                  >
                    Back to login
                  </Button>
                  <div className="mt-4 text-center text-small text-default-500">
                    <p>
                      By clicking "Create account", you agree to our{" "}
                      <Link href="#" size="sm">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" size="sm">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
