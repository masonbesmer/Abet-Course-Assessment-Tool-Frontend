import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";
import unAuth from "../pages/unAuth";
const AuthStateContext = createContext();

export function useAuth() {
  return useContext(AuthStateContext);
}

function AuthProvider({ children }) {
  const ISSERVER = typeof window === "undefined";
  let role = "";
  let isLoading = true;
  if (!ISSERVER) {
    const token = cookieCutter.get("token");
    const json = jwt.decode(token);
    if (json == null) {
      role = "null";
    } else {
      role = json.role;
    }
    if (role.includes("Admin")) {
      role = "Admin";
    } else if (role.includes("Instructor")) {
      role = "Instructor";
    } else if (role.includes("Coordinator")) {
      role = "Coordinator";
    } else if (role.includes("Assistant")) {
      role = "Assistant";
    }
    isLoading = false;
  }
  const router = useRouter();
  let allowed = true;

  if (router.pathname.startsWith("/student") && role !== "Student") {
    allowed = false;
  }
  if (
    router.pathname.startsWith("/instructor") &&
    role !== "Instructor" &&
	router.pathname.startsWith("/instructor") &&
    role !== "Assistant" &&
    router.pathname.startsWith("/instructor") &&
    role !== "Coordinator" &&
    router.pathname.startsWith("/instructor") &&
    role !== "Admin"
  ) {
    allowed = false;
    //console.log(allowed);
  }
  if (router.pathname.startsWith("/applicant") && role !== "applicant") {
    allowed = false;
  }
  if (router.pathname.startsWith("/admin") && role !== "Admin") {
    allowed = false;
  }

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      isLoading = false;
    });
    //console.log(`LL: AuthProvider -> role`, role);
    if (!isLoading) {
      if (router.pathname == "/" && role == "Admin") {
        router.push("/adminHome");
      } else if (router.pathname == "/" && role == "Instructor") {
        router.push("/instructorHome");
      } else if (router.pathname == "/" && role == "Assistant") {
        router.push("/instructorHome");
      } else if (router.pathname == "/" && role == "Coordinator") {
        console.log("Coordinator");
        router.push("/instructorHome");
      } else if (router.pathname == "/" && role == "Student") {
        router.push("/studentHome");
      } else if (router.pathname == "/") {
        router.push("/Login");
      }
      if (router.pathname.startsWith("/student") && role !== "Student") {
        if (role) {
          router.push("/unAuth");
        } else {
          router.push("/studentHome");
        }
      }
      if (
        router.pathname.startsWith("/instructor") &&
        role !== "Instructor" &&
		router.pathname.startsWith("/instructor") &&
        role !== "Assistant" &&
        router.pathname.startsWith("/instructor") &&
        role !== "Admin" &&
        router.pathname.startsWith("/instructor") &&
        role !== "Coordinator"
      ) {
        if (role) {
          console.log(role);
          router.push("/unAuth");
        } else {
          //console.log("have access");
          router.push("/instructorHome");
        }
      }
      if (router.pathname.startsWith("/applicant") && role !== "applicant") {
        if (role) {
          router.push("/unAuth");
        } else {
          router.push("/");
        }
      }
      if (router.pathname.startsWith("/admin") && role !== "Admin") {
        if (role) {
          router.push("/unAuth");
        } else {
          router.push("/adminHome");
        }
      }
    }
  }, [role, router]);

  const contextValue = useMemo(() => [allowed, role], [allowed, role]);
  const ComponentToRender = allowed ? children : unAuth;

  return (
    <AuthStateContext.Provider value={contextValue}>
      {ComponentToRender}
    </AuthStateContext.Provider>
  );
}

export { AuthProvider };
