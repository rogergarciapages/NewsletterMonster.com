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
} from "@nextui-org/react";
import { IconBrandDiscord, IconBrandGithub, IconBrandGoogle, IconBrandLinkedin, IconLock, IconMail } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GdprIcon from "./app-navbar/svg/Gdpr.svg";
  
  interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
  }
  
  const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onOpenChange }) => {
    const [showSignup, setShowSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginFormData, setLoginFormData] = useState({ email: "", password: "" });
    const [signupFormData, setSignupFormData] = useState({
      name: "",
      surname: "",
      company_name: "",
      email: "",
      password: "",
      verifyPassword: "",
    });
  
    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginFormData({ ...loginFormData, [name]: value });
    };
  
    const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSignupFormData({ ...signupFormData, [name]: value });
    };
  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, formType: "login" | "signup") => {
      if (e.key === "Enter") {
        if (formType === "login") {
          handleLogin();
        } else {
          handleSignup();
        }
      }
    };
  
    const handleLogin = async () => {
      setIsLoading(true);
      try {
        await signIn("email", { email: loginFormData.email, callbackUrl: "/" });
        toast.success("Login successful!");
        setIsLoading(false);
        onOpenChange(); // Close modal on success
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
      }
    };
  
    const handleSignup = async () => {
      if (signupFormData.password !== signupFormData.verifyPassword) {
        toast.error("Passwords do not match");
        return;
      }
  
      setIsLoading(true);
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupFormData),
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          toast.error(`Signup failed: ${errorText}`);
          setIsLoading(false);
          return;
        }
  
        toast.success("Signup successful!");
        setShowSignup(false);
        setSignupFormData({ name: "", surname: "", company_name: "", email: "", password: "", verifyPassword: "" });
        setIsLoading(false);
        onOpenChange(); // Close modal on success
      } catch (error) {
        console.error("An error occurred during signup:", error);
        toast.error("An error occurred during signup. Please try again.");
        setIsLoading(false);
      }
    };
  
    const handleSwitchMode = (toSignup: boolean) => {
      setShowSignup(toSignup);
      setLoginFormData({ email: "", password: "" });
      setSignupFormData({ name: "", surname: "", company_name: "", email: "", password: "", verifyPassword: "" });
    };
  
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                {!showSignup ? (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-2xl pb-0">Log in now</ModalHeader>
                    <ModalBody className="pt-0">
                      <p className="text-base muted text-[#a7a6a6] pb-4">yeah, you know what to do...</p>
                      <Input
                        autoFocus
                        endContent={<IconMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                        onChange={handleLoginInputChange}
                        name="email"
                        value={loginFormData.email}
                        onKeyPress={(e) => handleKeyPress(e, "login")}
                      />
                      <Input
                        endContent={<IconLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                        onChange={handleLoginInputChange}
                        name="password"
                        value={loginFormData.password}
                        onKeyPress={(e) => handleKeyPress(e, "login")}
                      />
                      <div className="flex py-2 px-1 justify-between">
                        <Checkbox classNames={{ label: "text-small" }}>Remember me</Checkbox>
                        <Link color="primary" href="#" size="sm" onClick={() => handleSwitchMode(true)}>
                          Create Account
                        </Link>
                      </div>
                    </ModalBody>
                    <ModalFooter className="flex-col">
                      <Button color="warning" onPress={handleLogin} isLoading={isLoading}>
                        Sign in
                      </Button>
                      <Button color="default" variant="solid" onPress={onClose}>
                        Close
                      </Button>
                      <Divider className="my-4" />
                      <Button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        color="danger"
                        variant="solid"
                        fullWidth
                        style={{ marginTop: "2px", backgroundColor: "#b10329" }}
                      >
                        <IconBrandGoogle />
                        Sign In with Google
                      </Button>
                      <Button
                        onClick={() => signIn("linkedin", { callbackUrl: "/" })}
                        color="danger"
                        variant="solid"
                        fullWidth
                        style={{ marginTop: "5px", backgroundColor: "#2e485c" }}
                      >
                        <IconBrandLinkedin />
                        Sign In with LinkedIn
                      </Button>
                      <Button
                        onClick={() => signIn("discord", { callbackUrl: "/" })}
                        color="danger"
                        variant="solid"
                        fullWidth
                        style={{ marginTop: "5px", backgroundColor: "#351d49" }}
                      >
                        <IconBrandDiscord />
                        Sign In with Discord
                      </Button>
                      <Button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        color="danger"
                        variant="solid"
                        fullWidth
                        style={{ marginTop: "5px", backgroundColor: "#3869a8" }}
                      >
                        <IconBrandGithub />
                        Sign In with Github
                      </Button>
                      <div className="w-full flex-auto">
                        <p className="text-sm muted">
                          By creating an account, you agree to our Terms and have read and acknowledge the Global Privacy
                          Statement. Invisible reCAPTCHA by Google Privacy Policy and Terms of Use. NewsletterMonster is GDPR
                          compliant. Learn more about how you can use NewsletterMonster in a GDPR compliant way.
                        </p>
                        <div className="mt-2 flex justify-start">
                          <GdprIcon className="w-32" />
                        </div>
                      </div>
                    </ModalFooter>
                  </>
                ) : (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-2xl pb-0">Sign up now</ModalHeader>
                    <ModalBody className="pt-0">
                      <Input
                        name="name"
                        label="Name"
                        placeholder="Enter your name"
                        variant="bordered"
                        value={signupFormData.name}
                        onChange={handleSignupInputChange}
                        onKeyPress={(e) => handleKeyPress(e, "signup")}
                      />
                      <Input
                        name="surname"
                        label="Surname"
                        placeholder="Enter your surname"
                        variant="bordered"
                        value={signupFormData.surname}
                        onChange={handleSignupInputChange}
                        onKeyPress={(e) => handleKeyPress(e, "signup")}
                      />
                      <Input
                        name="company_name"
                        label="Company Name"
                        placeholder="Enter your company name"
                        variant="bordered"
                        value={signupFormData.company_name}
                        onChange={handleSignupInputChange}
                        onKeyPress={(e) => handleKeyPress(e, "signup")}
                      />
                      <Input
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                        value={signupFormData.email}
                        onChange={handleSignupInputChange}
                        onKeyPress={(e) => handleKeyPress(e, "signup")}
                      />
                      <Input
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                        value={signupFormData.password}
                        onChange={handleSignupInputChange}
                        onKeyPress={(e) => handleKeyPress(e, "signup")}
                      />
                      <Input
                        name="verifyPassword"
                        label="Verify Password"
                        placeholder="Verify your password"
                        type="password"
                        variant="bordered"
                        value={signupFormData.verifyPassword}
                        onChange={handleSignupInputChange}
                        onKeyPress={(e) => handleKeyPress(e, "signup")}
                      />
                    </ModalBody>
                    <ModalFooter className="flex-col">
                      <Button color="warning" onPress={handleSignup} isLoading={isLoading}>
                        Sign up
                      </Button>
                      <Button color="danger" variant="flat" onPress={() => handleSwitchMode(false)}>
                        Back to Login
                      </Button>
                      <div className="w-full flex-auto">
                        <p className="text-sm muted">
                          By creating an account, you agree to our Terms and have read and acknowledge the Global Privacy
                          Statement. Invisible reCAPTCHA by Google Privacy Policy and Terms of Use. NewsletterMonster is GDPR
                          compliant. Learn more about how you can use NewsletterMonster in a GDPR compliant way.
                        </p>
                        <div className="mt-2 flex justify-start">
                          <GdprIcon className="w-32" />
                        </div>
                      </div>
                    </ModalFooter>
                  </>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
        <ToastContainer />
      </>
    );
  };
  
  export default LoginModal;
  