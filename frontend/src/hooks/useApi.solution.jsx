import React from "react";

const useApi = (url, method = "GET", credentials = true) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const urlRef = React.useRef(url);

  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await fetch(url, {
        method,
        credentials: credentials ? "include" : "omit",
      });
      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setLoading(false);
          setData(data);
        }, 250);
      } else {
        console.error(await res.text());
      }
    };

    urlRef.current = url;
    fetchApi();
  }, [url, credentials, method]);

  if (urlRef.current !== url) {
    return { loading: true, data: null };
  }

  return { loading, data };
};

export default useApi;
