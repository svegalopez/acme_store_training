import React from "react";
import { useQueryClient } from "@tanstack/react-query";

export const AuthContext = React.createContext();

export const AuthContextProvider = function ({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const login = React.useCallback(async (email, password, onLogin) => {}, []);

  const register = React.useCallback(async (email, password, onLogin) => {},
  []);

  const logout = React.useCallback(async () => {}, []);

  const authCtx = React.useMemo(() => ({}), []);

  React.useEffect(() => {
    // Fetch the user
  }, []);

  React.useEffect(() => {
    // Clear all queries when the user logs out
  }, [user, queryClient]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>
  );
};
