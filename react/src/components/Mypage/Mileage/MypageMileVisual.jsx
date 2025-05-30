import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ChartContainer, ButtonWrap, ChartLabel, ChartWrap, Container,
  Content, GreenBtn, MileageBox, NoDataBox, NoDataText, Title, WhiteBtn } from "./MypageMileVisual.style";
import URL_CONFIG from "../../../../conf";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_LABELS = ["자전거", "다회용기", "기타"];
const CATEGORY_COLORS = ["#81c784", "#ffb74d", "#64b5f6"];

const MypageMileVisual = () => {

  const navi = useNavigate();
  const token = sessionStorage.getItem("accessToken");
  const apiUrl = URL_CONFIG.API_URL;

  const [totalMile, setTotalMile] = useState(0); // 마일리지 총합
  const [categoryData, setCategoryData] = useState([0, 0, 0]); // 카테고리
  const [isAllZero, setIsAllZero] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);


  // 마일리지 총합 조회
  useEffect(() => {
    axios
      .get(`${apiUrl}/totalmile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTotalMile(res.data?.totalScore ?? 0);
      })
      .catch((err) => {
        console.error("총 마일리지 불러오기 실패:", err);
      });
  }, [apiUrl, token]);


  // 카테고리별 마일리지 총합 조회
  useEffect(() => {
    axios
      .get(`${apiUrl}/totalcategory`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { bikeTotal = 0, reuseTotal = 0, etcTotal = 0 } = res.data;
        const newData = [bikeTotal, reuseTotal, etcTotal];
        setCategoryData(newData);
        setIsAllZero(newData.every((n) => n === 0));
      })
      .catch((err) => {
        console.error("카테고리별 마일리지 불러오기 실패:", err);
        setCategoryData([0, 0, 0]);
        setIsAllZero(true);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, [apiUrl, token]);


  const consumedData = {
    labels: CATEGORY_LABELS,
    datasets: [
      {
        data: categoryData,
        backgroundColor: CATEGORY_COLORS,
        borderWidth: 1,
      },
    ],
  };

  return(
    <>
      <Container>
        <Title>마일리지 현황</Title>

        <Content>
          <MileageBox>
            <p>사용 가능한 마일리지</p>
            <strong>
              {totalMile}
              <span>마일리지</span>
            </strong>
          </MileageBox>

          <ChartWrap>
            <ChartContainer>
              {!isLoaded ? (
                <NoDataText>로딩 중...</NoDataText>
              ) : isAllZero ? (
                <NoDataBox>
                  <NoDataText>아직 적립 내역이 없습니다 😢</NoDataText>
                </NoDataBox>
              ) : (
                <Pie data={consumedData} />
              )}
            </ChartContainer>
            <ChartLabel>내가 적립한 마일리지</ChartLabel>
          </ChartWrap>
        </Content>

        <ButtonWrap>
          <GreenBtn onClick={() => navi("/mypage_mile")}>마일리지 신청 현황 바로가기</GreenBtn>
          <WhiteBtn onClick={() => navi("/mypage_main")}>뒤로가기</WhiteBtn>
        </ButtonWrap>
      </Container>
    </>
  );
};

export default MypageMileVisual;