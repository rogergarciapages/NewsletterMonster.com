// src/app/components/login-modal.tsx
import { useEffect, useState } from "react";

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
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";
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
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginFormData.email,
        password: loginFormData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      if (data.session) {
        toast.success("Login successful!");
        onSuccess?.();
        onOpenChange();
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
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: signupFormData.email,
        password: signupFormData.password,
        options: {
          data: {
            name: `${signupFormData.name} ${signupFormData.surname}`.trim(),
            company_name: signupFormData.company_name,
          },
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create account");
      }

      toast.success("Account created successfully!");
      onSuccess?.();
      onOpenChange();
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
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/api/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast.error(`Failed to sign in with ${provider}.`);
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {showSignup ? "Create an Account" : "Sign In"}
            </ModalHeader>
            <ModalBody>
              {showSignup ? (
                <div className="flex flex-col gap-4">
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    name="name"
                    value={signupFormData.name}
                    onChange={handleSignupInputChange}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    name="surname"
                    value={signupFormData.surname}
                    onChange={handleSignupInputChange}
                  />
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={signupFormData.email}
                    onChange={handleSignupInputChange}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    name="password"
                    type="password"
                    value={signupFormData.password}
                    onChange={handleSignupInputChange}
                  />
                  <Input
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    name="verifyPassword"
                    type="password"
                    value={signupFormData.verifyPassword}
                    onChange={handleSignupInputChange}
                    onKeyDown={e => handleKeyPress(e, "signup")}
                  />
                  <Button color="primary" isLoading={isLoading} onPress={handleSignup}>
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={loginFormData.email}
                    onChange={handleLoginInputChange}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    name="password"
                    type="password"
                    value={loginFormData.password}
                    onChange={handleLoginInputChange}
                    onKeyDown={e => handleKeyPress(e, "login")}
                  />
                  <Button color="primary" isLoading={isLoading} onPress={handleLogin}>
                    Sign In
                  </Button>
                </div>
              )}

              <Divider className="my-4" />

              <div className="flex justify-center gap-2">
                <Button isIconOnly variant="flat" onPress={() => handleOAuthSignIn("google")}>
                  <IconBrandGoogle />
                </Button>
                <Button isIconOnly variant="flat" onPress={() => handleOAuthSignIn("github")}>
                  <IconBrandGithub />
                </Button>
                <Button isIconOnly variant="flat" onPress={() => handleOAuthSignIn("discord")}>
                  <IconBrandDiscord />
                </Button>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center">
              <p className="text-sm text-default-500">
                {showSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <Link
                  className="cursor-pointer"
                  size="sm"
                  onPress={() => handleSwitchMode(!showSignup)}
                >
                  {showSignup ? "Sign In" : "Sign Up"}
                </Link>
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
