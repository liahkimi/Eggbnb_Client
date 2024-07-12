import React, { useEffect, useRef, useState } from 'react';
import S from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBath, faBed, faHouse, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import BasicButton from '../../../components/button/BasicButton';



const ModalFilterBox = ({ searchParams, setSearchParams, isFilterActivate, handleFilterStatus, setMaxPage, setSearchResultMessage, setRoomsCount }) => {

    // 필터창에서 URI 변경 전
    const [ beforeUri ] = useState("");

    const currentPage = +useParams().currentPage;

    const getKey = searchParams.get('cate') ?? "searchResult"; // 카테고리 params 가져오기
    const getPrice = [searchParams.get("lPrice") ?? 0, searchParams.get("gPrice") ?? 1000000]; // 가격범위 params 가져오기
    const getMaxUser = searchParams.get("maxUser") ?? 0; // 최대인원 params 가져오기
    const getBedroom = searchParams.get("bedroom") ?? 0; // 침실 params 가져오기
    const getBed = searchParams.get("bed") ?? 0; // 침대 params 가져오기
    const getBathroom = searchParams.get("bathroom") ?? 0; // 욕실 params 가져오기
    const val = searchParams.get("val") ?? "";
    const sdate = searchParams.get("sdate") ?? new Date();
    const edate = searchParams.get("edate") ?? new Date();
    const guests = searchParams.get("guests") ?? 0;

    const [value, setValue] = useState([getPrice[0], getPrice[1]]); // 가격범위 초기세팅을 params로 세팅
    const [filterValue, setFilterValue] = useState([getPrice[0], getPrice[1]]);
    const [maxUser, setMaxUser] = useState(getMaxUser); // 최대인원 초기세팅을 params로 세팅
    const [bedroom, setBedroom] = useState(getBedroom); // 침실 초기세팅을 params로 세팅
    const [bed, setBed] = useState(getBed); // 침대 초기세팅을 params로 세팅
    const [bathroom, setBathroom] = useState(getBathroom); // 욕실 초기세팅을 params로 세팅
    const val0Ref = useRef(0); // 최소가격 input 참조
    const val1Ref = useRef(0); // 최대가격 input 참조
    const numBoxRef = useRef(0); // 최대인원박스 참조
    const bedroomBoxRef = useRef(0); // 최대침실박스 참조
    const bedBoxRef = useRef(0); // 최대침대박스 참조
    const bathroomBoxRef = useRef(0); // 최대욕조박스 참조

    // 임시 최대 페이지 저장
    const [ tempMaxPage, setTempMaxPage ] = useState(0);
    // 임시 숙소 개수 저장
    const [ tempContentCount, setTempContentCount ] = useState(0);

    const navigate = useNavigate();

    // 변경되는 쿼리스트링 담아줄 변수
    const [ finishUrl, setFinishUrl ] = useState();

    // 페이지 당 보일 숙소 총 개수
    const contentPerPage = 18;


    const setVal = () => { // 가격범위 값 조건 함수
        setValue([val0Ref.current.value, val1Ref.current.value]); // 가격범위 값을 참조 input값으로 설정
        setFilterValue([val0Ref.current.value, val1Ref.current.value]);
    }

    const numberBtnClick = (e) => { // 최대 인원 버튼 조건 함수
        setMaxUser(e.target.value); // 클릭한 radio의 value값으로 최대 인원 조건 세팅
    }

    const bedroomBtnClick = (e) => { // 최대 침실 버튼 조건 함수
        setBedroom(e.target.value); // 클릭한 radio의 value값으로 최대 침실 조건 세팅
    }

    const bedBtnClick = (e) => { // 최대 침대 버튼 조건 함수
        setBed(e.target.value); // 클릭한 radio의 value값으로 최대 침대 조건 세팅
    }

    const bathroomBtnClick = (e) => { // 최대 욕실 버튼 조건 함수
        setBathroom(e.target.value); // 클릭한 radio의 value값으로 최대 욕실 조건 세팅
    }

    const resetCondition = () => { // 조건 리셋 함수
        setValue([0,1000000]); // 가격조건 0 , 100만으로 초기화
        setMaxUser(0); // 최대인원 0으로 초기화
        numBoxRef.current.children[0].checked = true; // 최대인원 "상관없음" 체크
        setBedroom(0); // 최대침실 0으로 초기화
        bedroomBoxRef.current.children[0].checked = true; // 최대침실 "상관없음" 체크
        setBed(0); // 최대침대 0으로 초기화
        bedBoxRef.current.children[0].checked = true; // 최대침대 "상관없음" 체크
        setBathroom(0); // 최대욕실 0으로 초기화
        bathroomBoxRef.current.children[0].checked = true; // 최대욕실 "상관없음" 체크
    }

    const viewFiltered = () => {
        // 임시로 넣어둔 맥스 페이지 maxPage에 업데이트
        setMaxPage(tempMaxPage);
        // 임시 숙소 개수 업데이트
        setRoomsCount(tempContentCount);

        // 조건 초기화
        resetCondition();
        // 모달 닫기
        handleFilterStatus();

        // 숙소보기 버튼 누르면 1페이지로 초기화
        navigate(finishUrl);
    }

    // 필터창 닫기
    const filterClose = (e) => {
        if (e.target.classList.contains("filterBg") || e.currentTarget.className.includes("closeBtn")) {
            // filter 상태 false로 전환
            handleFilterStatus();

            // 변경한 URI 값 초기화
            setSearchParams(beforeUri);
            
            // 조건 초기화
            resetCondition();
        }
    };


    // 필터 데이터 선택할 때마다 숙소 개수 업데이트
    useEffect(() => {
        if (isFilterActivate) {
            const params = {
                    cate: getKey, val: val, sdate: sdate, edate: edate, guests: guests, lPrice: value[0], gPrice: value[1], 
                    maxUser: maxUser, bedroom: bedroom, bed: bed, bathroom: bathroom, page: currentPage
            }

            // 숙소 요청
            const getRoomList = async () => {
                const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/room/search`, 
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({ ...params })
                    }
                );
                const rooms = await response.json();
                
                return rooms;
            };
            getRoomList()
            .then((res) => {
                if (!res.searchResult) {
                    // 검색결과 없거나 서버와 통신 안된다는 메시지 받아서 설정
                    setSearchResultMessage(res.message);
                } else {
                    // 페이지 당 표시할 숙소로 나눠서 임시 최대 페이지 설정
                    setTempMaxPage(Math.floor(res.roomsCount / (contentPerPage + 1) + 1));

                    // body 스크롤 초기화
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                // 숙소 전체 결과 개수
                setTempContentCount(res.roomsCount);

                // 숙소보기 버튼 누르기 전 쿼리스트링 업데이트
                const finishParams = createSearchParams(params);
                setFinishUrl(`1/?${finishParams}`);
            })
            .catch((err) => {
                console.error(err);
            });

        }
    }, [isFilterActivate, filterValue, maxUser, bedroom, bed, bathroom, guests, edate, getKey, sdate, setSearchResultMessage, val, currentPage]);



    return (
        <S.ModalFilter className={ isFilterActivate ? "filterBg" : "" } onClick={filterClose}>
            <S.Popup>
                <div className="filterHeader">
                    <div className="closeBtn" onClick={filterClose}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                    <h6>필터</h6>
                </div>

                <div className="filterListBox">
                    <div className="priceFilter">
                        <h6>가격 범위</h6>
                        <RangeSlider
                            className="range-slider-yellow"
                            value={value}
                            onInput={setValue}
                            onThumbDragEnd={setVal}
                            rangeSlideDisabled={true}
                            min={0}
                            max={1000000}
                            step={1000}
                        />
                        <div className="priceText">
                            <div>
                                <span>최소</span>
                                <input type="text" ref={val0Ref} onChange={setVal} value={value[0]}/>
                            </div>
                            <div>
                                <span>최대</span>
                                <input type="text" ref={val1Ref} onChange={setVal} value={value[1]}/>
                            </div>
                        </div>
                    </div>

                    <div className="roomFilter">
                        <h6>기타 조건</h6>
                        <div className="filterList">
                            <ul>
                                <li>
                                    <p><FontAwesomeIcon icon={faUser}/>최대 인원</p>
                                    <div className='numberBtnBox' ref={numBoxRef}>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={1} label={"1"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={2} label={"2"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={3} label={"3"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={4} label={"4"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={5} label={"5"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={6} label={"6+"}/>
                                    </div>
                                </li>
                                <li>
                                    <p><FontAwesomeIcon icon={faHouse}/>침실</p>
                                    <div className='numberBtnBox' ref={bedroomBoxRef}>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={1} label={"1"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={2} label={"2"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={3} label={"3"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={4} label={"4"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={5} label={"5"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={6} label={"6+"}/>
                                    </div>
                                </li>
                                <li>
                                    <p><FontAwesomeIcon icon={faBed}/>침대</p>
                                    <div className='numberBtnBox' ref={bedBoxRef}>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={1} label={"1"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={2} label={"2"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={3} label={"3"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={4} label={"4"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={5} label={"5"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={6} label={"6+"}/>
                                    </div>
                                </li>
                                <li>
                                    <p><FontAwesomeIcon icon={faBath}/>욕실</p>
                                    <div className='numberBtnBox' ref={bathroomBoxRef}>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={1} label={"1"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={2} label={"2"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={3} label={"3"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={4} label={"4"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={5} label={"5"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={6} label={"6+"}/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bottomBox">
                    <div className="filterRemoveBox">
                        <button type='bottom' className='filterRemoveBtn' onClick={resetCondition}>전체 해제</button>
                    </div>
                    <div className="filterSubmitBox">
                        <BasicButton className='filterSubmitBtn' onClick={viewFiltered}>숙소 {tempContentCount}개 보기</BasicButton>
                    </div>
                </div>
            </S.Popup>
        </S.ModalFilter>
    );
};

export default ModalFilterBox;