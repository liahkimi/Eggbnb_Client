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
                <Link to='/'><S.LogoImageLittle src="./images/pages/layout/logo.svg" alt="eggbnb"></S.LogoImageLittle></Link>
            </S.SignInWrapper>
            
        )
    }
    
    return (
        <S.SignInWrapper>
            <S.Form onSubmit={handleSubmit(async (data)=>{
                console.log(data)

                // 로그인 로직
                await fetch('http://localhost:8000/user/signIn', {
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
                    console.log(res)
                    
                    // Redux
                    dispatch(setUser(res.user))
                    dispatch(setUserStatus(true))
                    
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

            {/* 네이버, 카카오, 애플 버튼 */}
            <S.Ul>
                <li><Link to='https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/'><S.Subtitle><S.IconImage src="./images/pages/signIn/naverIcon.png" alt="naverIcon"/></S.Subtitle></Link></li>
                <li><Link to='https://accounts.kakao.com/login/?continue=https%3A%2F%2Faccounts.kakao.com%2Fweblogin%2Faccount#login'><S.Subtitle><S.IconImage src="./images/pages/signIn/kakaoIcon.png" alt="kakaoIcon"/></S.Subtitle></Link></li>
                <li><Link to='https://appleid.apple.com/sign-in'><S.Subtitle><S.IconImage src="./images/pages/signIn/appleIcon.png" alt="appleIcon"/></S.Subtitle></Link></li>
            </S.Ul>

        </S.SignInWrapper>
    );
};

export default SignInContainer;