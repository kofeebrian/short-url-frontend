import { useCallback, useEffect, useState } from "react";

const url = "https://url-shortener-service.p.rapidapi.com/shorten";

export function useShortenedURL(targetUrl: string) {
  const [resultUrl, setResultUrl] = useState<string | undefined>("");
  const callShortenerAPI = useCallback(async (targetUrl: string) => {
    if (targetUrl === "") return;

    const encodedParams = new URLSearchParams();
    console.log(targetUrl);
    encodedParams.set("url", targetUrl);

    console.log(process.env.RAPIDAPI_TOKEN);

    const options = {
      method: "POST",
      url: "https://url-shortener-service.p.rapidapi.com/shorten",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.RAPIDAPI_TOKEN as string,
        "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
      },
      body: encodedParams,
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setResultUrl(result.result_url);
    } catch (error) {
      console.error(error);
      setResultUrl("Something went wrong");
    }
  }, []);

  useEffect(() => {
    callShortenerAPI(targetUrl);
  }, [targetUrl, callShortenerAPI]);

  return { resultUrl } as const;
}
