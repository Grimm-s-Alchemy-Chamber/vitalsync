import React from 'react';
import { ArrowLeft, Heart, Code, Zap, ExternalLink, Github, Coffee, Star } from 'lucide-react';

interface AboutViewProps {
    onBack: () => void;
}

export function AboutView({ onBack }: AboutViewProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">About & Credits</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Learn more about this app</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* App Info */}
                <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">VitalSync</h2>
                        <p className="text-purple-200 mb-4">
                            Because your friends know when you skip leg day.
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                            <p className="text-sm">
                                Version 1.0.0 • Built with modern web technologies
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Star className="mr-2 text-yellow-600 dark:text-yellow-400" size={20} />
                        Key Features
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Code size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">AI-Powered Chat</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Intelligent conversation that learns your preferences and helps track your fitness journey
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Heart size={16} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Smart Nutrition Tracking</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Comprehensive meal logging with macro tracking and personalized targets
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Zap size={16} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Workout Management</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Detailed exercise tracking with presets, progress monitoring, and photo logging
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Coffee size={16} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Medicine Reminders</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Smart medication tracking with meal-based timing and adherence monitoring
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Code className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
                        Built With
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="font-medium text-gray-900 dark:text-white">React 18</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Frontend Framework</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="font-medium text-gray-900 dark:text-white">TypeScript</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Type Safety</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="font-medium text-gray-900 dark:text-white">Tailwind CSS</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Styling</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="font-medium text-gray-900 dark:text-white">Vite</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Build Tool</div>
                        </div>
                    </div>
                </div>

                {/* Development Platform */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                            <Zap size={24} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Powered by Bolt.new</h3>
                        <p className="text-purple-200 text-sm mb-4">
                            This entire application was built using Bolt.new's AI-powered development platform,
                            showcasing the future of rapid application development.
                        </p>
                        <a
                            href="https://bolt.new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 text-sm font-medium"
                        >
                            <span>Visit Bolt.new</span>
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                {/* Credits */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Heart className="mr-2 text-red-600 dark:text-red-400" size={20} />
                        Credits & Acknowledgments
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">Lucide React</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Beautiful icons throughout the app</div>
                            </div>
                            <a
                                href="https://lucide.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">Pexels</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Stock photos for meal examples</div>
                            </div>
                            <a
                                href="https://pexels.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                            <div className="text-center">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Special thanks to the open-source community and all the developers who make modern web development possible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Support */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Support & Feedback
                    </h3>

                    <div className="text-center py-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            This is a demonstration app built with Bolt.new. For questions about the platform or to build your own AI-powered applications:
                        </p>
                        <a
                            href="https://bolt.new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                        >
                            <Zap size={18} />
                            <span>Try Bolt.new</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>

                {/* Version Info */}
                <div className="text-center py-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        VitalSync v1.0.0 • Built with ❤️ using Bolt.new
                    </p>
                </div>
            </div>
        </div>
    );
}