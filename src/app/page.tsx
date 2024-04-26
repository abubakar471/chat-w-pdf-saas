import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold ">Chat With PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {
              isAuth && <Button>Go to chats</Button>
            }
          </div>

          <p className="text-gray-700 max-w-xl text-lg mt-2">
            Join millions of students, researchers and professionals to instantly answer question and understand research with AI.
          </p>

          <div className="w-full mt-4">
            {
              isAuth ? (
                <>
                  <FileUpload />
                </>
              ) : (
                <Link href={"/sign-in"}>
                  <Button>Get started  <LogIn className="w-4 h-4 ml-2" /></Button>

                </Link>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
