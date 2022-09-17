import React from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import Loading from '../Shared/Loading';
import { Link, useNavigate } from 'react-router-dom';
import { useUpdateProfile } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
const Register = () => {
    const navigate = useNavigate();
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);
    const [updateProfile, updating, updateError] = useUpdateProfile(auth);
    if (user || gUser) {
        console.log(user || gUser)
    }
    if (loading || gLoading || updating) {
        return <Loading></Loading>
    }
    let loginError;
    if (error || gError || updateError) {
        loginError = <p className='text-red-500'>{error?.message || gError?.message || updateError?.message}</p>
    }
    const onSubmit = async(data) => {
        await createUserWithEmailAndPassword(data.email, data.password);
        await updateProfile({ displayName:data.name });
        console.log(data);
        navigate('/');
    };
    return (
        <div className='flex justify-center h-screen items-center'>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-5xl font-bold">Sign Up</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="name"
                                placeholder="Write your name"
                                className="input input-bordered w-full max-w-xs"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: 'Fill This Required Field'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.name?.type === 'required' && <span>{errors.name.message}</span>}
                                {errors.name?.type === 'pattern' && <span>{errors.name.message}</span>}
                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input input-bordered w-full max-w-xs"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Fill This Required Field'
                                    },
                                    pattern: {
                                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/,
                                        message: 'Please Give a Valid Email' // JS only: <p>error message</p> TS only support string
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.email?.type === 'required' && <span>{errors.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span>{errors.email.message}</span>}
                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full max-w-xs"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Fill This Required Field'
                                    },
                                    min: {
                                        value: 6,
                                        message: 'Please Give at Least 6 Character' // JS only: <p>error message</p> TS only support string
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.password?.type === 'required' && <span>{errors.password.message}</span>}
                                {errors.password?.type === 'min' && <span>{errors.password.message}</span>}
                            </label>
                        </div>
                        {loginError}
                        <input className="btn btn-active btn-primary w-full" type="submit" value='SignUp' />
                    </form>
                    <p><small>Already Have an Account? <Link className='text-primary' to='/register'>Login</Link></small></p>
                    <div className="divider">OR</div>
                    <button onClick={() => signInWithGoogle()} className="btn btn-accent">SIGN_IN_GOOGLE</button>
                </div>
            </div>
        </div>
    );
};

export default Register;