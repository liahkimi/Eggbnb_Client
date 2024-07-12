import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Content from './ContentSlider';
import S from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import EmptyHeartButton from './EmptyHeartButton';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../modules/user';
import Spinner from '../../components/spinner/Spinner';

const CategoryContents = ({roomList, searchParams}) => {
    const currentUser = useSelector((state)=>state.user.currentUser);
    const dispatch = useDispatch();
    const [wishList, setWishList] = useState(currentUser.wishList);
    // console.log(currentUser)
    // console.log(wishList)
    const [loading, setLoading] = useState(false);
    const getPrice = [searchParams.get("lPrice"),searchParams.get("gPrice")]; // 가격범위 params 가져오기
    const getMaxUser = searchParams.get("maxUser"); // 최대인원 params 가져오기
    const getBedroom = searchParams.get("bedroom"); // 침실 params 가져오기
    const getBed = searchParams.get("bed"); // 침대 params 가져오기
    const getBathroom = searchParams.get("bathroom"); // 욕실 params 가져오기
    const filtered = roomList.filter((room)=>
        room.dayPrice>= getPrice[0] &&
        room.dayPrice<= getPrice[1] &&
        room.roomData.maxUser>= getMaxUser &&
        room.roomData.bedroom>= getBedroom &&
        room.roomData.bed>= getBed &&
        room.roomData.bathroom>= getBathroom
    )
    
    useEffect(()=>{
        // setLoading(true)
        if(currentUser=={}){
            return
        }
        const refreshWishList = async () => {
            await fetch('https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/', {
                method : "PATCH",
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
                body : JSON.stringify({
                    _id : currentUser._id,
                    wishList : wishList,
                })
            })
            .then((res)=>res.json())
            .then((info)=>{
                dispatch(setUser(info.user))
                // setWishList(info.user.wishList)
            })
            // setLoading(false);
        }
        if(wishList!==undefined && Object.keys(currentUser).length!==0)
        refreshWishList()
    },[wishList,dispatch])
    return (
        <S.CategoryContentBox>
            {
            // loading?
            filtered.length > 0?
            filtered.map((data,i)=>
                <div key={i} className="content">
                    <Link to={`/detail?roomId=${data._id}`}>
                        <div className="imgBox">
                            <Content img={data.roomImg}/>
                        </div>
                        <div className="textBox">
                            <div>
                                <div className="titleBox">
                                    <h6>{data.title}</h6>
                                </div>
                                <div className="addAndPriceBox">
                                    <span className="address">{data.address}</span>
                                </div>
                            </div>
                            <div>
                                <div className="linkBox">예약하기</div>
                                <span className="price">{"￦" + data.dayPrice.toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                    </Link>
                    <EmptyHeartButton roomid={data._id} wishList={currentUser.wishList} setWishList={setWishList}/>
                </div>
            )
            :
            <div className='filtered0'>
                <FontAwesomeIcon icon={faSearch}/>
                <h6>검색된 정보가 없습니다</h6>
            </div>
            // :
            // <Spinner />
            }
        </S.CategoryContentBox>
    );
};

export default CategoryContents;