export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Help</h1>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Getting Started</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Welcome to the platform! Here's everything you need to know to manage your account and settings.
          </p>

          {/* Account Settings Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Settings</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Manage your account preferences, security settings, and personal information. The Settings section includes:
            </p>
            <div className="ml-4 space-y-3 text-gray-600">
              <p className="leading-relaxed">
                <span className="font-medium text-gray-700">User Profile:</span> Update your personal details, contact information, and profile picture. Keep your information current to ensure smooth communication.
              </p>
              <p className="leading-relaxed">
                <span className="font-medium text-gray-700">Change Password:</span> Regularly update your password to keep your account secure. Choose a strong password with a mix of letters, numbers, and symbols.
              </p>
              <p className="leading-relaxed">
                <span className="font-medium text-gray-700">Notifications:</span> Customize how and when you receive notifications. Control email alerts, push notifications, and communication preferences.
              </p>
              <p className="leading-relaxed">
                <span className="font-medium text-gray-700">Security & Privacy:</span> Manage your privacy settings, two-factor authentication, active sessions, and view recent account activity.
              </p>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback</h3>
            <p className="text-gray-600 leading-relaxed">
              Share your thoughts, report issues, or suggest improvements. Your feedback helps us enhance the platform and provide better service. We review all feedback and typically respond within 24-48 hours.
            </p>
          </div>

          {/* Help Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Assistance?</h3>
            <p className="text-gray-600 leading-relaxed">
              If you have questions or need support, use the Feedback section to contact our team. For urgent matters, please mark your message as high priority.
            </p>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for Best Experience</h3>
            <div className="space-y-2 text-gray-600">
              <p className="leading-relaxed">Keep your contact information up to date to receive important notifications.</p>
              <p className="leading-relaxed">Enable two-factor authentication in Security & Privacy for added account protection.</p>
              <p className="leading-relaxed">Use a strong, unique password and change it regularly.</p>
              <p className="leading-relaxed">Review your notification settings to stay informed without being overwhelmed.</p>
              <p className="leading-relaxed">Check your profile information periodically to ensure accuracy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}