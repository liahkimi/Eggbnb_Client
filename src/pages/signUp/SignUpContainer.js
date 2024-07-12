import React, { useRef, useState } from 'react';
import S from './style';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import RemoveHeader from '../layout/RemoveHeader';
import InfoBox from './InfoBox';
import { useSelector } from 'react-redux';
import ScrollEvent from '../layout/ScrollEvent';

const SignUpContainer = () => {

    RemoveHeader();
    ScrollEvent();

    // 회원가입 완료 시 로그인 페이지로 바로 이동시켜주기 위해
    const navigate = useNavigate();

    const currentUser = useSelector((state)=>state.user.currentUser);
    const userStatus = useSelector((state)=>state.user.isLogin);
    // 현재 로그인 상태를 확인하여 아닌 경우
    if(userStatus){
        // replace 왔던 기록을 없애버린다. history
        alert("로그아웃 상태여야 합니다")
        navigate('/')
    }


    const {register, handleSubmit, getValues,
        formState : {isSubmitting, isSubmitted, errors}
    } = useForm({mode: "onChange"})

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;
    const phoneRegex = /^01([0|1|6|7|8|9])-[0-9]{4}-[0-9]{4}$/;

    // 주소 상태 관리
    const [address, setAddress] = useState('');

    
    // 이메일 중복확인
    async function checkEmail(e) {

        // submission 되지 않도록
        e.preventDefault();
        // 추가된 코드, 이메일 값을 가져오기
        const emailValue = getValues('email');

        const result = await checkEmailInfo({ email: emailValue });
        if (result.message) {
            result.message = "이미 존재하는 이메일입니다";
            alert(result.message);
        } else {
            result.message = "사용할 수 있는 이메일입니다";
            alert(result.message);
        }

    }

    
    // 유저아이디 중복확인
    async function checkUserId(e) {

        // submission 되지 않도록
        e.preventDefault();
        // 추가된 코드, 이메일 값을 가져오기
        const userIdValue = getValues('userId');
    
        const result = await checkUserIdInfo({ userId: userIdValue });
        if (result.message) {
            alert("이미 존재하는 아이디입니다");
        } else {
            alert("사용할 수 있는 아이디입니다");
        }
    
    }
    

    // 이메일 중복 확인 fetch
    const checkEmailInfo = async (props) => {
        console.log(props)
        try{
            const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/checkEmail`, {
                method : "POST",
                body : JSON.stringify(props),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
            })
            // 주석된 코드
            const message = await response.json();
            console.log(message)
            return message
        }catch(error){
            console.log(error)
        }
    }


    
    // 유저아이디 중복 확인 fetch
    const checkUserIdInfo = async (props) => {
        console.log(props)
        try{
            const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/checkUserId`, {
                method : "POST",
                body : JSON.stringify(props),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
            })
            const result = await response.json();
            return result;
        }catch(error){
            console.log(error)
        }
    }
    



    return (
        <S.SignUpWrapper>
            <S.Form onSubmit={handleSubmit(async (data)=>{
                console.log(data)

                //회원가입 로직
                await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/signUp`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        userId : data.userId,
                        name : data.name,
                        email : data.email,
                        password : data.password,
                        address : data.address,
                        phone : data.phone
                    })
                })
                .then((res)=>res.json())
                .then((res)=>{
                    if(res.registerSuccess){
                        alert(res.message)
                    }
                    // 회원가입 막기 , 페이지 그대로 유지
                    navigate('/signUp')
                })
                .catch(alert("아이디나 이메일의 중복을 확인해주세요"))

            })}>

                <S.LogoImage src="./images/pages/layout/logo.svg" alt="eggbnb"></S.LogoImage>
                
                {/* 유저아이디 */}
                <S.Label htmlFor='userId'>
                    <S.TypeTwoContainer>
                        <S.TypeTwoInput
                            type="text" id="userId"
                            placeholder='아이디'
                            {...register('userId', {
                                required : true,
                                
                            })}
                        />
                        <S.LittleButtonBox>
                            <S.LittleButton onClick={checkUserId}>중복확인</S.LittleButton>
                        </S.LittleButtonBox>
                    </S.TypeTwoContainer>
                    {errors?.userId?.type === 'required' && (
                        <S.ConfirmMessage>아이디를 입력해주세요</S.ConfirmMessage>
                    )}
                </S.Label>

                {/* 이름 */}
                <S.Label>
                    <S.Input
                        type="text" id="name"
                        placeholder='이름'
                        {...register('name', {
                            required : true,
                            
                        })}
                    />
                    {errors?.name?.type === 'required' && (
                        <S.ConfirmMessage>이름을 입력해주세요</S.ConfirmMessage>
                    )}

                </S.Label>

                <S.Label htmlFor='email'>
                    <S.TypeTwoContainer>
                        <S.TypeTwoInput
                            type="text" id="email" placeholder='이메일 주소'
                            {...register('email', {
                                required : true,
                                pattern : {
                                    value : emailRegex
                                }
                            })}
                        />
                        <S.LittleButtonBox>
                            <S.LittleButton onClick={checkEmail}>중복확인</S.LittleButton>
                        </S.LittleButtonBox>
                    </S.TypeTwoContainer>
                    {errors?.email?.type === 'required' && (
                        <S.ConfirmMessage>이메일을 입력해주세요</S.ConfirmMessage>
                    )}
                    {errors?.email?.type === 'pattern' && (
                        <S.ConfirmMessage>이메일 양식에 맞게 입력해주세요</S.ConfirmMessage>
                    )}
                </S.Label>

                {/* 비밀번호 */}
                <S.Label htmlFor='password'>
                    <S.Input
                        type="password" id="password" placeholder='비밀번호(영문 소문자 숫자 특수문자 조합 8자리 이상)'
                        {...register('password', {
                            required : true,
                            pattern : {
                                value : passwordRegex
                            }
                        })}
                    />
                    {errors?.password?.type === 'required' && (
                        <S.ConfirmMessage>비밀번호를 입력해주세요</S.ConfirmMessage>
                    )}
                    {errors?.password?.type === 'pattern' && (
                        <S.ConfirmMessage>소문자, 숫자, 특수문자를 각 하나씩 포함한 8자리 이상이어야 합니다.</S.ConfirmMessage>
                    )}
                </S.Label>

                {/* 비밀번호 확인 */}
                <S.Label htmlFor="passwordConfirm">
                    <S.Input
                        type="password" id="passwordConfirm"
                        placeholder='비밀번호 확인'
                        {...register("passwordConfirm", {
                            required : true,
                            validate : {
                                matchPassword : (value) => {
                                    const {password} = getValues();
                                    console.log(value, password, value === password)
                                    return value === password;
                                }
                            }
                        })}
                    />
                    {errors?.passwordConfirm && (
                        <S.ConfirmMessage>비밀번호를 확인해주세요</S.ConfirmMessage>
                    )}

                </S.Label>

                 {/* 핸드폰 번호 */}
                 <S.Label>
                    <S.Input
                        type="text" id="phone"
                        placeholder='핸드폰 번호(-포함)'
                        {...register('phone', {
                            required : true,
                            pattern : {
                                value : phoneRegex
                            }
                            
                        })}
                    />
                    {errors?.phone?.type === 'required' && (
                        <S.ConfirmMessage>핸드폰 번호를 입력해주세요</S.ConfirmMessage>
                    )}
                    {errors?.phone?.type === 'pattern' && (
                        <S.ConfirmMessage>핸드폰 양식에 맞게 입력해주세요</S.ConfirmMessage>
                    )}

                </S.Label>

                {/* 주소 */}
                <S.Label>
                    <S.TypeTwoContainer>
                        <S.TypeTwoInput
                            type="text" id="address"
                            placeholder='주소' value={address} readOnly
                            {...register('address', {
                                required: false,
                            })}
                        />
                        <S.MyPageContainer>
                            <div className='infoWrapper'>
                                <InfoBox setAddress={setAddress} info={currentUser} />
                            </div>
                        </S.MyPageContainer>
                    </S.TypeTwoContainer>
                </S.Label>


                {/* submit 버튼 */}
                <S.Button disabled={isSubmitting}>회원가입</S.Button>

                {/* 로그인 페이지로 */}
                <Link to='/signIn'><S.Subtitle>이미 회원이신가요?</S.Subtitle></Link>


            </S.Form>
        </S.SignUpWrapper>
    );
};

export default SignUpContainer;