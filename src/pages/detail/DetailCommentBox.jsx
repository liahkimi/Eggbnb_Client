import React from 'react';
import S from './style';
import BasicButton from '../../components/button/BasicButton';

const DetailCommentBox = ({commentData, commentUsers, setpopup1State}) => {
    const publicUrl = process.env.PUBLIC_URL;
    const allCommentAction = () => {
        setpopup1State(true);
        let scrollY = "";
        scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = "-"+scrollY+"px";
        document.body.style.overflowY = "scroll";
        document.body.style.width = "100%";
    }
    const fewCommentArray = commentData.filter((comment,i)=> i<4).concat()
    return (
        <S.DetailCommentBox>
            <div>
                {fewCommentArray.map((comment,i)=>
                    <div key={i} className='commentCard'>
                        <div className="commentTBox">
                            <div>
                                <div className="commentImg">
                                    <img src={
                                        commentUsers.filter((user)=>user._id === comment.userId)[0].profileImg
                                        ?`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/${commentUsers.filter((user)=>user._id === comment.userId)[0].profileImg}`
                                        :`${publicUrl}/images/pages/detail/emptyUser.jpg`
                                    } alt="유저 썸네일" />
                                </div>
                                <div className="commentId">{commentUsers.filter((user)=>user._id === comment.userId)[0].userId}</div>
                            </div>
                            <div>
                                <span className='starBox'>
                                    <span className="star" style={{width: `${comment.star * 20}%`}}></span>
                                </span>
                            </div>
                        </div>
                        <div className="commentBBox">
                            <p>{comment.body}</p>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <BasicButton onClick={allCommentAction}>후기 전체보기</BasicButton>
            </div>
        </S.DetailCommentBox>
    );
};

export default DetailCommentBox;