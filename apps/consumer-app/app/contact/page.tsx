import ContactInfo from "./contact-info";

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
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Get In Touch</h1>
      <p className="text-gray-700 text-lg">
        Have questions, feedback, or suggestions? We'd love to hear from you.
        Reach out through our social channels.
      </p>
    </div>
  );
};

// ContactInfo moved to a client component in ./contact-info

const FaqSection = () => {
  const faqList = [
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqList.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
