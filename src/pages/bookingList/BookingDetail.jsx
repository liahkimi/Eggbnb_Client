import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import BasicButton from '../../components/button/BasicButton';
import S from './style';
import KakaoMap from '../../components/kakaomap/KakaoMap.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCircleInfo, faHandHoldingDollar, faLocationDot, faPhone, faReceipt } from '@fortawesome/free-solid-svg-icons';
import Modal from './modal/Modal.jsx';
import { useDispatch } from 'react-redux';


const BookingDetail = ({item, isActive, index,setItemData, itemData, update, setUpdate}) => {

    
    const[isHovered, setIsHovered] = useState(false); // 마우스 호버 상태를 표시하는 데 사용
    const[isHovered2,setIsHovered2] = useState(false);
    
    const stayStartDate = new Date(item.checkInDate); // 체크인 날짜
    const stayEndDate = new Date(item.checkOutDate); // 체크아웃 날짜
    const timeDiff = Math.abs(stayEndDate.getTime() - stayStartDate.getTime()); 
    const stayPeriod = Math.ceil(timeDiff / (1000 * 3600 *24)); // 숙박기간
    const sub = Math.round((item.roomId.dayPrice*stayPeriod) + item.roomId.cleanVat) 
    const serviceVat = sub * 0.1;
    const total = sub + serviceVat;// 총 지불할 금액

    const [roomId, setRoomId] = useState(null); //삭제할 숙소의 ID 저장
    const [showModal, setShowModal] = useState(false);// 모달 창의 표시 여부를 관리
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}월 ${day}일`;
    }

    // 체크인 시간 문자열에서 오후 4:00만 추출하는 함수
    const extractCheckInTime = (timeString) => {
        // 시간 문자열에서 ":"를 기준으로 분리
        const parts = timeString.split(':')[1];
        const partsForTime = parts.split(' ');
        const pm = partsForTime[1];
        const time = partsForTime[2];

        if (pm === "오후") {
            return `오후 ${time}시`;
        }
            return timeString;
    };

    // 체크아웃 문자열 추출 함수
    const extractCheckOutTime = (timeString) => {
        // 시간 문자열에서 ":"를 기준으로 분리
        const parts = timeString.split(' ');
        const amPm = parts[2]; // 오후
        const part = parts[3]  // 4:00~9:00
        const partsForTime = part.split(':');
        const time = partsForTime[0]; //4
    
        if (amPm === "오전") {
            return `오전 ${time}시`;
        }
            return timeString; 
    };

    //  onClickCopy 함수를 통해 주소를 클립보드에 복사하는 기능을 구현
    const onClickCopy = async (text) => {
        try {
          await navigator.clipboard.writeText(text);
          alert('주소가 복사되었습니다!');
        } catch (e) {
          alert('주소 복사에 실패했습니다🥲');
        }
      };

      // 원화 단위 화폐 포맷팅 (1,000단위 콤마 찍기)
      const coma = (prop) => {
        const result = prop.toLocaleString('ko-KR');
        return result;
    }

    const handleRemoveItem = (data) => {
        let roomId = data;
        setRoomId(roomId);
        setShowModal(true);
    }

    // 모달의 확인 버튼 클릭 시 삭제를 실행
    const clickConfirmRemove = () => {
        handleConfirmRemove();
    }

       

    // cancleBooking함수를 통해 예약취소버튼 클릭시 예약내역에서 사라지는 기능 구현
    const handleConfirmRemove =  async() => {
        
        try{ const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/booking/updateBookingList`,
                { 
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json; charset=utf-8",
                    },
                    body : JSON.stringify({
                        roomId : roomId._id,
                    })
                });
            
            // 요청이 성공하여 정상적으로 삭제되었다면,
             if(response.ok){
                // 상태를 반전시켜 컴포넌트를 리렌더링 (이는 useEffect 훅을 재실행하여 화면을 새로 고치기 위함)
                setUpdate(update ? false : true); 

                // 사용자를 bookingList 페이지로 리디렉션
                navigate('/bookingList') 
                
             }else{
                const errorData = await response.json();
                console.error('Failed to update wishList', errorData.message || response.statusText);
             } 

        }catch(error){
                console.log('Error:', error);
            }
        // 업데이트 완료되어 모달 창을 닫기 위해 setShowModal(false);를 호출
        setShowModal(false);  
    }



     // 모달의 취소 버튼 클릭 시 모달 닫기
     const handleCancelRemove = () => {
        setShowModal(false);
    };



    return (
    <S.bookingDetailWrapper className={isActive ? 'active' : ''} >
        {/* 좌측 지도api */}
        <div className="mapBox">
                <div className="howToGo">
                    <div className="iconPort">
                        <FontAwesomeIcon icon={faLocationDot} />
                    </div>
                    <div className='textArea'>
                        <h4 className="textBox">
                            찾아가는 방법
                        </h4>
                        <h5 className="detailAddress">
                            주소 : {item.roomId.address}
                        </h5>
                    </div>
                </div>
                <button className='iconCopy'onClick={()=>onClickCopy(item.roomId.address)}>
                    <img src="./images/pages/bookingList/copy.svg" alt="copy"/>
                    <h5>주소 복사</h5>
                </button>
                    <KakaoMap props={item.roomId.address} index={index} />
            </div>
        {/* 우측 예약 상세 내역*/}
        <div className="infoBox">
            {/* 좌측 칸 */}
            <div className='leftBox'>
                {/* 숙박 일정 */}
                <div className='scheduleWrapper'>
                        <div className='title'>
                            <FontAwesomeIcon icon={faCalendarDays}/>
                            <h3>숙박 일정</h3>
                        </div>
                        <div className='data'>
                            <div className='checkInBox'>
                                <h5 className='checkIn'>체크인</h5>
                                <h5 className='checkInDate'>{`${formatDate(item.checkInDate)}`}&#160;&#160;&#160;{extractCheckInTime(item.roomId.notice[0][0].content)}</h5> 
                                {/* item.roomId.notice[0][0] */}
                            </div>
                            <div className='checkOutBox'>
                                <h5 className='CheckOut'>체크아웃</h5>
                                <h5 className='checkOutDate'>{`${formatDate(item.checkOutDate)}`}&#160;&#160;&#160;{extractCheckOutTime(item.roomId.notice[0][1].content)}</h5>
                            </div>
                            <div className='headCountBox'>
                                <h5 className='headCount'>인원</h5>
                                <h5 className='headContNum'>게스트 {item.guests}명,&#160;&#160;&#160;유아 {item.infants}명</h5>
                            </div>
                        </div>
                    </div>

                {/* 호스트 연락처 */}
                <div className='hostContactWrapper'>
                        <div className='title'>
                        <FontAwesomeIcon icon={faPhone}/>
                            <h3>호스트 연락처</h3>
                        </div>
                        <div className='data'>
                            <h5>{`${item.roomId.userId.name} | ${item.roomId.userId.phone}`}</h5>
                        </div>
                </div>
                {/* 체크인 방법 */}
                <div className='checkInTipWrapper'>
                        <div className='title'>
                            <FontAwesomeIcon icon={faCircleInfo}/>
                            <h3>숙소 정보</h3>
                        </div>
                        <div className='data'>
                            <ul className='tipList'>
                                {/* 고정 */}
                                <li className='tipOne'>
                                도어락 셀프 체크인<br />비밀번호는 호스트가 문자로 전달 
                                </li> 
                                <li className='tipTwo'>
                                  {item.roomId.convenience[0].con}
                                </li>
                            </ul>
                        </div>
                    </div>
            </div>
            {/* 우측 칸 */}
            <div className='rightBox'>
                {/* 요금 상세 내역 */}
                <div className='chargeWrapper'>
                    <div className='title'>
                    <FontAwesomeIcon icon={faReceipt}/>
                        <h3>요금 상세 내역</h3>
                    </div>
                    <div className='data'>
                        <div className='calc'>
                            <span>₩{coma(item.roomId.dayPrice)} x {stayPeriod}박</span><span>₩{coma(item.roomId.dayPrice*stayPeriod)}</span>
                        </div>
                        <div className='calc'>
                            <span>청소비</span><span>￦ {coma(item.roomId.cleanVat)}</span>
                        </div>
                        <div className='calc'>
                            <span>서비스 수수료</span><span>￦ {coma(serviceVat)}</span>
                        </div>
                        {/* 구분선 */}
                        <div className='divisionLine'></div>
                        <div className='sum'>
                            <span>총 합계</span>
                            <span className='sumPrice'>￦ {coma(total)}</span>
                        </div>
                    </div>   
                </div>
                {/* 환불 정책(고정) */}
                <div className='refundPolicyWrapper'>
                    <div className='title'> 
                        <FontAwesomeIcon icon={faHandHoldingDollar}/>
                        <h3>환불 정책</h3>
                    </div>
                    <p>
                    체크인 시간인 {formatDate(item.checkInDate)} 오후 3:00 전에 
                    취소하시면,부분 환불을 받으실 수 있습니다. 그 이후에 취소하시면 예약 대금이 환불되지 않습니다.
                    <br />숙박 도중 예약 취소를 원하신다면, 호스트에게 문제 해결을 요청하실 수 있도록 에어비앤비에서 도와드리겠습니다. 
                    게스트는 호스트에게 문제 시정, 부분 환불 또는 예약 취소 및 전액 환불을 요청할 수 있습니다. 
                    </p>
                </div>
                {/* 예약 취소 버튼 */}
                <div className="cancelBooking">
                        <BasicButton  onClick ={() => handleRemoveItem(item.roomId)} onMouseEnter={() => setIsHovered2(true)} onMouseLeave={() => setIsHovered2(false)}>
                            <div>
                                <Link onClick={(e)=> e.preventDefault}><img src = { isHovered2 ? "./images/pages/bookingList/xCircle.svg" : "./images/pages/bookingList/xCircle_y.svg"} alt="home"/>예약 취소하기</Link> 
                            </div>
                        </BasicButton> 
                </div>
                {/* 숙소 페이지로 이동 버튼 */}
                <div className="navToDetailPage">
                        <BasicButton  onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                            <div>
                                <Link to={`/detail?roomId=${item.roomId._id}`}><img src = { isHovered ? "./images/pages/bookingList/home.svg" : "./images/pages/bookingList/home_y.svg"} alt="home"/>숙소 페이지로 이동</Link> 
                            </div>
                        </BasicButton> 
                </div>
            </div>
            
        </div>
        {showModal && (

                <Modal
                    message={
                        <>
                          예약 취소를 진행하시겠습니까?<br />
                          취소 후에는 복구가 불가능합니다.
                        </>
                    }
                    onCancel={handleCancelRemove}
                    onConfirm={clickConfirmRemove}
                />
            )} 
    </S.bookingDetailWrapper >
    );
};

export default BookingDetail;