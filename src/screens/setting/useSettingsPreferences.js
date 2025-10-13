import { useEffect, useState, useCallback } from 'react';
import userService from '../../services/api/UserService';

export default function useSettingsPreferences() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPrefs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userService.getPreferences();
      setPrefs(data);
    } catch (err) {
      setPrefs(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadPrefs(); }, []);

  // PATCH single field, then update state
  const update = async (patch) => {
    setLoading(true);
    try {
      const { data } = await userService.updatePreferences(patch);
      setPrefs(data);
    } finally {
      setLoading(false);
    }
  };

  return { loading, prefs, update, reload: loadPrefs };
}
