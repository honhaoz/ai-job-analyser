import { Warning } from "@/components/warning";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
      <h2 className="text-gray-800 mb-6">Privacy Policy</h2>
      <div className="space-y-6 text-gray-700">
        <PolicySection title="Overview">
          <p>
            This AI-Powered Job Description Analyser is designed to help you
            analyse job descriptions and improve your application materials. We
            are committed to protecting your privacy and ensuring your data
            remains secure.
          </p>
          <p className="mt-3">
            <strong>Important:</strong> This application integrates with
            OpenAI's API service to provide AI-powered analysis. When you submit
            a job description for analysis, the text is sent to OpenAI's servers
            for processing.
          </p>
        </PolicySection>

        <PolicySection title="Data Collection and Usage">
          <p className="mb-3">
            <strong>Data Processing:</strong> When you use the analysis feature,
            the job description text you provide is sent to OpenAI's API for
            processing. OpenAI processes this data according to their privacy
            policy and data usage policies. As a protective measure, we apply
            basic automated filtering to reduce the likelihood of personal or
            sensitive information being sent to the AI service. This filtering
            is not guaranteed to detect all personal data.
          </p>
          <p className="mb-3">
            <strong>No Long-Term Storage:</strong> We do not store your job
            descriptions or analysis results on our servers. However, data sent
            to OpenAI is subject to their data retention policies. Please review{" "}
            <a
              href="https://openai.com/policies/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              OpenAI's Privacy Policy
            </a>{" "}
            for more information.
          </p>
          <p className="mb-3">
            <strong>API Usage:</strong> OpenAI processes API inputs according to
            its API data usage policies. Depending on configuration and account
            settings, API data may be retained temporarily for abuse and misuse
            monitoring. We do not control OpenAI’s internal data handling
            practices.
          </p>
          <p>
            <strong>No Tracking:</strong> We do not use analytics or tracking
            technologies. If any cookies are present, they are strictly
            necessary for basic functionality.
          </p>
        </PolicySection>

        <PolicySection title="User Responsibility">
          <Warning
            message={
              <p className="text-amber-800">
                <strong>Important:</strong> Do not input any personal or
                sensitive information into this application, including but not
                limited to:
              </p>
            }
          />

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>National Insurance numbers or other government IDs</li>
            <li>
              Personal contact information (phone numbers, personal email
              addresses)
            </li>
            <li>Financial information (bank accounts, credit card numbers)</li>
            <li>Health or medical information</li>
            <li>Passwords or security credentials</li>
            <li>Any other personally identifiable information (PII)</li>
          </ul>

          <p className="mt-4">
            This tool is intended for analysing publicly posted job descriptions
            only. Use discretion when inputting any information.
          </p>
        </PolicySection>

        <PolicySection title="Third-Party Services">
          <p className="mb-3">
            This application integrates with OpenAI's API service to provide
            AI-powered analysis. When you submit a job description for analysis,
            the text is transmitted to OpenAI's servers for processing.
          </p>
          <p className="mb-3">
            <strong>OpenAI's Data Usage:</strong> OpenAI processes API inputs in
            accordance with its published API data usage policies, which may
            include limited retention for abuse monitoring depending on account
            configuration You can learn more about OpenAI's data usage policies
            and opt-out options at{" "}
            <a
              href="https://openai.com/policies/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              openai.com/policies/privacy-policy
            </a>
          </p>
          <p>
            <strong>Data Transmission:</strong> All data transmitted to OpenAI
            is sent over secure, encrypted connections. However, once data
            reaches OpenAI's servers, it is subject to their security practices
            and policies.
          </p>
        </PolicySection>

        <PolicySection title="Data Security">
          <p>Whilst we do not collect or store your data, we recommend:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Using this application in a secure, private environment</li>
            <li>Not sharing your screen whilst using sensitive information</li>
            <li>Clearing your browser cache if you're on a shared computer</li>
          </ul>
        </PolicySection>

        <PolicySection title="Intended Use">
          <p>This application is intended for:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Analysing job descriptions from public job postings</li>
            <li>Extracting skills and requirements</li>
            <li>Generating suggestions for CV improvement</li>
            <li>Creating draft cover letter content</li>
          </ul>
          <p className="mt-4">
            This tool is <strong>NOT</strong> intended for collecting,
            processing, or storing personally identifiable information or
            sensitive data.
          </p>
        </PolicySection>

        <PolicySection title="Disclaimer">
          <p>
            In development or demonstration environments, mock data may be used.
            In production, analysis is performed using an AI model. Results
            should always be reviewed and customised before use.
          </p>
        </PolicySection>

        <PolicySection title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page. Your continued use of the
            application constitutes acceptance of any changes.
          </p>
        </PolicySection>

        <PolicySection title="Contact">
          <p>
            If you have questions or concerns about this Privacy Policy, please
            visit our Contact page for ways to reach us.
          </p>
        </PolicySection>
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Last updated: 16 December 2025</p>
        </div>
      </div>
    </div>
  );
}

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
};
