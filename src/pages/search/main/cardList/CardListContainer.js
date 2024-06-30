import React, { useEffect, useRef } from 'react';
import S from './style';
import CardListComponents from './CardListComponents';
import PaginationComponents from './PaginationComponents';
import { useSelector } from 'react-redux';



const CardListContainer = ({ contentData, roomsCount, currentPage, setCurrentPage, maxPage, setClickRoom }) => {

    // 카드리스트 컨테이너 태그 참조(스크롤바 이동시킬 목적으로 사용)
    const cardListScrollRef = useRef();

    // 현재 로그인 사용자 wishList 가져오기
    const currentUserWishList = useSelector((state) => state.user.currentUser.wishList) ?? [];

    // 로그인 한 상태
    const isLogin = useSelector((state) => state.user.isLogin);
    console.log(currentUserWishList);
    console.log(isLogin);


    useEffect(() => {
        // 카드리스트 스크롤 초기화
        cardListScrollRef.current.scrollTop = 0;
    }, [currentPage]);



    return (
        <S.CardListContainer ref={cardListScrollRef}>
            <S.SideMarginWrapper>
                <S.AccommodationTotal>
                    <h6>숙소 {roomsCount}개 이상</h6>
                </S.AccommodationTotal>

                <S.CardListsWrapper>
                    {
                        contentData && contentData.map((cardList, i) => 
                            (
                                <CardListComponents key={i} cardList={cardList} index={i} setClickRoom={setClickRoom} currentUserWishList={currentUserWishList} isLogin={isLogin}/>
                            )
                        )
                    }
                </S.CardListsWrapper>

                {   // 페이지 수가 1 초과하면 페이지네이션 표시
                    maxPage > 1 ? <PaginationComponents currentPage={currentPage} setCurrentPage={setCurrentPage} maxPage={maxPage}/> : <></>
                }
            </S.SideMarginWrapper>
        </S.CardListContainer>
    );
};

export default CardListContainer;