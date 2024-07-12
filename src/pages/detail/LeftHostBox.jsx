import React from 'react';
import S from './style';

const LeftHostBox = ({profileImg, userId, commentData, starAvr, setpopup1State}) => {
    const publicUrl = process.env.PUBLIC_URL;
    const openPopup1 = () => {
        setpopup1State(true)
        let scrollY = "";
        scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = "-"+scrollY+"px";
        document.body.style.overflowY = "scroll";
        document.body.style.width = "100%";
    };
    return (
        <>
        <div className="hostBox">
            <div>
                <div className="hostImg">
                    <img src={profileImg
                        ?
                        `https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/${profileImg}`
                        :`${publicUrl}/images/pages/detail/emptyUser.jpg`
                    } alt="호스트썸네일" />
                </div>
                <div className="hostName">
                    <h6>호스트 : {userId} 님</h6>
                </div>
            </div>
            <div>
                <div className="avrStarBox">
                    <div>{commentData.length === 0? 0 : starAvr()}</div>
                    <div><S.StarBack><span style={{width: `${starAvr(commentData) * 20}%`}}></span></S.StarBack></div>
                </div>
                <div className="reviewBox" onClick={openPopup1}>
                    <div>{commentData.length}개</div>
                    <div><span>후기</span></div>
                </div>
            </div>
        </div>
        
        </>
    );
};

export default LeftHostBox;