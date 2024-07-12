import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import DetailGradeBox from './DetailGradeBox';

const PopupBox1 = ({title,commentData,commentUsers,popup1State,setpopup1State}) => {
    const publicUrl = process.env.PUBLIC_URL;
    const starAvr = () => {
        let number = 0;
        for(let i = 0; i < commentData.length; i++){
            number += commentData[i].star;
        }
        number = number / commentData.length;
        return number.toFixed(1);
    }
    const closePopup1 = () => {
        setpopup1State(false);
        let offset = document.body.style.top;
        document.body.style.position = "unset";
        document.body.style.top = "unset";
        document.body.style.overflowY = "unset";
        document.body.style.width = "unset";
        window.scrollTo(0, offset.slice(0,-2) * -1);
    }
    const [sortText, setSortText] = useState("최신순")
    const [sortBoxState, setSortBoxState] = useState(false);
    const openSort = () => {
        setSortBoxState(sortBoxState? false:true);
    }
    const setSort = (e) => {
        const text = e.target.innerText
        setSortText(text)
        setSortBoxState(false);
    }
    return (
        <div className='reviewContainer' style={{display : popup1State? "block":"none"}}>
            <div className="reviewBackground" onClick={closePopup1}></div>
            <div className="reviewBox">
                <div className="reviewTop">
                    <button type='button' onClick={closePopup1}><FontAwesomeIcon icon={faXmark}/></button>
                    <h6>{title} 후기</h6>
                </div>
                <div className="reviewContent">
                    <div className="contentLeft">
                        <div className="reviewAvrStarBox">{commentData.length === 0? 0 : starAvr()}</div>
                        <DetailGradeBox comment={commentData}/>
                    </div>
                    <div className="contentRight">
                        <div className="rightTop">
                            <h6>후기 : {commentData.length}개</h6>
                            <button type='button' className={`sortBtn ${sortBoxState? "active": ""}`} onClick={openSort}>{sortText}</button>
                            <div className='sortBox' style={{display : sortBoxState? "block":"none"}}>
                                <ul>
                                    <li><button type='button' onClick={setSort}>최신순</button></li>
                                    <li><button type='button' onClick={setSort}>평점높은순</button></li>
                                    <li><button type='button' onClick={setSort}>평점낮은순</button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="rightContent">
                            {commentData.sort((a,b)=>
                                // 최신순 정렬
                                sortText==="최신순"? new Date(b.date) - new Date(a.date):
                                // 평점높은순 정렬
                                sortText === "평점높은순"? b.star - a.star:
                                // 평점낮은순 정렬
                                a.star - b.star
                            ).map((comment,i)=>
                                <div className="userComment" key={i}>
                                    <div className="commentTop">
                                        <div className="commentTL">
                                            <div className="userProfileImg">
                                                <img src={commentUsers.filter((user)=>user._id===comment.userId)[0].profileImg
                                                    ?`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/${commentUsers.filter((user)=>user._id===comment.userId)[0].profileImg}`
                                                    :`${publicUrl}/images/pages/detail/emptyUser.jpg`
                                                } alt={`userProfileImg${i+1}`} />
                                            </div>
                                            <div className="userId">{commentUsers.filter((user)=>user._id === comment.userId)[0].userId}</div>
                                        </div>
                                        <div className="commentTR">
                                            <span className='starBox'>
                                                <span className="star" style={{width: `${comment.star * 20}%`}}></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="commentBody">{comment.body}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupBox1;