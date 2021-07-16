import { Magic } from "@magic-sdk/admin";
import { Magic as MagicSdk } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

export const magic = new Magic(process.env.MAGIC_SECRET_KEY);

// Create client-side Magic instance
const createMagic = (key) => {
  return (
    typeof window != "undefined" &&
    new MagicSdk(key, {
      extensions: [new OAuthExtension()],
    })
  );
};

export const magicClient = createMagic(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
);
