"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  return (
    <div style={{
        marginBottom: '40px'
    }}>
      <button
        onClick={async () => {
          await signOut();
          router.push("/login");
        }}
        className="px-2 bg-white text-black"
      >
        Sign out
      </button>
    </div>
  );
}