import "./App.css";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Common/Footer/Footer";
import Header from "./components/Common/Header/Header";
import Home from "./components/Common/Home/Home";
import MileageInfo from "./components/Mileage/MileageInfo/MileageInfo";
import MypageMain from "./components/Mypage/MypageMain";
import Notices from "./components/Notice/Notices";
import NoticeDetail from "./components/Notice/NoticeDetail";
import NoticeWrite from "./components/Notice/NoticeWrite";
import MarketList from "./components/Market/MarketList";
import MileageForm from "./components/Mileage/MileageForm/MileageForm";
import MarketDetail from "./components/Market/MarketDetail";
import MarketForm from "./components/Market/MarketForm";
import MarketEdit from "./components/Market/MarketEdit";
import MypageInfo from "./components/Mypage/Member/MypageInfo";
import MypageQna from "./components/Mypage/Qna/MypageQna";
import MypageDelMember from "./components/Mypage/Member/MypageDelMember";
import MypageQnaForm from "./components/Mypage/Qna/MypageQnaForm";
import MypageQnaDetail from "./components/Mypage/Qna/MypageQnaDetail";
import ChallengeList from "./components/Challenge/ChallengeList";
import ChallengeWrite from "./components/Challenge/ChallengeWrite";
import ChallengeDetail from "./components/Challenge/ChallengeDetail";
import SignupForm from "./components/Signup/SignupForm";
import LoginForm from "./components/Login/LoginForm";
import MileageStore from "./components/Mileage/MileageStore/MileageStore";
import ChallengeEdit from "./components/Challenge/ChallengeEdit";
import NoticeEdit from "./components/Notice/NoticeEdit";
import MypageQnaWrite from "./components/Mypage/Qna/MypageQnaWrite";
import MypageMarket from "./components/Mypage/Market/MypageMarket";
import MypageMarketDetail from "./components/Mypage/Market/MypageMarketDetail";
import MypagePassword from "./components/Mypage/Member/MypagePassword";
import MypageMile from "./components/Mypage/Mileage/MypageMile";
import MypageMileVisual from "./components/Mypage/Mileage/MypageMileVisual";
import Member from "./components/admin/member/Member";
import AdminQna from "./components/Admin/Mypage/AdminQna";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          {/* 각자 라우트 추가하기~~ */}
          <Route path="/" element={<Home />} />
          {/* 공지사항 */}
          <Route path="/notices" element={<Notices />} />
          <Route path="/notices/:noticeId" element={<NoticeDetail />} />
          <Route path="/noticewrite" element={<NoticeWrite />} />
          <Route path="/notices/edit/:noticeId" element={<NoticeEdit />} />
          {/* 챌린지 */}
          <Route path="/challenges" element={<ChallengeList />} />
          <Route
            path="/challenges/:challengeSeq"
            element={<ChallengeDetail />}
          />
          <Route path="/challenges/write" element={<ChallengeWrite />} />
          <Route
            path="/challenges/edit/:challengeSeq"
            element={<ChallengeEdit />}
          />
          {/* 분류해서 모아주세요 */}
          <Route path="/mileageinfo" element={<MileageInfo />} />
          <Route path="/mileagestore" element={<MileageStore />} />

          {/* 마이페이지 */}
          <Route path="/mypage_main" element={<MypageMain />} />
          <Route path="/mypage_info" element={<MypageInfo />} />
          <Route path="/mypage_delMember" element={<MypageDelMember />} />
          <Route path="/mypage_qna" element={<MypageQna />} />
          <Route path="/mypage_qna_write" element={<MypageQnaWrite />} />{" "}
          {/* 새글 작성 */}
          <Route path="/mypage_qna_form/:id" element={<MypageQnaForm />} />{" "}
          {/* 글 수정 */}
          <Route path="/mypage_qna/:id" element={<MypageQnaDetail />} />
          {/* 나의 게시글 메인 */}
          <Route path="/mypage_market" element={<MypageMarket />} />
          {/* 나의 게시글 상세 */}
          <Route path="/mypage_market/:marketNo" element={<MypageMarketDetail />}/>
          {/* 비밀번호 변경 */}
          <Route path="/mypage_password" element={<MypagePassword />} />
          {/* 마일리지 현황 */}
          <Route path="/mypage_mile" element={<MypageMile />} /> 
          {/* 마일리지 시각화 페이지 */}
          <Route path="/mypage_mile_visual" element={<MypageMileVisual />} />

          {/* 중고거래 */}
          <Route path="/market_list" element={<MarketList />} />
          <Route path="/mileage-form" element={<MileageForm />} />
          <Route path="/markets/:marketNo" element={<MarketDetail />} />
          <Route path="/marketform" element={<MarketForm />} />
          <Route path="/markets/edit/:marketNo" element={<MarketEdit />} />

          {/* 회원가입 */}
          <Route path="/signup" element={<SignupForm />} />
          {/* 로그인 */}
          <Route path="/login" element={<LoginForm />} />
          {/* 관리자 회원관리 */}
          <Route path="/admin/member" element={<Member />} />

          {/* 관리자 마이페이지 Q&A */}
          <Route path="/admin/mypage/qna" element={<AdminQna />} />

        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
