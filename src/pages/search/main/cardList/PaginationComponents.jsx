import React from 'react';
import S from './style';

import { faGreaterThan, faLessThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';

const PaginationComponents = ({ maxPage }) => {

    let pageNumber = [];
    // 배열에 1 ~ maxPage까지 채워넣기
    for (let i = 0; i < maxPage; i++) {
        pageNumber[i] = i + 1;
    }

    // 제일 첫 페이지, 마지막 페이지
    const firstPage = pageNumber[0];
    const lastPage = pageNumber[pageNumber.length - 1];

    const currentPage = +useParams().currentPage;

    const navigate = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();


    // 페이지 클릭 함수
    const pagenationClickEvent = (e) => {
        navigate(`${+e.currentTarget.innerText}/?${searchParams.toString()}`);
    };

    // 이전 페이지 클릭 함수
    const prevClickEvent = () => {
        if (currentPage > firstPage) {
            navigate(`${+currentPage - 1}/?${searchParams.toString()}`);
        }
    };

    // 다음 페이지 클릭 함수
    const nextClickEvent = () => {
        if (currentPage < lastPage) {
            navigate(`${+currentPage + 1}/?${searchParams.toString()}`);
        }
    };


    
    return (
        <S.pageNumberContaner>
            <S.PrevButton onClick={prevClickEvent} className={currentPage === firstPage ? "prevDisabled" : ""}>
                <FontAwesomeIcon icon={faLessThan} />
            </S.PrevButton>

            {
                pageNumber.map((page, i) => (
                    <S.PageButton className={currentPage === page ? "pageActive" : ""} key={i} onClick={pagenationClickEvent}>
                        <div>{page}</div>
                    </S.PageButton>
                ))
            }

            <S.NextButton onClick={nextClickEvent} className={currentPage === lastPage ? "nextDisabled" : ""}>
                <FontAwesomeIcon icon={faGreaterThan} />
            </S.NextButton>
        </S.pageNumberContaner>
    );
};

export default PaginationComponents;