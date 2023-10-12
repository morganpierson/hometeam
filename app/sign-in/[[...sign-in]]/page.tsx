import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-900">
      <SignIn />
    </div>
  )
}

export default SignInPage
