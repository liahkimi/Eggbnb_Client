import { ThemeProvider } from 'styled-components';
import { RouterProvider } from 'react-router-dom';
import './App.css';

// 컴포넌트
import router from './routes/router';
import theme from './global/theme';
import GlobalStyle from './global/global';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUser, setUserStatus } from './modules/user';
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";

function App() {

  const currentUser = useSelector((state) => state.user.currentUser);
  const userStatus = useSelector((state) => state.user.userStatus);
  const dispatch = useDispatch();
  const queryClient = new QueryClient();

  // 최초 1번 토큰의 여부 검증
  useEffect(()=>{
    const isAuthenticate = async () => {
      try{

        if(!localStorage.getItem('token')){
          return;
        }
        const response = await fetch('https://port-0-eggbnb-server-jvpb2aln5lvkcq.sel5.cloudtype.app/user/auth', {
          method : 'POST',
          headers : {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          }
        })
        if(!response.ok){
          // 401 오류 발생 시 예외 처리
          if(response.status === 401){
            // console.warn('Authentication failed : Unauthorized');
            return;
          }
          throw new Error('Failed to authenticate');
        }
        const getAuthenticate = await response.json();
        return getAuthenticate;

      } catch (error) {
        // 인증 실패 시 처리
        return null;
      }
    }

    isAuthenticate()
      .then((res) => {

        if(!res){
          return;
        }

        let {message, ...user} = res;
  
        dispatch(setUser(user))
        dispatch(setUserStatus(true))
      })
      .catch((error)=>{
        // 에러 로깅 제거
        console.log('Error during authentication process', error);
      })

  }, [dispatch])



  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
          <GlobalStyle />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
