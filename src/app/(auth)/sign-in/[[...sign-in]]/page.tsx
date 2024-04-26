
import { SignIn } from "@clerk/nextjs";

const Page = () => {
    return (
        <div>
            <SignIn path="/sign-in" />
        </div>
    )
}

export default Page
