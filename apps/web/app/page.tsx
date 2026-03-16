'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h9v9H3V3zm10 0h8v8h-8V3zm0 10h8v8h-8v-8zM3 14h9v8H3v-8z" />
            </svg>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Vectorizer</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              How it Works
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          Convert Images to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">Perfect Vectors</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          AI-powered vectorization that creates clean, scalable SVG files from any image. Upload your logos, sketches, or photos and get professional vector graphics instantly.
        </p>
        <Link href="/workspace" className="btn-primary inline-block mb-12">
          Start Vectorizing →
        </Link>
        <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="bg-slate-900 text-white p-12 text-center">
            <p className="text-sm text-slate-400 mb-4">Upload an image to see the magic</p>
            <svg className="w-32 h-32 mx-auto text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'AI-Powered',
              description: 'Advanced algorithms detect shapes, colors, and details automatically.'
            },
            {
              icon: '✨',
              title: 'Clean Output',
              description: 'Get professional vector graphics optimized for any size.'
            },
            {
              icon: '🎨',
              title: 'Full Control',
              description: 'Fine-tune detail level, colors, and smoothness to your needs.'
            },
            {
              icon: '📥',
              title: 'Easy Upload',
              description: 'Simply drag and drop your image or click to select.'
            },
            {
              icon: '💾',
              title: 'Multiple Formats',
              description: 'Export as SVG, PNG, or download the raw vector data.'
            },
            {
              icon: '🚀',
              title: 'Lightning Fast',
              description: 'Process images in seconds with our optimized engine.'
            }
          ].map((feature, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { number: '1', title: 'Upload', desc: 'Drag your image onto the canvas' },
            { number: '2', title: 'Process', desc: 'AI analyzes and vectorizes' },
            { number: '3', title: 'Adjust', desc: 'Fine-tune with live preview' },
            { number: '4', title: 'Download', desc: 'Export as SVG or PNG' }
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Ready to Vectorize?</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Get started in seconds. No account required.</p>
        <Link href="/workspace" className="btn-primary inline-block">
          Start Now →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p className="mt-2">© 2024 Vectorizer. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
