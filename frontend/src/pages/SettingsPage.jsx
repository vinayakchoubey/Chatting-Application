import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, Eye, EyeOff, User, Lock, Palette, Globe, Camera, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, updateProfile, changePassword, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("theme"); // profile, password, theme, language

  // Profile State
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [selectedImg, setSelectedImg] = useState(null);

  // Password State
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Language State
  const [language, setLanguage] = useState("English");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      // We don't auto-upload here to let user confirm with "Update Profile" button if we want, 
      // but typical pattern in this app has been auto-upload or on save.
      // Let's hold it in state and upload when saving.
    };
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName, profilePic: selectedImg });
    // Toast handled in store
  };

  const tabs = [
    { id: "theme", label: "Theme", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
    ...(authUser ? [
      { id: "profile", label: "Profile", icon: User },
      { id: "password", label: "Password", icon: Lock },
    ] : [])
  ];

  // If active tab is not in list (e.g. was profile but logged out), reset to theme
  if (!tabs.find(t => t.id === activeTab)) {
    setActiveTab("theme");
  }

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-6xl">
      <div className="grid md:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3 lg:col-span-3 space-y-2">
          <div className="card bg-base-100 shadow-xl h-full border border-base-300">
            <div className="card-body p-4">
              <h2 className="text-xl font-bold mb-4 px-4">Settings</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${activeTab === tab.id ? "bg-primary text-primary-content font-medium shadow-md" : "hover:bg-base-200 text-base-content/70"}
                    `}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              {authUser && (
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 text-red-500 transition-all duration-200 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 lg:col-span-9">
          <div className="card bg-base-100 shadow-xl h-full border border-base-300 overflow-y-auto">
            <div className="card-body p-6">

              {/* Profile Settings */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl"
                >
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <p className="text-base-content/60">Update your personal information</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img
                          src={selectedImg || authUser?.profilePic || "/avatar.png"}
                          alt="Profile"
                          className="size-32 rounded-full object-cover border-4 border-base-200"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className={`
                            absolute bottom-0 right-0 
                            bg-base-content hover:scale-105
                            p-2 rounded-full cursor-pointer 
                            transition-all duration-200
                          `}
                        >
                          <Camera className="w-5 h-5 text-base-200" />
                          <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-sm text-base-content/50">
                        Click camera icon to update photo
                      </p>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Full Name</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          className="input input-bordered w-full pl-10"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Email Address</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          className="input input-bordered w-full pl-10"
                          value={authUser?.email}
                          disabled
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                      Save Changes
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Password Settings */}
              {activeTab === "password" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl"
                >
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold">Change Password</h2>
                    <p className="text-base-content/60">Update your password to keep your account secure</p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const oldPassword = form.oldPassword.value;
                      const newPassword = form.newPassword.value;
                      const confirmPassword = form.confirmPassword.value;

                      if (newPassword !== confirmPassword) {
                        return toast.error("New passwords do not match");
                      }

                      await changePassword({ oldPassword, newPassword });
                      form.reset();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Current Password</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          name="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="input input-bordered w-full pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? <EyeOff className="w-5 h-5 text-base-content/40" /> : <Eye className="w-5 h-5 text-base-content/40" />}
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">New Password</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="input input-bordered w-full pl-10 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5 text-base-content/40" /> : <Eye className="w-5 h-5 text-base-content/40" />}
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Confirm New Password</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="input input-bordered w-full pl-10 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5 text-base-content/40" /> : <Eye className="w-5 h-5 text-base-content/40" />}
                        </button>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="btn btn-primary w-full">
                        Update Password
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Theme Settings */}
              {activeTab === "theme" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold">Theme Settings</h2>
                    <p className="text-base-content/60">Customize the look and feel of your chat</p>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        className={`
                          group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all
                          ${theme === t ? "bg-primary/10 border-2 border-primary" : "hover:bg-base-200 border-2 border-transparent"}
                        `}
                        onClick={() => setTheme(t)}
                      >
                        <div className="relative h-8 w-full rounded-md overflow-hidden ring-1 ring-base-content/20" data-theme={t}>
                          <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                            <div className="rounded bg-primary"></div>
                            <div className="rounded bg-secondary"></div>
                            <div className="rounded bg-accent"></div>
                            <div className="rounded bg-neutral"></div>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium truncate w-full text-center">
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Preview Section */}
                  <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg max-w-2xl mx-auto">
                    <div className="p-4 bg-base-200">
                      <h3 className="text-sm font-semibold mb-3 ml-2">Preview</h3>
                      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                        {/* Chat Header */}
                        <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                              J
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">Vinayak</h3>
                              <p className="text-xs text-base-content/70">Online</p>
                            </div>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                          {PREVIEW_MESSAGES.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`
                                  max-w-[80%] rounded-xl p-3 shadow-sm
                                  ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                                `}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`
                                    text-[10px] mt-1.5
                                    ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                                  `}
                                >
                                  12:00 PM
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-base-300 bg-base-100">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="input input-bordered flex-1 text-sm h-10"
                              placeholder="Type a message..."
                              value="This is a preview"
                              readOnly
                            />
                            <button className="btn btn-primary h-10 min-h-0">
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Language Settings */}
              {activeTab === "language" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl"
                >
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold">App Language</h2>
                    <p className="text-base-content/60">Choose your preferred language</p>
                  </div>

                  <div className="space-y-4">
                    {["English", "Spanish", "French", "German", "Hindi", "Japanese"].map((lang) => (
                      <label key={lang} className="flex items-center justify-between p-4 border border-base-300 rounded-xl cursor-pointer hover:bg-base-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{lang}</span>
                        </div>
                        <input
                          type="radio"
                          name="language"
                          className="radio radio-primary"
                          checked={language === lang}
                          onChange={() => setLanguage(lang)}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-base-content/50 mt-4">
                    Note: This is a visual preference setting. Actual translation support may vary.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Mail Icon component since it wasn't imported
const Mail = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default SettingsPage;