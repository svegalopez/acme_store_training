import React from "react";

const useApi = (url, method = "GET", credentials = true) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const urlRef = React.useRef(url);

  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await fetch(url, {
        method,
        credentials: credentials ? "include" : "omit",
      });
      if (res.ok) {
        const data = await res.json();
        setLoading(false);
        setData(data);
        setError(null);
      } else {
        setLoading(false);
        setData(null);
        setError(await res.text());
      }
    };

    urlRef.current = url;
    fetchApi();
  }, [url, credentials, method]);

  if (urlRef.current !== url) {
    return { loading: true, data: null, error: null };
  }

  return { loading, data, error };
};

export default useApi;
