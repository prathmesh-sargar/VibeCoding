import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t py-12">
            <div className="container mx-auto px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo & Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                                <path d="m18 16 4-4-4-4"></path>
                                <path d="m6 8-4 4 4 4"></path>
                                <path d="m14.5 4-5 16"></path>
                            </svg>
                            <span className="text-xl font-bold text-gray-900">CodeMinder</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Track, analyze, and share your coding journey with the most comprehensive developer platform.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a className="text-gray-600 hover:text-primary transition" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                                </svg>
                            </a>
                            <a className="text-gray-600 hover:text-primary transition" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div>
                        <h3 className="font-medium mb-4 text-gray-900">Product</h3>
                        <ul className="space-y-2">
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Features</a></li>
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Pricing</a></li>
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4 text-gray-900">Company</h3>
                        <ul className="space-y-2">
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">About</a></li>
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Careers</a></li>
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4 text-gray-900">Legal</h3>
                        <ul className="space-y-2">
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Terms</a></li>
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Privacy</a></li>
                            <li><a className="text-sm text-gray-600 hover:text-primary" href="#">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
                    <p>© 2025 CodeMinder. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a className="hover:text-primary" href="#">Terms of Service</a>
                        <a className="hover:text-primary" href="#">Privacy Policy</a>
                        <a className="hover:text-primary" href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
