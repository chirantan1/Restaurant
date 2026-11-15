import { useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    username: user.username || "",
    email: user.email || "",
    address: user.address?.join(", ") || "",
    phoneNumber: user.phoneNumber || "",
  });
  const [msg, setMsg] = useState("");

  // Password change flow
  const [showPassword, setShowPassword] = useState(false);
  const [pwStep, setPwStep] = useState(0); // 0 = not requested, 1 = OTP sent
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/updateUser", { ...form, address: [form.address] });
      await refreshUser();
      setMsg("Profile updated.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

  const requestOtp = async () => {
    setPwMsg("");
    setLoading(true);
    try {
      await api.post("/auth/request-password-otp");
      setPwStep(1);
      setPwMsg("OTP sent to your email. Check your inbox.");
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setLoading(true);
    try {
      await api.post("/auth/change-password-with-otp", { otp, newPassword });
      setPwMsg("Password changed successfully.");
      setShowPassword(false);
      setPwStep(0);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPassword(false);
    setPwStep(0);
    setOtp("");
    setNewPassword("");
    setPwMsg("");
  };

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {msg && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={save} className="space-y-4">
        {["username", "email", "address", "phoneNumber"].map((field) => (
          <div key={field}>
            <label className="block text-sm mb-1 capitalize">{field}</label>
            <input
              className="input"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}
        <button className="btn-primary w-full">Save Profile</button>
      </form>

      <hr className="my-6" />

      <h2 className="font-bold mb-3">Change Password</h2>

      {pwMsg && (
        <div
          className={`p-3 rounded-lg mb-3 text-sm ${
            pwMsg.toLowerCase().includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {pwMsg}
        </div>
      )}

      {!showPassword ? (
        <button
          onClick={() => setShowPassword(true)}
          className="btn-secondary w-full"
        >
          Change my password
        </button>
      ) : pwStep === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            We'll send a 6-digit code to <b>{user.email}</b>.
          </p>
          <button
            onClick={requestOtp}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Sending..." : "Send OTP to my email"}
          </button>
          <button
            onClick={cancelPasswordChange}
            className="btn-secondary w-full"
          >
            Cancel
          </button>
        </div>
      ) : (
        <form onSubmit={changePassword} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">OTP (from email)</label>
            <input
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              required
              maxLength={6}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
          <button
            type="button"
            onClick={cancelPasswordChange}
            className="btn-secondary w-full"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
