import React, { useEffect, useState } from 'react';
import S from './style';
import WishItemContents from './WishItemContents';
import ResetHeader from '../layout/ResetHeader';
import ScrollEvent from '../layout/ScrollEvent';
import Modal from './modal/Modal';
import { Navigate, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import NeedLogin from '../../components/needLogin/NeedLogin';



const WishListContainer = () => {

    ResetHeader();
    ScrollEvent();
    
    const navigate = useNavigate();
    const userStatus = useSelector((state) => state.user.isLogin); // 유저의 로그인 상태 (from redux)
    const userId = useSelector((state)=> state.user.currentUser.userId); // 현재 로그인한 유저의 id (from redux)
    const [rooms, setRooms] = useState([]); // 사용자가 찜한 숙소 목록을 저장
    const [isWished, setIsWished] = useState(null); // 용자가 위시리스트에 항목이 있는지 여부를 저장
    // isWished=null(null은 값이 아직 설정되지 않았음을 의미 => 로딩중 표현)
    // isWished=false(false는 특정 조건이 충족되지 않음을 의미=> wishList가 없어서 모달창 띄우기)
    const [update, setUpdate] = useState(true); //위시리스트가 갱신될 때 상태를 트리거하는 변수


    // 컴포넌트가 마운트되거나 userId, update가 변경될 때 실행
    useEffect(()=> {
        // 새로고침할 때, Modal창 잠깐 뜨는 것 방지
        if(!userStatus) {
            return;
        }
        const getWishList = async () => {
            try{
                const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/room/wishList`,{
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        userId : userId
                    })
                })

                const data = await response.json();

                //데이터가 성공적으로 로드되면 rooms와 isWished 상태를 업데이트
                if(data && data.rooms) { // data.rooms = user.wishList
                    setRooms(data.rooms);
                    //찜한 숙소가 1개 이상이면 모달창 안 띄우기 위한 isWished 상태 설정
                    setIsWished(data.rooms.length > 0); 
                }else{
                    // 데이터가 없을경우, isWished false로
                    setIsWished(false); 
                }
            }catch(error){
                console.error("Error fetching wishList:", error);
                setIsWished(false); // 에러 발생 시에도, isWished false로 
            }
        };
        getWishList()
    },[userId, update]) // update값이 변경되면 useEffect 재실행!



    return (
        <S.WishListContainer>
            {/* 유저가 로그인 상태인 경우, */}
            {userStatus?
            <>
                <S.PageTitle>위시리스트</S.PageTitle>
                {/* isWished가 null이면 로딩 상태를 표시 */}
                {isWished === null ? (
                    <div></div>
                    // isWished가 true이면 위시리스트 항목들을 표시
                    ) : isWished ?  (
                        <WishItemContents rooms={rooms} userId={userId} setUpdate={setUpdate} update={update}/>
                    ): (
                        // isWished가 false이면 모달 창을 표시하여 위시리스트가 비어 있음을 알림
                        <div>
                            <Modal showButtons={false}>
                                <div className='modalDecorate'>
                                    <div className='modalBody'>
                                        <img src="./images/pages/wishList/NotWished1.png" alt="숙소사진" />
                                        <h2>마음에 드는 숙소를 한곳에 저장해보세요!</h2>
                                        <h3>검색 중에 발견한 숙소를 위시리스트에 저장하려면<br /> 하트 아이콘을 클릭해보세요.</h3>
                                    </div>
                                    <button className="searchButton"onClick={() => navigate('/')}>숙소 검색하러 가기</button>
                                </div>
                            </Modal>
                        </div>
                    )} 
            </>
            :
            // 현재 로그인 상태를 확인하여 아닌 경우
            // 로그인 필요를 알리는 NeedLogin 컴포넌트를 렌더링
            <>
                <NeedLogin />
            </>
            }
        </S.WishListContainer>
    );
};

export default WishListContainer;
