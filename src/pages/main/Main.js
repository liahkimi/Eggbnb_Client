import React, { useEffect, useState } from 'react';
import S from './style';
import Banner from './MainBanner';
import Category from './CategorySlider';
import CategoryContents from './CategoryContents';
import TextBanner from './TextBanner';
import { useSearchParams } from 'react-router-dom';

const Main = () => {

    // const currentUser = useSelector((state)=>state.user.currentUser);
    // const userStatus = useSelector((state)=>state.user.isLogin);
    
    useEffect(()=>{
        // 선언문
        const header = document.querySelector("header");
        const search = document.querySelector("#searchBox");
        header.style.display = "flex";
        // 스크롤 이벤트시
        const scrollEvent = () => {
            let offsetTop = document.documentElement.scrollTop;
            // offset 400 이상일때 검색바 위로 작게붙이기
            if(offsetTop>400){
                header.style.position = "sticky";
                search.classList.remove("big","down","ldown");
            }else{
                header.style.position = "relative";
                search.classList.add("big","down");
            }
        }

        // 메인 진입시 헤더 디자인 변경
        let offsetTop = document.documentElement.scrollTop;
        if(offsetTop>400){
            header.style.position = "sticky";
            search.classList.remove("big","down","ldown");
        }else{
            header.style.position = "relative";
            search.classList.remove("ldown");
            search.classList.add("big","down");
        }
        // 메인 진입시 스크롤 맨 위로 이동
        window.scrollTo({ top: 0, behavior: "instant" });

        let offset = document.body.style.top;
        document.body.style.position = "unset";
        document.body.style.top = "unset";
        document.body.style.overflowY = "unset";
        document.body.style.width = "unset";
        window.scrollTo(0, offset.slice(0,-2) * -1);
        
        // 스크롤 이벤트
        window.addEventListener("scroll",scrollEvent);
        return ()=>{
            window.removeEventListener("scroll",scrollEvent);
        }
    },[])
    const [searchParams, setSearchParams] = useSearchParams('?cate=coolPool&lPrice=0&gPrice=1000000&maxUser=0&bedroom=0&bed=0&bathroom=0')
    const [roomList, setRoomList] = useState([]);
    useEffect(()=>{
        const getRoomList = async () => {
            const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/room/?${searchParams}`);
            const room = response.json();
            return room;
        };
        getRoomList()
        .then(({room}) => {
            setRoomList(room);
        });
    },[searchParams])
    return (
        <S.MainContainer>
            <Banner />
            <TextBanner />
            <S.CategoryContainer>
                <Category searchParams={searchParams} setSearchParams={setSearchParams} roomList={roomList}/>
            </S.CategoryContainer>
            <CategoryContents roomList={roomList} searchParams={searchParams}/>
        </S.MainContainer>
    );
};

export default Main;