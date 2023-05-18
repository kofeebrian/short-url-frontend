import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useLocalStorage from "@/hooks/useLocalStorage";

interface FormData {
  url: string;
}

const schema = yup
  .object({
    url: yup
      .string()
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        "Invalid URL!"
      )
      .required("URL is required!"),
  })
  .required();

export default function Shortener() {
  const router = useRouter();
  const [_targetUrl, setTargetUrl] = useLocalStorage<string | undefined>(
    "url",
    ""
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    let { url } = data;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    setTargetUrl(url);
    // route to "/shortened"
    router.push("/shortened");
  });

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-2 rounded-sm px-8 py-4 shadow-lg shadow-zinc-300">
      <h2 className="text-xl font-bold">Paste the URL to be shortened</h2>
      <form className="sm:text-md flex w-full text-sm" onSubmit={onSubmit}>
        <input
          className="flex-1 rounded-s-md border py-1 pl-2 focus:outline-none"
          placeholder="URL here..."
          {...register("url")}
        />
        <button
          className="inline rounded-e-md border border-blue-500 bg-blue-500 p-1 text-white"
          type="submit"
        >
          Shorten URL
        </button>
      </form>
      <p className="italic text-red-500">{errors?.url?.message}</p>
      <p className="text-center text-sm text-gray-500">
        ShortURL is a free tool to shorten URLs and generate short links
        <br />
        Our URL shortener allows to create a shortened link making it easy to
        share
      </p>
    </div>
  );
}
