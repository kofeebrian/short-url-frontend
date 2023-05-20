import { getAuthToken, setAuthToken } from "@/utils/auth";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";

const BASE_URL = process.env.API_ENDPOINT || "http://localhost:8080";

export type ShortenedURL = string;

export function useShortenedURL(targetUrl: string) {
  const [resultUrl, setResultUrl] = useState<string | undefined>("");

  const fetchShortenedUrl = useCallback(
    async (targetUrl: string): Promise<void> => {
      if (targetUrl === "") return;

      const token = getAuthToken();
      const config: AxiosRequestConfig = { 
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      }

      if (token) {
        config.headers!.Authorization = `Bearer ${token.replace(/['"]+/g, "")}`;
      }

      axios
        .post(
          `${BASE_URL}/shorten`,
          { url: targetUrl },
          { ...config }
        )
        .then((response) => {
          setResultUrl(response.data.result_url);
        })
        .catch(async (error: Error | AxiosError) => {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              console.log("Unauthorized, generating new token");
              const newTokenResponse = await axios.get(`${BASE_URL}/token`);

              if (newTokenResponse.status === 200) {
                const newToken = newTokenResponse.data.token;

                // update the token in local
                setAuthToken(newToken);

                // Retry the original request with the new token
                return fetchShortenedUrl(targetUrl);
              }
            }
          } else {
            console.error(error);
            setResultUrl("Something went wrong");
          }
        });
    },
    []
  );

  useEffect(() => {
    fetchShortenedUrl(targetUrl);
    return () => {};
  }, [targetUrl, fetchShortenedUrl]);

  return { resultUrl } as const;
}
