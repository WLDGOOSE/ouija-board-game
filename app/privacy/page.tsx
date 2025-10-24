'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <header className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-amber-500">Privacy Policy</h1>
          <Link href="/" className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-md transition-colors">
            Return Home
          </Link>
        </div>
      </header>
      
      <main className="w-full max-w-4xl space-y-8">
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Introduction</h2>
          <p className="mb-4">
            This Privacy Policy explains how we collect, use, and protect your information when you use our Ouija Board Experience website.
          </p>
          <p>
            By using our website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Information We Collect</h2>
          <p className="mb-4">
            <strong>Personal Information:</strong> We may collect temporary usernames you create when using our service.
          </p>
          <p className="mb-4">
            <strong>Usage Data:</strong> We collect information on how you interact with our website, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Messages sent through the Ouija board</li>
            <li>Session duration</li>
            <li>Features used (Anonymous Mode, Friend Mode)</li>
            <li>Device information (browser type, operating system)</li>
          </ul>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">How We Use Your Information</h2>
          <p className="mb-4">We use the collected information for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing and maintaining our service</li>
            <li>Improving the user experience</li>
            <li>Analyzing usage patterns to enhance features</li>
            <li>Facilitating real-time communication between users</li>
          </ul>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          <p>
            Your session data is temporary and not permanently stored after you leave the website.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Third-Party Services</h2>
          <p className="mb-4">
            We may use third-party services such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pusher for real-time communication</li>
            <li>OpenAI for AI-powered responses</li>
          </ul>
          <p>
            These services have their own privacy policies governing the use of your information.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@spiritboard.example.com.
          </p>
        </section>
      </main>
      
      <footer className="mt-12 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Ouija Board Experience - For entertainment purposes only</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/about" className="hover:text-amber-400">About</Link>
          <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber-400">Terms of Use</Link>
        </div>
      </footer>
    </div>
  );
}