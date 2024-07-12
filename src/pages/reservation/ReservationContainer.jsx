import React, { useEffect, useState } from 'react';
import S from './style';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import PrevButton from './PrevButton';
import { useSearchParams } from 'react-router-dom';


const ReservationContainer = () => {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get("roomId");
    const sdate = searchParams.get("sdate");
    const edate = searchParams.get("edate");
    const guests = searchParams.get("guests");
    const infants = searchParams.get("infants");
    const newEdate = new Date(edate);
    const newSdate = new Date(sdate);
    const days = newEdate.getDate() - newSdate.getDate();
    const [roomImg, setRoomImg] = useState([]);
    const [title, setTitle] = useState("");
    const [dayPrice, setDayPrice] = useState(0);
    const [cleanVat, setCleanVat] = useState(0);
    const datas = {
        roomId, sdate, edate, newSdate, newEdate, guests, infants, roomImg, title, dayPrice, cleanVat
    };
    useEffect(()=>{
        const roomData = async () => {
            const response = await fetch(`https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/booking/reservation?roomId=${roomId}`);
            return response.json();
        };
        
        roomData().then((res) => {
            setRoomImg(res.roomImg[0]);
            setTitle(res.title);
            setDayPrice(res.dayPrice);
            setCleanVat(res.cleanVat);
        });

    }, [roomId])

    // const [room, setRoom] = useState({});
    // const [user, setUser] = useState({});
    return (
        <S.ReservationContainer>
            <div className='bodyTop'>
                <PrevButton />
                <h2>확인 및 결제</h2>
            </div>
            <div className='LRcontainer'>
                <LeftSide datas={datas} days={days}/>
                <RightSide datas={datas} days={days} />
            </div>
        </S.ReservationContainer>
    );
};

export default ReservationContainer