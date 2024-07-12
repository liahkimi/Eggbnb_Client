import React, { useEffect, useState } from 'react';
import ResetHeader from '../layout/ResetHeader';
import S from './style';
import { useSearchParams } from 'react-router-dom';
import TitleBox from './TitleBox';
import ImageSlide from './ImageSlide';
import LeftContentBox from './LeftContentBox';
import RightContentBox from './RightContentBox';
import DetailGradeBox from './DetailGradeBox';
import DetailCommentBox from './DetailCommentBox';
import DetailMapBox from './DetailMapBox';
import ScrollEvent from '../layout/ScrollEvent';
import PopupBox1 from './PopupBox1';
import ImageModal from './ImageModal';

const DetailContainer = () => {
    ResetHeader();
    ScrollEvent();
    const [searchParams] = useSearchParams();
    const [room, setRoom] = useState({});
    const [user, setUser] = useState({});
    const [comment, setComment] = useState({});
    const [commentUsers, setCommentUsers] = useState({});
    const [popup1State, setpopup1State] = useState(false);
    const [imgModalState, setImgModalState] = useState(false);
    useEffect(()=>{
        const getRoomAndUserList = async () => {
            const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/room/detail?${searchParams}`);
            const data = response.json();
            return data;
        };
        getRoomAndUserList()
        .then((data) => {
            setRoom(data.room);
            setUser(data.user);
            setComment(data.comment);
            setCommentUsers(data.commentUsers);
        });
    },[searchParams])
    const {title, roomImg, _id, dayPrice, cleanVat, address, roomSchedule} = room;
    const starAvr = () => {
        let total = 0;
        for(let i = 0; i<comment.length; i++){
            total += comment[i].star;
        }
        total = total/comment.length
        return total.toFixed(1);
    }
    return (
        <S.DetailContainer>
            <S.DetailWrapper>
                {roomImg&&
                <>
                <TitleBox title={title}/>
                <ImageSlide img={roomImg} setImgModalState={setImgModalState}/>
                <S.DetailContentBox>
                    <LeftContentBox 
                        contentData={room} 
                        hostData={user} 
                        commentData={comment}
                        starAvr={starAvr}
                        setpopup1State={setpopup1State}
                    />
                    <RightContentBox room={room}/>
                </S.DetailContentBox>
                <DetailGradeBox comment={comment}/>
                <DetailCommentBox 
                commentData={comment}
                commentUsers={commentUsers}
                setpopup1State={setpopup1State}/>
                <DetailMapBox address={address}/>
                <PopupBox1 title={title} 
                commentData={comment} 
                commentUsers={commentUsers} 
                popup1State={popup1State} 
                setpopup1State={setpopup1State}
                />
                {imgModalState?<ImageModal roomImg={roomImg} setImgModalState={setImgModalState}/>:<></>}
                </>
                }
            </S.DetailWrapper>
        </S.DetailContainer>
    );
};

export default DetailContainer;