import React from "react";

export const AuthContext = React.createContext();

export const AuthContextProvider = function ({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const login = React.useCallback(async (email, password, onLogin) => {
    let res = await fetch(`${process.env.HOST}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const { user } = await res.json();
    if (onLogin) {
      onLogin(user);
    }
    return setUser(user);
  }, []);

  const register = React.useCallback(async (email, password, onLogin) => {
    let res = await fetch(`${process.env.HOST}/api/register`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(
        (await res.text()) ||
          "Error signing up, please check your provided email and/or password"
      );
    }
    const { user } = await res.json();
    if (onLogin) {
      onLogin(user);
    }
    return setUser(user);
  }, []);

  const logout = React.useCallback(async () => {
    const res = await fetch(`${process.env.HOST}/api/logout`, {
      credentials: "include",
      method: "POST",
    });
    if (res.ok) {
      setUser(null);
    } else {
      console.error("Error logging out");
    }
  }, []);

  const authCtx = React.useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  React.useEffect(() => {
    async function fetchuser() {
      const res = await fetch(`${process.env.HOST}/api/current-user`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        return setLoading(false);
      }
      const user = await res.json();
      setUser(user);
      setLoading(false);
    }

    fetchuser();
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>
  );
};
