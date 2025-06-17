"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePat } from "@/components/pat-context";

export default function Home() {
  const [pat, setPat] = useState("");
  const router = useRouter();
  const { setPat: setPatContext } = usePat();

  const handleSave = () => {
    localStorage.setItem("pat", pat);
    setPatContext(pat);
    router.push("/dashboard/workspaces");
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full gap-8'>
      <h1 className='text-4xl font-bold'>Enter PAT</h1>
      <div className='flex flex-row gap-4'>
        <Input
          type='password'
          placeholder='Enter PAT'
          className='w-md'
          value={pat}
          onChange={(e) => setPat(e.target.value)}
        />
        <Button onClick={handleSave} className='cursor-pointer'>
          Save
        </Button>
      </div>
      <div className='flex flex-col gap-2 justify-center items-center text-sm font-light'>
        <p>
          You can get your PAT from{" "}
          <a
            href='https://app.asana.com/0/my-apps'
            target='_blank'
            className='underline'
          >
            here
          </a>
        </p>
        <p>
          Find documentation{" "}
          <a
            href='https://developers.asana.com/docs/personal-access-token'
            target='_blank'
            className='underline'
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
}
