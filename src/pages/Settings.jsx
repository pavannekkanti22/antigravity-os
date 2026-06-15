import { useEffect, useState } from "react";

function SettingsPage() {

  const token = localStorage.getItem("token");

  const [settings, setSettings] = useState({
    applicationName: "",
    companyName: "",
    supportEmail: "",
    sessionTimeout: 30,
    maintenanceMode: false,
    userRegistrationEnabled: true,
    passwordMinLength: 8,
  });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadSettings = async () => {
    const response = await fetch(
      "http://localhost:8081/api/settings",
      {
        headers: authHeaders,
      }
    );

    const data = await response.json();

    setSettings(data);
  };

  const saveSettings = async () => {
    await fetch(
      "http://localhost:8081/api/settings",
      {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(settings),
      }
    );

    alert("Settings Saved Successfully");
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-black mb-8">
          System Settings
        </h1>

        <div className="bg-zinc-950 border border-cyan-500/20 rounded-3xl p-8 space-y-6">

          <div>
            <label className="block mb-2">
              Application Name
            </label>

            <input
              className="w-full bg-zinc-900 rounded-xl p-3"
              value={settings.applicationName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  applicationName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Company Name
            </label>

            <input
              className="w-full bg-zinc-900 rounded-xl p-3"
              value={settings.companyName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  companyName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Support Email
            </label>

            <input
              className="w-full bg-zinc-900 rounded-xl p-3"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  supportEmail: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Session Timeout (minutes)
            </label>

            <input
              type="number"
              className="w-full bg-zinc-900 rounded-xl p-3"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessionTimeout: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Password Minimum Length
            </label>

            <input
              type="number"
              className="w-full bg-zinc-900 rounded-xl p-3"
              value={settings.passwordMinLength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordMinLength: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Maintenance Mode</span>

            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span>User Registration Enabled</span>

            <input
              type="checkbox"
              checked={settings.userRegistrationEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  userRegistrationEnabled: e.target.checked,
                })
              }
            />
          </div>

          <button
            onClick={saveSettings}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-2xl"
          >
            Save Settings
          </button>

        </div>
      </div>
    </div>
  );
}

export default SettingsPage;