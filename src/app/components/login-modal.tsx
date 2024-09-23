import {
    Button,
    Checkbox,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import { IconLock, IconMail } from "@tabler/icons-react";
import React from "react";

import GdprIcon from "./app-navbar/svg/Gdpr.svg";


interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onOpenChange }) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 text-2xl pb-0">Log in now</ModalHeader>
          <ModalBody className="pt-0">
          <p className="text-base muted text-[#a7a6a6] pb-4"> yeah, you know what to do...</p>

            <Input
              autoFocus
              endContent={<IconMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
            />
            <Input
              endContent={<IconLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
            />
            <div className="flex py-2 px-1 justify-between">
              <Checkbox classNames={{ label: "text-small" }}>Remember me</Checkbox>
              <Link color="primary" href="#" size="sm">Create Account</Link>
            </div>
          </ModalBody>
          <ModalFooter className="flex-col">
          <Button color="warning" onPress={onClose}>Sign in</Button>   
            <Button color="danger" variant="flat" onPress={onClose}>Close</Button>
 
            <div className="w-full flex-auto">
            <p className="text-sm muted">By creating an account, you agree to our Terms and have read and acknowledge the Global Privacy Statement. Invisible reCAPTCHA by Google Privacy Policy and Terms of Use. NewsletterMonster is GDPR compliant. Learn more about how you can use NewsletterMonster in a GDPR compliant way.</p>
            <div className="mt-2 flex justify-start">
                <GdprIcon className="w-32"/>
              </div>
            </div>
          </ModalFooter>
        </>
      )}
    </ModalContent>

  </Modal>
);

export default LoginModal;
