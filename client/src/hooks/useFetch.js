import { useEffect, useState } from "react";
import axios from 'axios';

export const useFetch = (url, currentAccountInfo) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setData(null);
    setIsPending(true);
    setError(null);

    /*const fetchData = async () => {
      try {
        const response = await fetch(url, {signal});

        if (!response.ok) {
          throw new Error("Could not fetch the data.");
        }
        const result = await response.json();
        setData(result);
        setIsPending(false);
        setError(null);
      } catch (error) {
        setIsPending(false);
        if (error.name === "AbortError") {
          console.log(error.message);
          setError(error.message);
        } else {
          setError(error.message);
        }
      }
    };*/
    const fetchData = async () => {
    try {

      let res = await axios({
        url: url,
        method: 'get',
        params : {
          owner : currentAccountInfo
        },
        timeout: 8000,
        headers: {
                'Content-Type': 'application/json',
        }
      });

      if(res.status == 200){
          // test for status you want, etc
          console.log(res.status)
      }
      setData(res.data);
      setIsPending(false);
      setError(null); 
    } catch (err) {
      console.error(err);
      setError(true); 
    };
  };

    fetchData();

    return () => controller.abort();
  }, [url, currentAccountInfo]);

  return { data, isPending, error };
};
