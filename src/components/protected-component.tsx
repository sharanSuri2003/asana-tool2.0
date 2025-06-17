"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ProtectedComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const pat = localStorage.getItem("pat");
    if (!pat) {
      router.push("/");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;
  return <div>{children}</div>;
}

export default ProtectedComponent;
