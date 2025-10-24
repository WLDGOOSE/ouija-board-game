'use client';

import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <header className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-amber-500">Terms of Use</h1>
          <Link href="/" className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-md transition-colors">
            Return Home
          </Link>
        </div>
      </header>
      
      <main className="w-full max-w-4xl space-y-8">
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Ouija Board Experience website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Use of the Service</h2>
          <p className="mb-4">
            The Ouija Board Experience is provided for entertainment purposes only. You agree to use the service in accordance with these Terms and all applicable laws and regulations.
          </p>
          <p className="mb-4">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the service for any illegal purpose</li>
            <li>Attempt to disrupt or compromise the security of the website</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Post content that is offensive, harmful, or inappropriate</li>
            <li>Attempt to access areas of the website not intended for public use</li>
          </ul>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Intellectual Property</h2>
          <p className="mb-4">
            All content on this website, including text, graphics, logos, and software, is the property of the Ouija Board Experience or its content suppliers and is protected by copyright laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Disclaimer</h2>
          <p className="mb-4">
            The Ouija Board Experience is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the website will be error-free or uninterrupted.
          </p>
          <p className="mb-4">
            This service is for entertainment purposes only. We do not claim to provide actual communication with spirits or the deceased. All responses are generated through technology and are not supernatural in nature.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Limitation of Liability</h2>
          <p>
            In no event shall the Ouija Board Experience, its operators, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on the website. Your continued use of the service after any changes indicates your acceptance of the modified terms.
          </p>
        </section>
        
        <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">Contact</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at terms@spiritboard.example.com.
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