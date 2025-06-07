import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaGithub, FaLinkedin, FaKey, FaCopy, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdWarning } from 'react-icons/io';

type PasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  customWord?: string;
};

type WebsitePattern = {
  name: string;
  pattern: PasswordOptions;
  description: string;
};

type StrengthCheck = {
  criteria: string;
  passed: boolean;
  score: number;
};

const websitePatterns: WebsitePattern[] = [
  {
    name: "Google",
    pattern: { length: 12, uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: "8+ chars, mix of letters, numbers & symbols"
  },
  {
    name: "Microsoft",
    pattern: { length: 14, uppercase: true, lowercase: true, numbers: true, symbols: true },
    description: "8+ chars, uppercase, lowercase, numbers & symbols"
  },
  {
    name: "Amazon",
    pattern: { length: 10, uppercase: true, lowercase: true, numbers: true, symbols: false },
    description: "6+ chars, includes at least 1 number"
  }
];

const generateSinglePassword = (options: PasswordOptions): string => {
  let chars = '';
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let result = options.customWord || '';
  const remainingLength = options.length - result.length;

  for (let i = 0; i < remainingLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result.split('').sort(() => Math.random() - 0.5).join('');
};

function App() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    customWord: '',
  });

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthChecks, setStrengthChecks] = useState<StrengthCheck[]>([]);
  const [similarPasswords, setSimilarPasswords] = useState<string[]>([]);
  const [showStrengthDetails, setShowStrengthDetails] = useState(false);

  const calculateStrength = (pass: string) => {
    const checks: StrengthCheck[] = [
      {
        criteria: "Length ≥ 12 characters",
        passed: pass.length >= 12,
        score: 2
      },
      {
        criteria: "Contains uppercase letters",
        passed: /[A-Z]/.test(pass),
        score: 1
      },
      {
        criteria: "Contains lowercase letters",
        passed: /[a-z]/.test(pass),
        score: 1
      },
      {
        criteria: "Contains numbers",
        passed: /[0-9]/.test(pass),
        score: 1
      },
      {
        criteria: "Contains symbols",
        passed: /[^A-Za-z0-9]/.test(pass),
        score: 1
      },
      {
        criteria: "Length ≥ 16 characters",
        passed: pass.length >= 16,
        score: 1
      },
      {
        criteria: "No repeated characters",
        passed: !/(.).*\1/.test(pass),
        score: 1
      },
      {
        criteria: "Contains multiple numbers",
        passed: (pass.match(/[0-9]/g) || []).length >= 2,
        score: 1
      },
      {
        criteria: "Contains multiple symbols",
        passed: (pass.match(/[^A-Za-z0-9]/g) || []).length >= 2,
        score: 1
      }
    ];

    setStrengthChecks(checks);
    const totalScore = checks.reduce((sum, check) => sum + (check.passed ? check.score : 0), 0);
    setStrength(totalScore);
  };

  const generatePassword = () => {
    const newPassword = generateSinglePassword(options);
    setPassword(newPassword);
    calculateStrength(newPassword);
    generateSimilarPasswords();
  };

  const generateSimilarPasswords = () => {
    const similar = Array.from({ length: 3 }, () => generateSinglePassword(options));
    setSimilarPasswords(similar);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  }, [options]);

  const getStrengthColor = (score: number) => {
    if (score <= 3) return 'bg-red-500';
    if (score <= 5) return 'bg-yellow-500';
    if (score <= 7) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 3) return 'Weak';
    if (score <= 5) return 'Moderate';
    if (score <= 7) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="w-10 h-10 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                PassMatic
              </h1>
              <p className="text-gray-400 text-sm">Secure Password Generator</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/abhijithmr226" target="_blank" rel="noopener noreferrer" 
               className="hover:text-purple-400 transition-colors">
              <FaGithub className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/abhijithmr226" target="_blank" rel="noopener noreferrer"
               className="hover:text-purple-400 transition-colors">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full bg-slate-900/50 rounded-xl px-6 py-4 font-mono text-xl border border-slate-700/50 focus:outline-none focus:border-purple-500/50"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors text-purple-400"
                  title="Copy to clipboard"
                >
                  {copied ? <IoMdCheckmarkCircle className="w-6 h-6" /> : <FaCopy className="w-5 h-5" />}
                </button>
                <button
                  onClick={generatePassword}
                  className="p-2 rounded-lg hover:bg-green-500/20 transition-colors text-green-400"
                  title="Generate new password"
                >
                  <FaRedo className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold">Password Strength</h3>
              <button
                onClick={() => setShowStrengthDetails(!showStrengthDetails)}
                className="text-gray-400 hover:text-purple-400 transition-colors"
                title="Show strength details"
              >
                <FaInfoCircle className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium ml-2 px-3 py-1 rounded-full bg-slate-700/50">
                {getStrengthLabel(strength)} ({strength}/10)
              </span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                style={{ width: `${(strength / 10) * 100}%` }}
              ></div>
            </div>
            {showStrengthDetails && (
              <div className="mt-4 bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="font-semibold mb-4">Strength Criteria:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {strengthChecks.map((check, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {check.passed ? (
                        <IoMdCheckmarkCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <IoMdWarning className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${check.passed ? 'text-green-400' : 'text-yellow-400'}`}>
                        {check.criteria} ({check.score} {check.score === 1 ? 'point' : 'points'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Options</h3>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Length: {options.length}</span>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={options.length}
                        onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Uppercase', key: 'uppercase' },
                      { label: 'Lowercase', key: 'lowercase' },
                      { label: 'Numbers', key: 'numbers' },
                      { label: 'Symbols', key: 'symbols' },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                        <input
                          type="checkbox"
                          checked={options[key as keyof PasswordOptions] as boolean}
                          onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                          className="w-4 h-4 rounded accent-purple-500"
                        />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <input
                      type="text"
                      placeholder="Custom word (optional)"
                      value={options.customWord}
                      onChange={(e) => setOptions({ ...options, customWord: e.target.value })}
                      className="w-full bg-transparent border-none focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Website Patterns</h3>
              <div className="space-y-3">
                {websitePatterns.map((pattern) => (
                  <button
                    key={pattern.name}
                    onClick={() => setOptions(pattern.pattern)}
                    className="w-full text-left bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <FaKey className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                      <span className="font-semibold">{pattern.name}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{pattern.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4">Similar Passwords</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarPasswords.map((pass, index) => (
              <div key={index} 
                   className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm break-all border border-slate-700/50">
                {pass}
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-400">
          <p>Designed and Developed by{' '}
            <a href="https://linkedin.com/in/abhijithmr226" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-purple-400 hover:text-purple-300 transition-colors">
              abhijithmr226
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;