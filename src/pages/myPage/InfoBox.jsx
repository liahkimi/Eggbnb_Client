import React, { useEffect, useRef, useState } from 'react';
import S from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import BasicButton from '../../components/button/BasicButton';
import PostModal from './PostModal';
import PopupPostCode from './PopupPostCode';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../modules/user';

const InfoBox = ({info}) => {
    // 로그인된 유저 id
    const currentUser = useSelector((state)=>state.user.currentUser);
    const _id = currentUser._id;
    
    const dispatch = useDispatch();
    
    // 모달창 state
    const [modalState, setModalState] = useState(false);
    // 모달제목 state
    const [title, setTitle] = useState("");
    // 모달컨텐츠 state
    const [content, setContent] = useState(<></>);
    // 모달 input 레퍼런스
    const inputRef = useRef(null);
    // 비밀번호 input 레퍼런스
    const pwRef1 = useRef(null);
    const pwRef2 = useRef(null);
    // 비밀번호 input tag 레퍼런스
    const pwTag = useRef(null);
    const pw2Tag = useRef(null);
    // 새로운 비밀번호 value state

    // 비밀번호 중복검사 state
    const [checkPwState, setCheckPwState] = useState(false);
    const [checkPwState2, setCheckPwState2] = useState(false);
    const [checkPwState3, setCheckPwState3] = useState(false);

    // 기존 비밀번호 일치여부
    const checkPw = async () => {
        try{
            await checkInfo({password : pwRef1.current.value, _id : _id}).then((result)=>{
                if(!result.message){
                    alert("비밀번호가 일치하지 않습니다!")
                    return
                }else{
                    setCheckPwState(true);
                    modifyPw2();
                }
            })
        }catch(error){
            console.log(error)
        }
    }
    // 새로운 비밀번호 정규식검사
    const regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/
    const valPw = () => {
        if(regExp.test(inputRef.current.value)){
            // 정규식 검사 통과 했을 때
            pwTag.current.className = "green"
            pwTag.current.innerText = "사용 가능한 비밀번호 입니다."
            setCheckPwState2(true);
        }else{
            // 정규식 검사 실패 했을 때
            pwTag.current.className = "red"
            pwTag.current.innerText = "8~12자리 영문 + 숫자 + 특수문자를 포함시켜주세요."
            setCheckPwState2(false);
        }
    }
    // 새로운 비밀번호 확인 검사
    const valPwCheck = () => {
        const newPw = inputRef.current.value;
        // 정규식을 통과했을 때
        if(newPw === pwRef2.current.value){
            // 비밀번호가 서로 일치할 때
            pw2Tag.current.className = "green"
            pw2Tag.current.innerText = "비밀번호가 일치합니다"
            setCheckPwState3(true)
        }else{
            // 비밀번호가 일치하지 않을 때
            pw2Tag.current.className = "red"
            pw2Tag.current.innerText = "비밀번호가 일치하지 않습니다."
            setCheckPwState3(false)
        }
    }
    
    // 이메일 중복검사 통과상태
    const [emailValidate, setEmailValidate] = useState(false);
    // 정보확인태그 레퍼런스
    const messageRef = useRef(null);
    // 이메일 정규식검사
    const valEmail = (email_address) => {
        const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return email_regex.test(email_address)
    }
    // 이메일 중복확인 이벤트
    const checkEmail = async () => {
        // input value 가져오기
        const refValue = inputRef.current.value;
        // value가 정규식검사를 통과했다면
        if(valEmail(refValue)){
            // db에서 해당 이메일을 중복검사하여 true(존재함) false(존재하지않음) 판별
            await checkInfo({email : refValue}).then((result)=>{
                // true값일 때
                if(result.message){
                    messageRef.current.className = "red"
                    messageRef.current.innerText = "이미 존재하는 이메일입니다"
                    setEmailValidate(false);
                    return
                }
                // false값일 때
                messageRef.current.className = "green"
                messageRef.current.innerText = "사용할 수 있는 이메일입니다"
                setEmailValidate(true);
            })
        // 정규식검사를 통과하지 못했을 때
        } else {
            messageRef.current.className = "red"
            messageRef.current.innerText = "유효하지 않은 이메일 주소입니다."
            setEmailValidate(false);
        }
    }
    
    // 우편번호 모달창 state
    const [postModal, setPostModal] = useState(false);
    // 우편번호 input 레퍼런스
    const post1Ref = useRef(null);
    const post2Ref = useRef(null);
    const post3Ref = useRef(null);
    // 우편번호 input3 value state
    const [post3Val, setPost3Val] = useState("");
    const changePost3Val = (e) => {
        setPost3Val(e.target.value)
    }
    // fetch로 보낼 body정보 state
    const [modify, setModify] = useState([{_id : _id}, {}]);
    

    // 수정 fetch
    const updateUserInfo = async () => {
        console.log(modify)
        try{
            const response = await fetch("https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/myPage", {
                method : "PATCH",
                body : JSON.stringify(modify),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
            })
            const userInfo = await response.json();
            const message = userInfo.message;
            const info = userInfo.user;
            alert(message)
            console.log(info)
            dispatch(setUser(info))
        }catch(error){
            console.log(error);
        }
    }
    // 중복 확인 fetch
    const checkInfo = async (props) => {
        console.log(props)
        try{
            const response = await fetch("https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/myPage", {
                method : "POST",
                body : JSON.stringify(props),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
            })
            const message = await response.json();
            console.log(message)
            return message
        }catch(error){
            console.log(error)
        }
    }

    // 이름수정 이벤트
    const modifyName = () => {
        setModify([{_id : _id}, {}])
        setModalState(true)
        console.log("name")
        setTitle("이름")
        setContent(<>
            <input type="text" ref={inputRef} placeholder='새로운 이름을 입력해주세요.'/>
        </>)
    }
    // 비밀번호수정 이벤트
    const modifyPw = () => {
        setModify([{_id : _id}, {}])
        setModalState(true)
        console.log("password")
        setTitle("비밀번호")
        setCheckPwState(false)
        setCheckPwState2(false)
        setCheckPwState3(false)
        setContent(<div className='pwInputBox'>
            <div>
                <input type="password" ref={pwRef1} placeholder='기존 비밀번호를 입력해주세요.'/>
                <BasicButton type='button' onClick={checkPw}>본인확인</BasicButton>
            </div>
        </div>)
    }
    const modifyPw2 = () => {
        setContent(<div className='pwInputBox'>
        <input type="password" ref={inputRef} onChange={valPw} placeholder='새로운 비밀번호를 입력해주세요.'/>
        <p ref={pwTag}></p>
        <input type="password" ref={pwRef2} onChange={valPwCheck} placeholder='새로운 비밀번호를 다시 한번 입력해주세요.'/>
        <p ref={pw2Tag}></p>
    </div>)
    }
    // 이메일수정 이벤트
    const modifyEmail = () => {
        setModify([{_id : _id}, {}])
        // 이메일 정규식 체크 초기화
        setEmailValidate(false);
        // 모달창 오픈
        setModalState(true)
        console.log("email")
        setTitle("이메일")
        setContent(<div className='emailInputBox'>
            <div>
                <input type="email" ref={inputRef} placeholder='새로운 이메일을 입력해주세요.'/>
                <button type='button' onClick={checkEmail}>중복확인</button>
            </div>
            <div>
                <p ref={messageRef}></p>
            </div>
        </div>)
    }
    // 연락처수정 이벤트
    const modifyPhone = () => {
        setModify([{_id : _id}, {}])
        setModalState(true)
        console.log("phone")
        setTitle("연락처")
        setContent(<>
            <input type="text" ref={inputRef} placeholder='새로운 연락처를 입력해주세요.'/>
        </>)
    }
    // 주소수정 이벤트
    const modifyAddress = () => {
        setModify([{_id : _id}, {}])
        setModalState(true)
        console.log("address")
        setTitle("주소")
        setContent(<div className='postInputBox'>
            <div><input type="text" ref={post1Ref} className='disabledPostInput' disabled={true} placeholder='우편번호'/><button type='button' onClick={openPostModal}>주소 검색</button></div>
            <div><input type="text" ref={post2Ref} className='disabledPostInput' disabled={true} placeholder='주소를 입력하세요.'/></div>
            <div><input type="text" ref={post3Ref} placeholder='상세주소를 입력해주세요.' onChange={changePost3Val}/></div>
        </div>)
    }

    // 모달창 닫기
    const closeModal = () => {
        setModalState(false);
    }
    // 주소 모달창 열기
    const openPostModal = () => {
        setPostModal(true)
    }
    // 주소 모달창 닫기
    const closePostModal = () => {
        setPostModal(false)
    }
    // 수정완료버튼 이벤트
    const subModify = () => {
        if(title === "이름"){
            // 이름 수정
            const refValue = inputRef.current.value;
            if(!refValue){
                alert("이름을 입력해주세요.")
                return
            }
            setModify(modify[1] = {name : refValue})
            updateUserInfo()
            setModalState(false)
        }else if(title === "비밀번호"){
            // 비밀번호 수정
            console.log(checkPwState)
            console.log(checkPwState2)
            console.log(checkPwState3)
            if(!checkPwState){
                alert("본인확인을 완료해주세요!")
                return
            }
            if(!checkPwState2){
                alert("비밀번호를 확인해주세요!")
                return
            }
            if(!checkPwState3){
                alert("비밀번호가 일치하지 않습니다!")
                return
            }
            setModify(modify[1] = {password : inputRef.current.value})
            updateUserInfo()
            setModalState(false)
        }else if(title === "이메일"){
            // 이메일 수정
            if(!emailValidate){
                alert("중복검사를 통과해야합니다!")
                return
            }
            setModify(modify[1] = {email : inputRef.current.value})
            updateUserInfo()
            setModalState(false)
        }else if(title === "연락처"){
            // 연락처 수정
            setModify(modify[1] = {phone : inputRef.current.value})
            updateUserInfo()
            setModalState(false)
        }else if(title === "주소"){
            // 주소 수정
            if(!post3Val){
                alert("주소를 입력해주세요!")
                return
            }
            setModify(modify[1] = {address : post2Ref.current.value + ` ${post3Val}` })
            updateUserInfo()
            setModalState(false)
        }
    }
    // 모달창 이외 클릭시 모달창 닫기
    useEffect(()=>{
        window.addEventListener("click", (e) => {
            if(e.target.className === "modifyModal"){
                setModalState(false)
            }
        })
    },[modalState])
    return (
        <>
        <S.InfoBox>
            <div className='infoBox'>
                <div>
                    <h2>실명</h2>
                    <p>{info.name}</p>
                </div>
                <div>
                    <button type='button' className='name' onClick={modifyName}>수정</button>
                </div>
            </div>
            <div className='infoBox'>
                <div>
                    <h2>비밀번호 수정</h2>
                </div>
                <div>
                    <button type='button' className='password' onClick={modifyPw}>수정</button>
                </div>
            </div>
            <div className='infoBox'>
                <div>
                    <h2>이메일</h2>
                    <p>{info.email}</p>
                </div>
                <div>
                    <button type='button' className='email' onClick={modifyEmail}>수정</button>
                </div>
            </div>
            <div className='infoBox'>
                <div>
                    <h2>연락처</h2>
                    <p>{info.phone}</p>
                </div>
                <div>
                    <button type='button' className='phone' onClick={modifyPhone}>수정</button>
                </div>
            </div>
            <div className='infoBox'>
                <div>
                    <h2>주소</h2>
                    <p>{info.address}</p>
                </div>
                <div>
                    <button type='button' className='address' onClick={modifyAddress}>수정</button>
                </div>
            </div>
        </S.InfoBox>
        {modalState?
        <div className='modifyModal'>
            <div className='modalBox'>
                <div className="modalHeader">
                    <button type='button' onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
                    <h2>{title} 수정</h2>
                </div>
                <div id='contentBox' className="modalContent">
                    {content}
                </div>
                <div className="modalFooter">
                    <BasicButton type="button" onClick={subModify}>수정</BasicButton>
                </div>
            </div>
        </div>
        :<></>}
        {postModal?
        <PostModal>
            <PopupPostCode post1Ref={post1Ref} post2Ref={post2Ref} onClose={closePostModal}/>
        </PostModal>
        :<></>}
        </>
    );
};

export default InfoBox;