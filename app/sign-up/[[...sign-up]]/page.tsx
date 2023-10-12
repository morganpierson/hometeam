import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-900">
      <SignUp afterSignInUrl={'/new-user'} redirectUrl={'/new-user'} />
    </div>
  )
}

export default SignUpPage
