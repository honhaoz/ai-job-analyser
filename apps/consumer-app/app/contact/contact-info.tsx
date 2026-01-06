"use client";
import type React from "react";
import { Mail, Github, Linkedin, AtSign, Dot } from "lucide-react";

const ContactInfo = () => {
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const user = "honghao";
    const domain = "workmail.com";
    window.location.href = `mailto:${user}@${domain}`;
  };

  const contactList = [
    {
      method: "Email Us",
      description: "For general inquiries and support",
      icon: <Mail className="w-6 h-6" aria-hidden="true" />,
      detail: <>example@gmail.com</>,
      href: "#",
      isEmail: true,
    },
    {
      method: "GitHub",
      description: "Contribute to our open source project",
      icon: <Github className="w-6 h-6" aria-hidden="true" />,
      detail: "github.com/honhaoz",
      href: "https://github.com/honhaoz",
      isEmail: false,
    },
    {
      method: "LinkedIn",
      description: "Connect with us professionally",
      icon: <Linkedin className="w-6 h-6" aria-hidden="true" />,
      detail: "linkedin.com/in/honghaoz",
      href: "https://linkedin.com/in/honghaoz",
      isEmail: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      {contactList.map((contact) => (
        <div key={contact.method} className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-blue-700 mb-4">
            {contact.icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {contact.method}
          </h3>
          <p className="text-gray-700 mb-2">{contact.description}</p>
          {contact.detail && (
            <a
              href={contact.href}
              onClick={contact.isEmail ? handleEmailClick : undefined}
              className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
              target={contact.isEmail ? undefined : "_blank"}
              rel={contact.isEmail ? undefined : "noopener noreferrer"}
              aria-label={
                contact.isEmail
                  ? "Email us"
                  : `Visit our ${contact.method} (opens in new window)`
              }
            >
              {contact.detail}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
