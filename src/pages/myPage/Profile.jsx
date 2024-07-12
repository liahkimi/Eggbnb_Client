import React, { useRef, useState } from 'react';
import S from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import BasicButton from '../../components/button/BasicButton';
import { useDispatch } from 'react-redux';
import { setUser } from '../../modules/user';
import { now } from 'moment';

const Profile = ({info}) => {
    const publicUrl = process.env.PUBLIC_URL;
    const userId = info.userId;
    const cTime = new Date(info.createdAt);
    const nTime = new Date(now()); 
    const timeDiff = nTime.getTime() - cTime.getTime();
    const time = Math.ceil(timeDiff / (1000*60*60*24*12));
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [content, setContent] = useState(<></>);
    const thumbImg = (input) => {
        if(input.target.files && input.target.files[0]){
            const reader = new FileReader();
            reader.onload = (e) => {
                imgRef.current.src = e.target.result;
            };
            reader.readAsDataURL(input.target.files[0])
            setContent(<>
                <div className='submitBox'>
                    <BasicButton type="submit">적용</BasicButton>
                </div>
            </>)
        }else{
            imgRef.current.src = info.profileImg?`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/${info.profileImg}`:`${publicUrl}/images/pages/detail/emptyUser.jpg`;
            setContent(<></>);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profileImg', e.target.profileImg.files[0]);
        formData.append('userId', userId);
        uploadFetch(formData)
    }
    const uploadFetch = async (formData) => {
        try{
            const response = await fetch("https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/myPage", {
                method : "POST",
                body : formData,
            })
            const userInfo = await response.json();
            const message = userInfo.message;
            const info = userInfo.user;
            alert(message)
            console.log(info)
            dispatch(setUser(info))
            setContent(<></>)
        }catch(error){
            console.log(error)
        }
    }
    return (
        <S.Profile>
            <div className="imageBox">
                <form encType='multipart/form-data' onSubmit={handleSubmit}>
                    <label htmlFor="profileImg">
                        <div>
                            <img src={info.profileImg?
                                `https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/${info.profileImg}`
                                :`${publicUrl}/images/pages/detail/emptyUser.jpg`
                                } ref={imgRef} alt="프로필 이미지" />
                        </div>
                        <span><FontAwesomeIcon icon={faPen}/></span>
                    </label>
                    <input type="file" 
                        ref={fileInputRef} 
                        id='profileImg' 
                        name='profileImg' 
                        onChange={thumbImg}
                        accept='image/jpg, image/png, image/jpeg'
                    />
                    {content}
                </form>
                <h2>{info.name}</h2>
                <p>게스트</p>
                <h3>에그비앤비 가입 기간</h3>
                <p>{time}<span>개월</span></p>
            </div>
        </S.Profile>
    );
};

export default Profile;