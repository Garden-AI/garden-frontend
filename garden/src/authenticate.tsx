import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";
import { Spinner } from "@chakra-ui/react";

export default function Authenticate() {
  const auth = useGlobusAuth();
  const router = useRouter();
  const instance = auth.authorization;

  useEffect(() => {
    async function attempt() {
      if (auth.isAuthenticated) {
        return router.replace("/");
      } else {
        await instance?.handleCodeRedirect({
          shouldReplace: false,
        });
      }
    }
    attempt();
  }, [router, instance, instance?.handleCodeRedirect, auth.isAuthenticated]);
  return <Spinner />;
}