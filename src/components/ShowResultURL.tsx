import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingSpinner from "./shared/LoadingSpinner";

interface FormData {
  shortenedUrl: string;
}

const url = "https://url-shortener-service.p.rapidapi.com/shorten";

export default function ShowResultURL() {
  const [showModel, setShowModel] = useState<boolean>(false);
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
  const shortenedUrlInputRef = useRef<HTMLInputElement | null>();
  const { ref, ...rest } = register("shortenedUrl");

  const onSubmit = handleSubmit((data) => {
    navigator.clipboard.writeText(data?.shortenedUrl);
    shortenedUrlInputRef.current?.select();
    shortenedUrlInputRef.current?.setSelectionRange(0, 999999);
    setShowModel(true);
  });

  const [targetUrl, _setTargetUrl] = useLocalStorage<string>("url", "");

  const callShortenerAPI = useCallback(
    async (targetUrl: string) => {
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
        // set input value
        setValue("shortenedUrl", result?.result_url);
        console.log(result);
      } catch (error) {
        console.error(error);
        reset();
      }
    },
    [reset, setValue]
  );

  useEffect(() => {
    callShortenerAPI(targetUrl);
  }, [targetUrl, callShortenerAPI]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Your shortened URL</h1>
        <p>
          Copy the shortened link and share it in messages, texts, posts,
          websites and other locations.
        </p>
      </div>
      <div className="mx-auto flex flex-col items-center justify-center rounded-sm shadow-lg shadow-zinc-300">
        <div className="w-full px-8 py-4 sm:px-16">
          <div className="relative">
            <form
              className="sm:text-md flex w-full text-sm"
              onSubmit={onSubmit}
            >
              <input
                className="flex-1 rounded-s-md border py-1 pl-2 focus:outline-none"
                placeholder="URL here..."
                ref={(e) => {
                  ref(e);
                  shortenedUrlInputRef.current = e;
                }}
                {...rest}
              />
              <button
                className="w-24 rounded-e-md border border-blue-500 bg-blue-500 p-1 text-white"
                type="submit"
              >
                Copy URL
              </button>
            </form>
            {showModel && (
              <div className="absolute right-0 mt-1 w-fit rounded-sm bg-gray-900 px-2 py-1 text-xs text-white">
                URL Copied
              </div>
            )}
            <p className="ml-1 mt-2 self-start text-sm text-gray-600">
              Long URL: <span>{targetUrl}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
