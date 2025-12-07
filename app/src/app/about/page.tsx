import { Sparkles, Target, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <>
      <HeroSection />
      <MissionStatement />
      <Features />
      <HowItWorks />
      <TeamSection />
    </>
  );
}

const HeroSection = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-blue-700 mb-4">About Our Platform</h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        AI-Powered Job Description Analyser helps job seekers optimize their
        applications by extracting key insights from job postings and providing
        actionable recommendations.
      </p>
    </div>
  );
};

const MissionStatement = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h2 className="text-gray-800 mb-4">Our Mission</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We believe that finding the right job shouldn't be overwhelming. Every
        day, thousands of job seekers spend hours trying to tailor their resumes
        and cover letters to match specific job descriptions. Our mission is to
        simplify this process and give everyone access to intelligent tools that
        level the playing field.
      </p>
      <p className="text-gray-700 leading-relaxed">
        By leveraging cutting-edge AI technology, we help you understand what
        employers are really looking for and craft applications that stand out
        from the crowd.
      </p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI technology extracts key skills and insights from job descriptions in seconds.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Tailored Suggestions",
      description:
        "Get personalized resume tips and cover letter snippets that match the specific job requirements.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description:
        "No waiting around. Analyse job descriptions and receive actionable insights immediately.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy Focused",
      description:
        "Your data is processed securely. We don't store your job descriptions or personal information.",
    },
  ];
  return (
    <div className="mb-12">
      <h2 className="text-gray-800 mb-6 text-center">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const HowItWorksList = [
    {
      number: 1,
      heading: "Paste Job Description",
      description: "Copy and paste any job description into our analyser.",
    },
    {
      number: 2,
      heading: "AI Analysis",
      description:
        "Our AI processes the text to extract key skills, requirements, and insights.",
    },
    {
      number: 3,
      heading: "Get Results",
      description:
        "Receive extracted skills, resume tips, and a customized cover letter snippet.",
    },
    {
      number: 4,
      heading: "Apply With Confidence",
      description:
        "Use the insights to tailor your application and increase your chances of success.",
    },
  ];
  return (
    <div className="bg-linear-to-br from-blue-50 to-white rounded-xl shadow-md p-8 mb-8">
      <h2 className="text-gray-800 mb-6">How It Works</h2>
      <div className="space-y-6">
        {HowItWorksList.map((item) => (
          <div className="flex gap-4" key={item.number}>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {item.number}
            </div>
            <div>
              <h3 className="text-gray-800 mb-1">{item.heading}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <h2 className="text-gray-800 mb-4">Built for Job Seekers</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        We're a team of developers, designers, and career professionals
        passionate about making job hunting easier. This tool was born from our
        own frustrations with the application process and our desire to help
        others succeed.
      </p>
    </div>
  );
};
