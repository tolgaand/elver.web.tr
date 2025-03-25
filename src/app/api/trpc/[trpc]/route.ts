import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const handler = async (req: NextRequest) => {
  console.log(`[TRPC] Incoming request: ${req.method} ${req.url}`);
  console.log(`[TRPC] Incoming cookies: ${req.headers.get("cookie")}`);

  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => createTRPCContext({ headers: req.headers }),
      onError:
        env.NODE_ENV === "development"
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
              );
            }
          : undefined,
      responseMeta({ ctx, errors: _errors }) {
        // Check if we have a cookie to set
        const cookieHeader = ctx?.headers.get("Set-Cookie");
        console.log(`[TRPC] Outgoing cookie header: ${cookieHeader}`);

        // Return headers for the response
        if (cookieHeader) {
          return {
            headers: {
              "Set-Cookie": cookieHeader,
            },
          };
        }
        return {};
      },
    });

    console.log(`[TRPC] Response status: ${response.status}`);
    return response;
  } catch (error) {
    console.error("[TRPC] Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export { handler as GET, handler as POST };
