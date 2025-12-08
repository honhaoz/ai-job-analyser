"use client";
import {
  Mail,
  Github,
  Linkedin,
  MessageCircle,
  AtSign,
  Dot,
} from "lucide-react";

export default function Contact() {
  return (
    <>
      <HeroSection />
      <ContactInfo />
      <FaqSection />
    </>
  );
}

const HeroSection = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-blue-700 mb-4">Get In Touch</h1>
      <p className="text-gray-600 text-lg">
        Have questions, feedback, or suggestions? We'd love to hear from you.
        Reach out through our social channels.
      </p>
    </div>
  );
};

const ContactInfo = () => {
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const user = "honghao";
    const domain = "workmail.com";
    window.location.href = `mailto:${user}@${domain}`;
  };

  const contactLists = [
    {
      method: "Email Us",
      description: "For general inquiries and support",
      icon: <Mail className="w-6 h-6" />,
      detail: (
        <>
          honghao
          <AtSign className="w-3 h-3 inline mx-0.5" />
          workmail
          <Dot className="w-3 h-3 inline" />
          com
        </>
      ),
      href: "#",
      isEmail: true,
    },
    {
      method: "GitHub",
      description: "Contribute to our open source project",
      icon: <Github className="w-6 h-6" />,
      detail: "github.com/honhaoz",
      href: "https://github.com/honhaoz",
      isEmail: false,
    },
    {
      method: "LinkedIn",
      description: "Connect with us professionally",
      icon: <Linkedin className="w-6 h-6" />,
      detail: "linkedin.com/in/honghaoz",
      href: "https://linkedin.com/in/honghaoz",
      isEmail: false,
    },
    {
      method: "Feedback",
      description:
        "Your feedback helps us improve. Let us know what features you'd like to see!",
      icon: <MessageCircle className="w-6 h-6" />,
      detail: "",
      href: "",
      isEmail: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {contactLists.map((contact) => (
        <div key={contact.method} className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-blue-700 mb-4">
            {contact.icon}
          </div>
          <h3 className="text-gray-800 mb-2">{contact.method}</h3>
          <p className="text-gray-600 mb-2">{contact.description}</p>
          {contact.detail && (
            <a
              href={contact.href}
              onClick={contact.isEmail ? handleEmailClick : undefined}
              className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
              target={contact.isEmail ? undefined : "_blank"}
            >
              {contact.detail}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const FaqSection = () => {
  const FaqList = [
    {
      question: "Is the service free?",
      answer:
        "Yes, our basic analyser is completely free to use. We believe in making job search tools accessible to everyone.",
    },
    {
      question: "Do you store my data?",
      answer:
        "No, we don't store job descriptions or personal information. Your privacy and data security are our top priorities.",
    },
    {
      question: "How accurate is the AI?",
      answer:
        "Our AI is highly accurate and continuously improving, but we always recommend reviewing and customising the results to match your personal experience and style.",
    },
    {
      question: "Can I suggest new features?",
      answer:
        "Absolutely! We'd love to hear your ideas. Reach out to us via email or GitHub with your suggestions.",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-gray-800 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {FaqList.map((faq, index) => (
          <div key={index}>
            <h3 className="text-gray-800 mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
