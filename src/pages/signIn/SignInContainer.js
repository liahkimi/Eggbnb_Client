import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import RemoveHeader from '../layout/RemoveHeader';
import S from './style';
import { setUser, setUserStatus } from '../../modules/user';
import { useDispatch, useSelector } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const SignInContainer = () => {

    RemoveHeader()

    const {register, handleSubmit, getValues,
        formState : {isSubmitting, isSubmitted, errors}
    } = useForm({mode: "onChange"})

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

    //Redux
    const dispatch = useDispatch();
    const currentUser = useSelector((state)=>state.user.currentUser);
    const userStatus = useSelector((state)=>state.user.isLogin);

    // 로그인 상태일 때, (true)
    if(userStatus){
        return (
            <S.SignInWrapper>
                <S.Title>{currentUser.name}님 환영합니다!</S.Title>
                <S.WelcomImage src="./images/pages/signIn/welcome.gif" alt="welcome"></S.WelcomImage>
                {/* <Link to='/'><S.LogoImageLittle src="./images/pages/layout/logo.svg" alt="eggbnb"></S.LogoImageLittle></Link> */}
            
                <Link to='/'><S.Button>홈으로</S.Button></Link>
            </S.SignInWrapper>
            
        )
    }
    
    return (
        <S.SignInWrapper>
            <S.Form onSubmit={handleSubmit(async (data)=>{
                // console.log(data)

                // 로그인 로직
                console.log(process.env.REACT_APP_SERVER_URL);
                await fetch('https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/passportLogin', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json; charset=utf-8',
                    },
                    body : JSON.stringify({
                        userId : data.userId,
                        password : data.password
                    })
                })
                .then((res)=> {
                    if(!res.ok){
                        throw new Error('아이디 또는 비밀번호가 틀렸습니다.');
                    }
                    return res.json();
                })
                .then((res)=>{
                    // 데이터를 들고 있는 res
                    // console.log(res)

                    let {token, user} = res;
                    // console.log(token, user)

                    // Redux
                    dispatch(setUser(res.user))
                    dispatch(setUserStatus(true))

                    localStorage.setItem("token", token);
                    
                })
                .catch((error) => {
                    alert(error.message);
                });
                


            })}>
                <Link to='/'><S.LogoImage src="./images/pages/layout/logo.svg" alt="eggbnb"></S.LogoImage></Link>
                {/* 이메일 */}
                <S.Label htmlFor='userId'>
                    {/* <S.InputWrapper> */}
                        {/* <FontAwesomeIcon icon={faEnvelope} className='icon'/> */}
                        <S.Input
                            type="text" id="userId" placeholder='아이디'
                            {...register('userId', {
                                required : true,
                            })}    
                        />

                    {/* </S.InputWrapper>                     */}
                    {errors?.userId?.type === 'required' && (
                        <S.ConfirmMessage>아이디 입력해주세요</S.ConfirmMessage>
                        )}
                </S.Label>

                {/* 비밀번호 */}
                <S.Label htmlFor='password'>
                    <S.Input
                        type="password" id="password" placeholder='비밀번호'
                        {...register('password', {
                            required : true,
                        })}
                    />
                    {errors?.password?.type === 'required' && (
                        <S.ConfirmMessage>비밀번호를 입력해주세요</S.ConfirmMessage>
                    )}
                </S.Label>

                {/* submit 버튼 */}
                <S.Button disabled={isSubmitting}>로그인</S.Button>
                <Link to='/signUp'><S.Subtitle>저희 페이지가 처음이신가요?</S.Subtitle></Link>

            </S.Form>


        </S.SignInWrapper>
    );
};

export default SignInContainer;