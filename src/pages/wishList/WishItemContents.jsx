import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import S from './style';
import HeartButton from '../../components/heartbutton/HeartButton';
import Modal from './modal/Modal';
import { useDispatch } from 'react-redux';
import { setUser } from '../../modules/user';


const WishItemContents = ({rooms, userId, setUpdate, update}) => {

    const [showModal, setShowModal] = useState(false);// 모달 창의 표시 여부를 관리
    const [roomId, setRoomId] = useState(null);// 삭제할 항목의 ID를 저장
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 하트 버튼 클릭 시 '삭제 확인 모달'을 표시
    const handleRemoveItem = (data) => {
        let roomId = data; // data는 하트 버튼이 클릭된 특정 아이템의 데이터
        setRoomId(roomId);
        setShowModal(true); // 재확인 위해 '확인 모달창' 띄우기
    };

    // 모달의 확인 버튼 클릭 시 삭제를 실행
    const clickConfirmRemove = () => {
        handleConfirmRemove();
    }
    
    // 서버에 요청하여 위시리스트에서 항목을 삭제
    const handleConfirmRemove = async( ) => {
                try{
                    const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/room/updateWishList`,

                        { 
                            method : "POST",
                            headers : {
                                "Content-Type" : "application/json; charset=utf-8",
                            },
                            body : JSON.stringify({
                                roomId : roomId._id,
                                userId : userId
                            })
                        });
                    
                    // 요청이 성공하면 Redux 상태를 업데이트하고 setUpdate를 호출하여 컴포넌트를 리렌더링
                     if(response.ok){
                        const updatedRooms = await response.json();
                        // Redux 상태를 업데이트하여 사용자 정보를 최신 상태로 유지
                        dispatch(setUser(updatedRooms.user));
                        // 상태를 반전시켜 컴포넌트를 리렌더링 (이는 useEffect 훅을 재실행하여 화면을 새로 고치기 위함)
                        setUpdate(update ? false : true); 
                        // 사용자를 위시리스트 페이지로 리디렉션
                        navigate('/wishList') 
                     }else{
                        const errorData = await response.json();
                        console.error('Failed to update wishList', errorData.message || response.statusText);
                     } 
                }catch(error){
                    console.log('Error:', error);
                }
                // 업데이트 완료되어 모달 창을 닫기 위해 setShowModal(false);를 호출
                setShowModal(false);  
       
    };

    // 모달의 취소 버튼 클릭 시 모달 닫기
    const handleCancelRemove = () => {
        setShowModal(false);
    };


    return (
        
        <S.ContentBox>
            {/* 로그인한 유저의 user데이터의 wishList 데이터에 데이터가 있다면 위시리스트페이지에 아이템 보여주기*/}
            {rooms.length > 0 ? (
                rooms.map((room, i) =>
                    <div className="content" key={i}>
                        {/* 하트버튼 클릭시, 해당 아이템 삭제 기능 메서드 삽입 */}
                        <HeartButton className='heart' onClick={() => handleRemoveItem(room) } />
                        <Link onClick={() => { navigate(`/detail?roomId=${room._id}`)}}>
                            <div className="imgBox">
                                {/* 로그인한 유저의 wishList 컨텐츠 이미지 불러오기 */}
                                <img src={room.roomImg[0]} />
                            </div>
                            <div className="textBox">
                                <div>
                                    <div className="titleBox">
                                        <h6>{room.title}</h6>
                                    </div>
                                    <div className="addAndPriceBox">
                                        <span className="address">{room.address}</span> 
                                    </div>
                                </div>
                                <div>
                                    <div className="linkBox">예약하기</div>
                                    <span className="price">{"￦" + room.dayPrice.toLocaleString('ko-KR')}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            ) : (
                <div className="emptyState">
                    <p>위시리스트에 추가된 숙소가 없습니다.</p>
                    <p>검색 중에 발견한 숙소를 위시리스트에 저장하려면 하트 아이콘을 클릭하세요!💛</p>
                    <Link to={'/'}>구경하러 가기</Link>
                    <button>닫기</button>
                </div>
            )}
            {showModal && (
                <Modal
                    message="위시리스트에서 제거하시겠습니까?"
                    onCancel={handleCancelRemove}
                    onConfirm={clickConfirmRemove}
                />
            )}
        </S.ContentBox>
    );
};

export default WishItemContents;