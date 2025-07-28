import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_URL: string | undefined = process.env.REACT_APP_API_BASE_URL;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendData = async () => {
      setLoading(true);
      setError(null);

      if (!API_URL) throw new Error("Server API is not defined");

      const response = await axios.get<{ message: string }>(API_URL);
      console.log(response);
    };

    fetchBackendData();
  }, [API_URL]);

  return (
    <div>
      <p>Hello World</p>

      {loading && <p>It is loading</p>}
      {error && <p>Show error</p>}
    </div>
  );
}

export default App;
